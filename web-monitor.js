const axios = require('axios');
const fs = require('fs');
const cheerio = require('cheerio');
const { summarizeUrl } = require('./summarizer.js');

// --- CONFIGURAÇÃO ---
const URL_TO_MONITOR = 'https://animenew.com.br/noticias/animes/';
const CHECK_INTERVAL_MS = 900000; // Aumentado para 15 minutos para não sobrecarregar a API
const LOG_FILE = 'latest_news.log';
// --- FIM DA CONFIGURAÇÃO ---

let lastKnownTopArticleUrl = '';

console.log(`Iniciando monitoramento de notícias em: ${URL_TO_MONITOR}`);
console.log(`Verificando a cada ${CHECK_INTERVAL_MS / 1000 / 60} minutos.`);
console.log(`A notícia mais recente e seu resumo serão salvos em: ${LOG_FILE}`);

const checkPageForNews = async () => {
    try {
        console.log('Buscando página e procurando por notícias...');
        const response = await axios.get(URL_TO_MONITOR, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const htmlContent = response.data;
        const $ = cheerio.load(htmlContent);

        const scripts = $('script[type="application/ld+json"]');
        let itemList = null;

        scripts.each((i, script) => {
            const jsonLdString = $(script).html();
            if (jsonLdString) {
                try {
                    const jsonData = JSON.parse(jsonLdString);
                    if (jsonData['@type'] === 'ItemList' && jsonData.itemListElement) {
                        itemList = jsonData.itemListElement;
                        return false;
                    }
                } catch (e) { /* Ignora erros */ }
            }
        });

        if (!itemList || itemList.length === 0) {
            console.log('Não foi possível encontrar uma "ItemList" válida nos dados da página.');
            return;
        }

        const topArticle = itemList[0];

        if (lastKnownTopArticleUrl && topArticle.url !== lastKnownTopArticleUrl) {
            console.log('NOVA NOTÍCIA ENCONTRADA!');
            const summary = await summarizeUrl(topArticle.url);
            const timestamp = new Date().toISOString();
            let logEntry = `[${timestamp}] ${topArticle.name}\nURL: ${topArticle.url}\nRESUMO: ${summary}\n\n`;
            fs.appendFileSync(LOG_FILE, logEntry);
            console.log(`Notícia e resumo salvos em ${LOG_FILE}`);

        } else if (!lastKnownTopArticleUrl) {
            console.log('Primeira execução: Armazenando e resumindo a notícia do topo.');
            console.log(`-> Notícia atual: ${topArticle.name}`);
            
            // **CHAMADA DA IA NA PRIMEIRA EXECUÇÃO**
            const summary = await summarizeUrl(topArticle.url);
            const timestamp = new Date().toISOString();
            let logEntry = `[${timestamp}] ${topArticle.name}\nURL: ${topArticle.url}\nRESUMO: ${summary}\n\n`;
            fs.appendFileSync(LOG_FILE, logEntry);
            console.log(`Notícia inicial e resumo salvos em ${LOG_FILE}`);

        } else {
            console.log('Nenhuma notícia nova no topo da lista.');
        }

        lastKnownTopArticleUrl = topArticle.url;

    } catch (error) {
        console.error('Ocorreu um erro:', error.message);
    }
};

checkPageForNews();
setInterval(checkPageForNews, CHECK_INTERVAL_MS);
