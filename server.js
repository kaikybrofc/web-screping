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
let lastKnownTopArticleUrl = '';
let latestArticleData = {}; // Armazena os dados da última notícia em memória

// Endpoint da API para servir os dados mais recentes
app.get('/api/latest-news', (req, res) => {
    if (latestArticleData.refined) {
        res.json(latestArticleData);
    } else {
        res.status(404).json({ message: 'Nenhuma notícia foi processada ainda. Verifique novamente em alguns instantes.' });
    }
});

async function processNewArticle(articleInfo) {
    try {
        console.log(`   -> Processando: ${articleInfo.name}`);
        // 1. Buscar o HTML completo da página da notícia
        const articlePageResponse = await axios.get(articleInfo.url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
        });
        const articleHtml = articlePageResponse.data;

        // 2. Gerar o resumo a partir do HTML buscado
        const summary = await summarizeHtml(articleHtml);

        // 3. Montar o objeto de dados completo
        latestArticleData = {
            timestamp: new Date().toISOString(),
            refined: {
                name: articleInfo.name,
                url: articleInfo.url,
                image: articleInfo.image,
                summary: summary
            },
            raw: {
                html: articleHtml
            }
        };
        console.log(`   -> Dados de "${articleInfo.name}" atualizados e prontos na API.`);

    } catch (error) {
        console.error('   -> Erro ao processar novo artigo:', error.message);
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

        const topArticle = itemList[0];

        if (topArticle.url !== lastKnownTopArticleUrl) {
            console.log(`   -> Nova notícia encontrada: ${topArticle.name}`);
            lastKnownTopArticleUrl = topArticle.url;
            await processNewArticle(topArticle);
        } else {
            console.log('   -> Nenhuma notícia nova no topo da lista.');
        }
    } catch (error) {
        console.error('Ocorreu um erro no loop de verificação:', error.message);
    }
}

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}. Acesse a API em http://localhost:${PORT}/api/latest-news`);
    console.log('Iniciando o monitoramento de notícias...');
    checkPageForNews(); // Roda imediatamente ao iniciar
    setInterval(checkPageForNews, CHECK_INTERVAL_MS); // E depois a cada X minutos
});
