const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const { summarizeHtml } = require('./summarizer.js');

// --- CONFIGURAÇÃO ---
const URL_TO_MONITOR = 'https://animenew.com.br/noticias/animes/';
const CHECK_INTERVAL_MS = 900000; // 15 minutos
const PORT = process.env.PORT || 3000;
// --- FIM DA CONFIGURAÇÃO ---

const app = express();
const knownArticleUrls = new Set(); // Guarda todas as URLs que já vimos
let processedArticles = []; // Guarda uma lista de todos os artigos processados

// Endpoint da API para servir a lista de notícias
app.get('/api/latest-news', (req, res) => {
    if (processedArticles.length > 0) {
        res.json(processedArticles);
    } else {
        res.status(404).json({ message: 'Nenhuma notícia foi processada ainda. Verifique novamente em alguns instantes.' });
    }
});

/**
 * Recebe as informações de um artigo, busca seu HTML, gera o resumo
 * e retorna um objeto completo com todos os dados.
 * @param {object} articleInfo - O objeto do artigo vindo do JSON-LD.
 * @returns {Promise<object>} O objeto completo com dados refinados e brutos.
 */
async function processArticle(articleInfo) {
    try {
        console.log(`   -> Processando: ${articleInfo.name}`);
        const articlePageResponse = await axios.get(articleInfo.url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
        });
        const articleHtml = articlePageResponse.data;
        const summary = await summarizeHtml(articleHtml);

        return {
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
        return null; // Retorna nulo se o processamento de um artigo falhar
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

        // Filtra para encontrar apenas os artigos que ainda não vimos
        const newArticles = itemList.filter(article => !knownArticleUrls.has(article.url));

        if (newArticles.length > 0) {
            const initialRun = knownArticleUrls.size === 0;
            console.log(`   -> ${initialRun ? 'Inicialização:' : 'Novas notícias detectadas:'} ${newArticles.length} artigo(s) para processar.`);

            // Processa todos os novos artigos em paralelo
            const processingPromises = newArticles.map(processArticle);
            const newlyProcessed = (await Promise.all(processingPromises)).filter(Boolean); // .filter(Boolean) remove os nulos de artigos que falharam

            if (newlyProcessed.length > 0) {
                // Adiciona os novos artigos processados no início da lista
                processedArticles = [...newlyProcessed, ...processedArticles];
                // Adiciona as URLs dos novos artigos à nossa lista de conhecidos
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

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}. Acesse a API em http://localhost:${PORT}/api/latest-news`);
    console.log('Iniciando o monitoramento de notícias...');
    checkPageForNews(); // Roda imediatamente ao iniciar
    setInterval(checkPageForNews, CHECK_INTERVAL_MS);
});