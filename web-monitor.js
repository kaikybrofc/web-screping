const axios = require("axios");
const fs = require("fs");
const cheerio = require("cheerio");
const { summarizeUrl } = require("./summarizer.js");

// --- CONFIGURAÇÃO ---
const URL_TO_MONITOR = "https://animenew.com.br/noticias/animes/";
const CHECK_INTERVAL_MS = 43200000; // Atualizado para 12 horas (43.200.000 ms)
const path = require("path");
const LOG_FILE = path.resolve(__dirname, "latest_news.log");
// --- FIM DA CONFIGURAÇÃO ---

let lastKnownTopArticleUrl = "";

console.log(`Iniciando monitoramento de notícias em: ${URL_TO_MONITOR}`);
console.log(`Verificando a cada ${CHECK_INTERVAL_MS / 1000 / 60} minutos.`);
console.log(`Todos os resumos e um resumão serão salvos em: ${LOG_FILE}`);
console.log(`Caminho absoluto do arquivo de log: ${LOG_FILE}`);

const checkPageForNews = async () => {
  try {
    console.log("Buscando página e procurando por notícias...");
    const response = await axios.get(URL_TO_MONITOR, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
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
          if (jsonData["@type"] === "ItemList" && jsonData.itemListElement) {
            itemList = jsonData.itemListElement;
            return false;
          }
        } catch (e) {
          /* Ignora erros */
        }
      }
    });

    if (!itemList || itemList.length === 0) {
      console.log(
        'Não foi possível encontrar uma "ItemList" válida nos dados da página.'
      );
      console.log(
        "Verifique se a estrutura da página mudou ou se há bloqueio de acesso."
      );
      return;
    }

    // Processa todos os itens da lista
    let allSummaries = [];
    let resumaoTextos = [];
    for (const article of itemList) {
      console.log(`Processando: ${article.name}`);
      let summary = "";
      try {
        summary = await summarizeUrl(article.url);
      } catch (e) {
        console.error(`Erro ao resumir notícia (${article.url}):`, e);
        summary = "[ERRO AO RESUMIR]";
      }
      const timestamp = new Date().toISOString();
      let logEntry = `[${timestamp}] ${article.name}\nURL: ${article.url}\nRESUMO: ${summary}\n\n`;
      allSummaries.push(logEntry);
      resumaoTextos.push(`- ${article.name}: ${summary}`);
    }

    // Gera o resumão geral
    let resumao =
      resumaoTextos.length > 0
        ? resumaoTextos.join("\n")
        : "Nenhum resumo gerado.";
    let resumaoEntry = `========== RESUMÃO GERAL ==========\n${resumao}\n===================================\n\n`;

    // Salva todos os resumos e o resumão no log
    try {
      fs.appendFileSync(LOG_FILE, allSummaries.join("") + resumaoEntry);
      console.log(`Todos os resumos e o resumão salvos em ${LOG_FILE}`);
    } catch (e) {
      console.error("Erro ao escrever no arquivo de log:", e);
    }
    // Atualiza a última notícia conhecida
    lastKnownTopArticleUrl = itemList[0].url;
  } catch (error) {
    console.error("Ocorreu um erro:", error);
  }
};

checkPageForNews();
setInterval(checkPageForNews, CHECK_INTERVAL_MS);
