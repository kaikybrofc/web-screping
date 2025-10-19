const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { summarizeHtml } = require('../services/summarizer.js');
const logger = require('../utils/logger.js');

// --- CONFIGURAÇÃO ---
const URL_TO_MONITOR = 'https://animenew.com.br/noticias/animes/';
const CHECK_INTERVAL_MS = 900000; // 15 minutos
const EXPIRATION_TIME_MS = 24 * 60 * 60 * 1000; // 24 horas
const CLEANUP_INTERVAL_MS = 60 * 60 * 1000; // 1 hora
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.resolve(__dirname, '..', 'data', 'processed_articles.json');
// --- FIM DA CONFIGURAÇÃO ---

const app = express();
const knownArticleUrls = new Set();
let processedArticles = [];

// Garante que o diretório de dados exista
const dataDir = path.dirname(DATA_FILE);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

function loadArticlesFromFile() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const data = fs.readFileSync(DATA_FILE, 'utf8');
            processedArticles = JSON.parse(data);
            processedArticles.forEach(article => knownArticleUrls.add(article.refined.url));
            logger.success(`Carregados ${processedArticles.length} artigos do cache local.`);
        } else {
            logger.info('Nenhum arquivo de cache local encontrado. Começando do zero.');
        }
    } catch (error) {
        logger.error('Erro ao carregar ou analisar o arquivo de cache local:', error);
        processedArticles = []; // Começa do zero se o arquivo estiver corrompido
    }
}

function saveArticlesToFile() {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(processedArticles, null, 2), 'utf8');
        logger.info(`Notícias salvas com sucesso em ${DATA_FILE}`);
    } catch (error) {
        logger.error('Erro ao salvar notícias no arquivo:', error);
    }
}

app.get('/', (req, res) => {
    if (processedArticles.length > 0) {
        res.json(processedArticles);
    } else {
        res.status(404).json({ message: 'Nenhuma notícia foi processada ainda. Verifique novamente em alguns instantes.' });
    }
});

async function processArticle(articleInfo) {
    try {
        logger.info(`Processando: ${articleInfo.name}`);
        const articlePageResponse = await axios.get(articleInfo.url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
        });
        const summary = await summarizeHtml(articlePageResponse.data);

        const id = crypto.createHash('sha1').update(articleInfo.url).digest('hex');

        return {
            id: id,
            timestamp: new Date().toISOString(),
            refined: {
                name: articleInfo.name,
                url: articleInfo.url,
                image: articleInfo.image,
                summary: summary
            }
        };
    } catch (error) {
        logger.error(`Erro ao processar o artigo "${articleInfo.name}":`, error.message);
        return null;
    }
}

async function checkPageForNews() {
    try {
        logger.info('Verificando a página de notícias...');
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
            logger.warn('Nenhuma ItemList encontrada.'); return;
        }

        const newArticles = itemList.filter(article => !knownArticleUrls.has(article.url));

        if (newArticles.length > 0) {
            const initialRun = knownArticleUrls.size === 0;
            logger.info(`${initialRun ? 'Inicialização:' : 'Novas notícias detectadas:'} ${newArticles.length} artigo(s) para processar.`);

            const processingPromises = newArticles.map(processArticle);
            const newlyProcessed = (await Promise.all(processingPromises)).filter(Boolean);

            if (newlyProcessed.length > 0) {
                processedArticles = [...newlyProcessed, ...processedArticles];
                newlyProcessed.forEach(article => knownArticleUrls.add(article.refined.url));
                logger.success(`${newlyProcessed.length} artigo(s) adicionado(s) à API.`);
                saveArticlesToFile(); // Salva após adicionar novos artigos
            }

        } else {
            logger.info('Nenhuma notícia nova encontrada.');
        }
    } catch (error) {
        logger.error('Ocorreu um erro no loop de verificação:', error.message);
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
        logger.info(`[Manutenção] Removidos ${removedCount} artigo(s) expirado(s).`);
        saveArticlesToFile(); // Salva após a limpeza
    }
}

app.listen(PORT, () => {
    logger.success(`Servidor rodando na porta ${PORT}.`);
    loadArticlesFromFile(); // Carrega os artigos ao iniciar
    logger.info('Iniciando o monitoramento de notícias...');
    checkPageForNews();
    setInterval(checkPageForNews, CHECK_INTERVAL_MS);
    setInterval(cleanupExpiredArticles, CLEANUP_INTERVAL_MS);
});
