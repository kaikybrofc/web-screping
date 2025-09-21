<p align="center">
   <img src="https://animenew.com.br/wp-content/uploads/2024/07/animenew.com_.br_.png" alt="AnimeNew Logo" width="300"/>
</p>

<p align="center">
   <a href="https://github.com/kaikybrofc"><img src="https://img.shields.io/badge/autor-KaikyBroFC-blue?style=for-the-badge" alt="Autor"></a>
   <a href="https://github.com/kaikybrofc/web-screping"><img src="https://img.shields.io/github/v/release/kaikybrofc/web-screping?style=for-the-badge&label=vers%C3%A3o" alt="Versão"></a>
   <a href="https://github.com/kaikybrofc/web-screping/blob/main/LICENSE"><img src="https://img.shields.io/github/license/kaikybrofc/web-screping?style=for-the-badge" alt="Licença"></a>
   <a href="https://github.com/kaikybrofc/web-screping"><img src="https://img.shields.io/github/languages/top/kaikybrofc/web-screping?style=for-the-badge" alt="Linguagem"></a>
   <a href="https://github.com/kaikybrofc/web-screping/commits/main"><img src="https://img.shields.io/github/last-commit/kaikybrofc/web-screping?style=for-the-badge" alt="Último commit"></a>
   <a href="https://github.com/kaikybrofc/web-screping/issues"><img src="https://img.shields.io/github/issues/kaikybrofc/web-screping?style=for-the-badge" alt="Issues abertas"></a>
   <a href="https://github.com/kaikybrofc/web-screping/pulls"><img src="https://img.shields.io/github/issues-pr/kaikybrofc/web-screping?style=for-the-badge" alt="Pull Requests abertos"></a>
   <a href="https://github.com/kaikybrofc/web-screping/graphs/contributors"><img src="https://img.shields.io/badge/contribuições-bem--vindas-brightgreen?style=for-the-badge" alt="Contribuições"></a>
</p>


# AVISO DE USO E POLÍTICA

> **Este projeto é destinado exclusivamente para fins de estudo, aprendizado e demonstração técnica.**
>
> - Não utilize este código para fins comerciais, automação em larga escala ou qualquer atividade que viole os Termos de Uso do site monitorado ou de terceiros.
> - O uso de web scraping pode ser proibido por alguns sites. Sempre consulte e respeite a política de uso (Terms of Service/Política de Privacidade) do site alvo.
> - O autor não se responsabiliza por qualquer uso indevido deste projeto.


# Web Scraping e Resumo Automático de Notícias de Anime

