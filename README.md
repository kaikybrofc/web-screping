
# Web Scraping e Resumo Automático de Notícias de Anime

Este projeto realiza o monitoramento automático da página de notícias de animes do site [AnimeNew](https://animenew.com.br/noticias/animes/), detectando novas notícias e gerando resumos automáticos utilizando a API Gemini da Google (Google Generative AI). O objetivo é facilitar o acompanhamento das novidades do mundo dos animes, entregando resumos claros e rápidos de cada notícia publicada.

## Funcionalidades
- Monitora periodicamente a página de notícias (intervalo padrão: 15 minutos).
- Detecta automaticamente quando uma nova notícia é publicada.
- Extrai o conteúdo principal da notícia usando web scraping (cheerio).
- Gera um resumo conciso e objetivo via IA (Gemini API).
- Salva o título, URL, data/hora e resumo em um arquivo de log (`latest_news.log`).
- Fácil configuração e execução.

## Pré-requisitos
- Node.js (v16 ou superior recomendado)
- Conta Google com acesso à API Gemini (Google Generative AI)
- Chave de API Gemini válida

## Instalação
1. Clone este repositório ou baixe os arquivos.
2. Instale as dependências do projeto:
   ```bash
   npm install
   ```
3. Crie um arquivo `.env` na raiz do projeto e adicione sua chave Gemini:
   ```env
   GEMINI_API_KEY=sua_chave_gemini_aqui
   ```

## Como usar

Execute o monitoramento com:
```bash
npm start
```
O script irá buscar a notícia mais recente, gerar um resumo e salvar no arquivo `latest_news.log`. A cada 15 minutos (configurável), ele verifica se há novidades e registra apenas notícias inéditas.

### Exemplo de entrada no arquivo de log:
```
[2025-09-13T12:34:56.789Z] Novo anime anunciado para 2026!
URL: https://animenew.com.br/noticias/animes/novo-anime-2026
RESUMO: O estúdio XYZ anunciou um novo anime previsto para 2026, com produção de grandes nomes do setor...
```

### Alterando o intervalo de checagem
No arquivo `web-monitor.js`, altere o valor da constante `CHECK_INTERVAL_MS` para definir o intervalo desejado (em milissegundos).

## Estrutura dos Arquivos
- `web-monitor.js`: Script principal de monitoramento, detecção de novas notícias e logging.
- `summarizer.js`: Responsável por extrair o texto do artigo e gerar o resumo via IA.
- `latest_news.log`: Log das notícias resumidas (criado automaticamente).
- `package.json`: Dependências e scripts do projeto.

## Dicas e Observações
- O seletor CSS para extração do texto principal está ajustado para o layout atual do site. Caso o site mude, edite a função `extractArticleText` em `summarizer.js`.
- O uso da API Gemini pode gerar custos dependendo do volume de requisições. Consulte sua cota no painel do Google.
- O script pode ser adaptado para monitorar outros sites, bastando ajustar a URL e o seletor de conteúdo.

## Troubleshooting
- **Erro: "A variável de ambiente GEMINI_API_KEY não foi definida."**
   - Verifique se o arquivo `.env` está presente e corretamente preenchido.
- **Resumo não extraído corretamente:**
   - O layout do site pode ter mudado. Ajuste o seletor CSS em `summarizer.js`.
- **Problemas de conexão:**
   - Verifique sua internet e se o site está online.

## Licença
ISC

---

Desenvolvido por KaikyBroFC. Dúvidas ou sugestões? Abra uma issue!
