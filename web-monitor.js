const axios = require('axios');
const fs = require('fs');
const cheerio = require('cheerio');

// --- CONFIGURAÇÃO ---
const URL_TO_MONITOR = 'https://animenew.com.br/noticias/animes/'; // <-- URL para monitorar
const CHECK_INTERVAL_MS = 60000; // Intervalo de verificação em milissegundos
const LOG_FILE = 'latest_news.log';
// --- FIM DA CONFIGURAÇÃO ---

let lastKnownTopArticleUrl = '';

console.log(`Iniciando monitoramento de notícias em: ${URL_TO_MONITOR}`);
console.log(`Verificando a cada ${CHECK_INTERVAL_MS / 1000} segundos.`);
console.log(`A notícia mais recente será salva em: ${LOG_FILE}`);

const checkPageForNews = async () => {
    try {
        console.log('Buscando página e procurando por novas notícias...');
        const response = await axios.get(URL_TO_MONITOR, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const htmlContent = response.data;
        const $ = cheerio.load(htmlContent);

        const scripts = $('script[type="application/ld+json"]');
        let itemList = null;

        // Itera sobre todos os scripts ld+json encontrados
        scripts.each((i, script) => {
            const jsonLdString = $(script).html();
            if (jsonLdString) {
                try {
                    const jsonData = JSON.parse(jsonLdString);
                    // Verifica se este é o JSON correto que contém a lista de itens
                    if (jsonData['@type'] === 'ItemList' && jsonData.itemListElement) {
                        itemList = jsonData.itemListElement;
                        return false; // Para o loop, pois já encontramos o que queríamos
                    }
                } catch (e) {
                    // Ignora erros de parse, pois alguns scripts podem não ser JSON válidos
                }
            }
        });

        if (!itemList || itemList.length === 0) {
            console.log('Não foi possível encontrar uma "ItemList" válida nos dados da página.');
            return;
        }

        const topArticle = itemList[0];

        if (lastKnownTopArticleUrl && topArticle.url !== lastKnownTopArticleUrl) {
            console.log('NOVA NOTÍCIA ENCONTRADA!');
            const timestamp = new Date().toISOString();
            const logEntry = `[${timestamp}] ${topArticle.name}\nURL: ${topArticle.url}\n\n`;
            
            fs.appendFileSync(LOG_FILE, logEntry);
            console.log(`Notícia salva em ${LOG_FILE}`);

        } else if (!lastKnownTopArticleUrl) {
            console.log('Armazenando a notícia do topo atual para futuras comparações.');
            console.log(`-> Notícia atual: ${topArticle.name}`);
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