Este projeto realiza o monitoramento automático da página de notícias de animes do site [AnimeNew](https://animenew.com.br/noticias/animes/), detectando novas notícias e gerando resumos automáticos utilizando a API Gemini da Google (Google Generative AI).

O projeto agora é dividido em duas funcionalidades principais:
1.  **API de Notícias**: Um servidor que monitora o site, processa as notícias e as expõe através de uma API REST.
2.  **Script de Monitoramento**: Um script independente que monitora o site e salva os resumos em um arquivo de log.

## Funcionalidades
- **API**:
    - Monitora periodicamente a página de notícias.
    - Gera um resumo para cada nova notícia via IA (Gemini API).
    - Expõe as notícias processadas em um endpoint (`/api/latest-news`).
    - Armazena as notícias em memória e remove as mais antigas (expiram em 24 horas).
- **Script de Log**:
    - Gera um resumo individual para cada notícia encontrada.
    - Salva o título, URL, e resumo em um arquivo de log (`latest_news.log`).

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

### 1. API de Notícias
Para iniciar o servidor da API, execute:
```bash
npm start
```
O servidor irá iniciar e começar a monitorar o site. Você pode acessar as notícias processadas em:
`http://localhost:3000/api/latest-news`

### 2. Script de Log
Se você deseja apenas salvar as notícias em um arquivo de log, execute o script diretamente:
```bash
node src/scripts/monitor-log.js
```
O script irá buscar as notícias, gerar os resumos e salvar no arquivo `latest_news.log`.

## Estrutura do Projeto
O projeto foi reorganizado para melhor clareza e manutenibilidade:
```
/
├── src/
│   ├── api/             # Código do servidor da API
│   │   └── index.js     # Ponto de entrada da API (antigo server.js)
│   │
│   ├── services/        # Módulos e serviços reutilizáveis
│   │   └── summarizer.js  # Lógica de resumo com a IA
│   │
│   └── scripts/         # Scripts independentes
│       └── monitor-log.js # Script de monitoramento para log (antigo web-monitor.js)
│
├── .env                 # Arquivo para suas chaves de API (crie manualmente)
├── latest_news.log      # Arquivo de log gerado pelo script (cria automaticamente)
├── package.json
└── README.md
```

## Como adaptar para outros sites

Você pode modificar este projeto para monitorar e resumir notícias de outros sites. Para isso, siga os passos abaixo:

1.  **Altere a URL monitorada:**
    - No arquivo `src/api/index.js` (para a API) ou `src/scripts/monitor-log.js` (para o script de log), modifique o valor da constante `URL_TO_MONITOR`.

2.  **Ajuste o seletor de extração de texto:**
    - No arquivo `src/services/summarizer.js`, edite a função `extractArticleText` para usar o seletor CSS correto do conteúdo principal do novo site.

3.  **Adapte a lógica de busca de links:**
    - Se o novo site não usar o mesmo padrão de dados estruturados (JSON-LD), será necessário adaptar a lógica de extração de URLs nos arquivos da API e/ou do script.

## Troubleshooting
- **Erro: "A variável de ambiente GEMINI_API_KEY não foi definida."**
   - Verifique se o arquivo `.env` está na raiz do projeto e corretamente preenchido.
- **Resumo não extraído corretamente:**
   - O layout do site pode ter mudado. Ajuste o seletor CSS em `src/services/summarizer.js`.

# Projeto no GitHub

>[Repositório oficial no GitHub](https://github.com/kaikybrofc/web-screping)

**Dados do repositório:**
- **Autor:** [KaikyBroFC](https://github.com/kaikybrofc) <a href="https://github.com/kaikybrofc"><img src="https://img.shields.io/badge/autor-KaikyBroFC-blue" alt="Autor"></a>
- **Licença:** MIT <a href="https://github.com/kaikybrofc/web-screping/blob/main/LICENSE"><img src="https://img.shields.io/github/license/kaikybrofc/web-screping" alt="Licença"></a>
- **Linguagem principal:** JavaScript <a href="https://github.com/kaikybrofc/web-screping"><img src="https://img.shields.io/github/languages/top/kaikybrofc/web-screping" alt="Linguagem"></a>
- **Última atualização:** <a href="https://github.com/kaikybrofc/web-screping/commits/main"><img src="https://img.shields.io/github/last-commit/kaikybrofc/web-screping" alt="Último commit"></a>
- **Issues, Pull Requests e contribuições abertas!** <a href="https://github.com/kaikybrofc/web-screping/issues"><img src="https://img.shields.io/github/issues/kaikybrofc/web-screping" alt="Issues abertas"></a> <a href="https://github.com/kaikybrofc/web-screping/pulls"><img src="https://img.shields.io/github/issues-pr/kaikybrofc/web-screping" alt="Pull Requests abertos"></a> <a href="https://github.com/kaikybrofc/web-screping/graphs/contributors"><img src="https://img.shields.io/badge/contribuições-bem--vindas-brightgreen" alt="Contribuições"></a>


## Licença
<a href="https://github.com/kaikybrofc/web-screping/blob/main/LICENSE"><img src="https://img.shields.io/github/license/kaikybrofc/web-screping?style=for-the-badge" alt="Licença"></a>

---

**Desenvolvido por [KaikyBroFC](https://github.com/kaikybrofc)**

Dúvidas, sugestões ou colaborações? Abra uma issue ou entre em contato pelo GitHub!
