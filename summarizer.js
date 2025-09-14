require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cheerio = require("cheerio");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function extractArticleText(htmlContent) {
  const $ = cheerio.load(htmlContent);
  const articleText = $(".entry-content").text();
  return articleText.trim();
}

/**
 * Gera um resumo a partir de um conteúdo HTML usando a API do Gemini.
 * @param {string} htmlContent - O conteúdo HTML da página da notícia.
 * @returns {Promise<string>} O resumo da notícia.
 */
async function summarizeHtml(htmlContent) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("A variável de ambiente GEMINI_API_KEY não foi definida.");
  }

  try {
    const articleText = extractArticleText(htmlContent);

    if (!articleText) {
      console.log(
        "   -> [Resumo] Não foi possível extrair o texto do artigo para resumir."
      );
      return "Não foi possível extrair o conteúdo para resumo.";
    }

    console.log("   -> [Resumo] Enviando texto para a IA do Gemini...");
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `Resuma a seguinte notícia. 
Destaque o anúncio principal (como data, estúdio, lançamento, etc.), 
explique brevemente o contexto para melhor entendimento 
e acrescente um comentário curto sobre a relevância ou possível impacto do anúncio:\n\n"${articleText}"`;

    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    console.log("   -> [Resumo] Resumo recebido.");
    return summary;
  } catch (error) {
    console.error("   -> [Resumo] Erro ao gerar resumo:", error.message);
    return "Ocorreu um erro durante o resumo.";
  }
}

module.exports = { summarizeHtml };
