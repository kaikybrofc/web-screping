require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");
const cheerio = require("cheerio");

// Pega a chave da API das variáveis de ambiente
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Extrai o texto principal de uma página de notícia.
 * @param {string} htmlContent - O conteúdo HTML da página.
 * @returns {string} O texto extraído do artigo.
 */
function extractArticleText(htmlContent) {
  const $ = cheerio.load(htmlContent);
  // Esta é a parte mais sensível. O seletor abaixo tenta encontrar o conteúdo principal do post.
  // inspecionei uma notícia do site e o conteúdo principal parece estar dentro de uma div com a classe "entry-content".
  // Se os resumos falharem, este seletor pode precisar de ajuste.
  const articleText = $(".entry-content").text();
  return articleText.trim();
}

/**
 * Gera um resumo de uma URL usando a API do Gemini.
 * @param {string} url - A URL da notícia para resumir.
 * @returns {Promise<string>} O resumo da notícia.
 */
async function summarizeUrl(url) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("A variável de ambiente GEMINI_API_KEY não foi definida.");
  }

  try {
    console.log(`   -> [Resumo] Buscando conteúdo de: ${url}`);
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    const articleText = extractArticleText(response.data);

    if (!articleText) {
      console.log(
        "   -> [Resumo] Não foi possível extrair o texto do artigo. O seletor pode estar incorreto."
      );
      return "Não foi possível extrair o conteúdo para resumo.";
    }

    console.log("   -> [Resumo] Enviando texto para a IA do Gemini...");
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `Faça um resumo conciso da seguinte notícia, focando no anúncio principal (como data, estúdio, etc):\n\n"${articleText}"`;

    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    console.log("   -> [Resumo] Resumo recebido.");
    return summary;
  } catch (error) {
    console.error("   -> [Resumo] Erro ao gerar resumo:", error.message);
    return "Ocorreu um erro durante o resumo.";
  }
}

// Exporta a função para que outros arquivos possam usá-la
module.exports = { summarizeUrl };
