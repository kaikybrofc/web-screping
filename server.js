const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const crypto = require('crypto'); // Importa o módulo de criptografia
const { summarizeHtml } = require('./summarizer.js');

// --- CONFIGURAÇÃO ---
const URL_TO_MONITOR = 'https://animenew.com.br/noticias/animes/';
const CHECK_INTERVAL_MS = 900000; // 15 minutos
const EXPIRATION_TIME_MS = 24 * 60 * 60 * 1000; // 24 horas
const CLEANUP_INTERVAL_MS = 60 * 60 * 1000; // 1 hora (para rodar a limpeza)
const PORT = process.env.PORT || 3000;
// --- FIM DA CONFIGURAÇÃO ---

const app = express();
const knownArticleUrls = new Set();
let processedArticles = [];

app.get('/api/latest-news', (req, res) => {
    if (processedArticles.length > 0) {
        res.json(processedArticles);
    } else {
        res.status(404).json({ message: 'Nenhuma notícia foi processada ainda. Verifique novamente em alguns instantes.' });
    }
});

async function processArticle(articleInfo) {
    try {
        console.log(`   -> Processando: ${articleInfo.name}`);
        const articlePageResponse = await axios.get(articleInfo.url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
        });
        const summary = await summarizeHtml(articlePageResponse.data);

        // Gera um ID único baseado na URL
        const id = crypto.createHash('sha1').update(articleInfo.url).digest('hex');

        return {
            id: id, // Adiciona o ID único
            timestamp: new Date().toISOString(),
            refined: {
                name: articleInfo.name,
                url: articleInfo.url,
                image: articleInfo.image,
                summary: summary
            }
        };
    } catch (error) {
        console.error(`   -> Erro ao processar o artigo "${articleInfo.name}":`, error.message);
        return null;
    }
}

async function checkPageForNews() {
    try {
        console.log('Verificando a página de notícias...');
        const response = await axios.get(URL_TO_MONITOR, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' } });
        const $ = cheerio.load(response.data);
        const scripts = $('script[type="application/ld+json"]');
        let itemList = null;

        scripts.each((i, script) => {
            const jsonLdString = $(script).html();
            if (jsonLdString) {
                try {
                    const jsonData = JSON.parse(jsonLdString);
                    if (jsonData['@type'] === 'ItemList' && jsonData.itemListElement) {
                        itemList = jsonData.itemListElement; return false;
                    }
                } catch (e) { /* Ignora */ }
            }
        });

        if (!itemList || itemList.length === 0) {
            console.log('   -> Nenhuma ItemList encontrada.'); return;
        }

        const newArticles = itemList.filter(article => !knownArticleUrls.has(article.url));

        if (newArticles.length > 0) {
            const initialRun = knownArticleUrls.size === 0;
            console.log(`   -> ${initialRun ? 'Inicialização:' : 'Novas notícias detectadas:'} ${newArticles.length} artigo(s) para processar.`);

            const processingPromises = newArticles.map(processArticle);
            const newlyProcessed = (await Promise.all(processingPromises)).filter(Boolean);

            if (newlyProcessed.length > 0) {
                processedArticles = [...newlyProcessed, ...processedArticles];
                newlyProcessed.forEach(article => knownArticleUrls.add(article.refined.url));
                console.log(`   -> ${newlyProcessed.length} artigo(s) adicionado(s) à API.`);
            }

        } else {
            console.log('   -> Nenhuma notícia nova encontrada.');
        }
    } catch (error) {
        console.error('Ocorreu um erro no loop de verificação:', error.message);
    }
}

function cleanupExpiredArticles() {
    const now = Date.now();
    const originalCount = processedArticles.length;
    processedArticles = processedArticles.filter(article => {
        const articleAge = now - new Date(article.timestamp).getTime();
        return articleAge < EXPIRATION_TIME_MS;
    });
    const removedCount = originalCount - processedArticles.length;
    if (removedCount > 0) {
        console.log(`[Manutenção] Removidos ${removedCount} artigo(s) expirado(s).`);
    }
}

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}. Acesse a API em http://localhost:${PORT}/api/latest-news`);
    console.log('Iniciando o monitoramento de notícias...');
    checkPageForNews();
    setInterval(checkPageForNews, CHECK_INTERVAL_MS);
    // Inicia o processo de limpeza em background
    setInterval(cleanupExpiredArticles, CLEANUP_INTERVAL_MS);
});
