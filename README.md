<p align="center">
   <img src="https://animenew.com.br/wp-content/uploads/2024/07/animenew.com_.br_.png" alt="AnimeNew Logo" width="300"/>
</p>


# Projeto no GitHub

>[Repositório oficial no GitHub](https://github.com/kaikybrofc/web-screping)

**Dados do repositório:**
- Autor: [KaikyBroFC](https://github.com/kaikybrofc)
- Licença: MIT
- Linguagem principal: JavaScript
- Última atualização: 2025
- Issues, Pull Requests e contribuições abertas!

# AVISO DE USO E POLÍTICA

> **Este projeto é destinado exclusivamente para fins de estudo, aprendizado e demonstração técnica.**
>
> - Não utilize este código para fins comerciais, automação em larga escala ou qualquer atividade que viole os Termos de Uso do site monitorado ou de terceiros.
> - O uso de web scraping pode ser proibido por alguns sites. Sempre consulte e respeite a política de uso (Terms of Service/Política de Privacidade) do site alvo.
> - O autor não se responsabiliza por qualquer uso indevido deste projeto.


# Web Scraping e Resumo Automático de Notícias de Anime

Este projeto realiza o monitoramento automático da página de notícias de animes do site [AnimeNew](https://animenew.com.br/noticias/animes/), detectando novas notícias e gerando resumos automáticos utilizando a API Gemini da Google (Google Generative AI). O objetivo é facilitar o acompanhamento das novidades do mundo dos animes, entregando resumos claros e rápidos de cada notícia publicada.

## Funcionalidades
- Monitora periodicamente a página de notícias (intervalo padrão: **12 horas**).
- Busca **todos** os itens da lista de notícias a cada execução.
- Gera um resumo individual para cada notícia via IA (Gemini API).
- Cria e salva um **resumão geral** agregando todos os resumos individuais.
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

## Como adaptar para outros sites

Você pode modificar este projeto para monitorar e resumir notícias de outros sites. Para isso, siga os passos abaixo:

1. **Altere a URL monitorada:**
   - No arquivo `web-monitor.js`, modifique o valor da constante `URL_TO_MONITOR` para a página de notícias desejada.

2. **Ajuste o seletor de extração de texto:**
   - No arquivo `summarizer.js`, edite a função `extractArticleText` para usar o seletor CSS correto do conteúdo principal do novo site.
   - Utilize ferramentas de inspeção do navegador para identificar a classe, id ou tag que contém o texto da notícia.

3. **Adapte a lógica de busca de links:**
   - Se o novo site não usar o mesmo padrão de dados estruturados (JSON-LD), será necessário adaptar a lógica de extração de URLs das notícias em `web-monitor.js`.
   - Você pode usar seletores do Cheerio para buscar links diretamente no HTML.

4. **Teste e ajuste:**
   - Execute o script e verifique se o texto está sendo extraído corretamente e se os resumos fazem sentido.
   - Ajuste os seletores e lógica conforme necessário.

Se precisar de ajuda para adaptar para um site específico, abra uma issue ou entre em contato!

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
MIT

---

**Desenvolvido por [KaikyBroFC](https://github.com/kaikybrofc)**

Dúvidas, sugestões ou colaborações? Abra uma issue ou entre em contato pelo GitHub!
