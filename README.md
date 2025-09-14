# Web Monitor de Notícias com Resumo por IA

Este projeto monitora automaticamente a página de notícias de animes do site [AnimeNew](https://animenew.com.br/noticias/animes/) e gera resumos automáticos das notícias mais recentes utilizando a API Gemini da Google.

## Funcionalidades
- Monitora periodicamente a página de notícias.
- Detecta novas notícias automaticamente.
- Extrai o conteúdo principal da notícia.
- Gera um resumo conciso usando IA (Gemini).
- Salva o título, URL e resumo em um arquivo de log (`latest_news.log`).

## Pré-requisitos
- Node.js (v16 ou superior recomendado)
- Uma chave de API Gemini válida (Google Generative AI)

## Instalação
1. Clone este repositório ou baixe os arquivos.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie um arquivo `.env` na raiz do projeto e adicione sua chave Gemini:
   ```env
   GEMINI_API_KEY=coloque_sua_chave_aqui
   ```

## Uso
Execute o monitoramento com:
```bash
npm start
```
O script irá buscar a notícia mais recente, gerar um resumo e salvar no arquivo `latest_news.log`. A cada 15 minutos, ele verifica se há novidades.

## Estrutura dos Arquivos
- `web-monitor.js`: Script principal de monitoramento e logging.
- `summarizer.js`: Responsável por extrair o texto e gerar o resumo via IA.
- `latest_news.log`: Log das notícias resumidas.
- `package.json`: Dependências e scripts do projeto.

## Observações
- O seletor CSS para extração do texto principal pode precisar de ajustes caso o layout do site mude.
- O uso da API Gemini pode gerar custos dependendo do volume de requisições.

## Licença
ISC

---

Desenvolvido por KaikyBroFC.
