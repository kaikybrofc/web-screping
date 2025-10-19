# News Anime Monitor

**Versão:** 1.0.2

`News Anime Monitor` é um sistema de monitoramento e sumarização de notícias automatizado. Ele rastreia uma página de notícias, extrai novos artigos, utiliza a IA do Google Gemini para gerar resumos concisos e os expõe através de uma API local. Além disso, agora ele armazena as notícias processadas localmente para persistência de dados.

## ✨ Funcionalidades Principais

- **Monitoramento Contínuo:** Verifica periodicamente a página de notícias em busca de novos artigos.
- **Sumarização com IA:** Utiliza o Google Gemini para criar resumos inteligentes e informativos dos artigos.
- **API de Notícias:** Disponibiliza os artigos processados e seus resumos através de um endpoint HTTP local.
- **Persistência de Dados:** Salva as notícias em um arquivo JSON (`processed_articles.json`), garantindo que os dados não sejam perdidos ao reiniciar o servidor.
- **Logs Melhorados:** Sistema de logs coloridos e organizados para fácil depuração e visualização do status da aplicação.
- **Limpeza Automática:** Remove notícias antigas (com mais de 24 horas) para manter a base de dados relevante.

## 🚀 Começando

Siga estas instruções para ter o projeto rodando em sua máquina local.

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 14 ou superior)
- Uma chave de API do [Google Gemini](https://aistudio.google.com/app/apikey)

### Instalação

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/kaikybrofc/news-anime-monitor.git
    cd news-anime-monitor
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente:**
    - Crie um arquivo chamado `.env` na raiz do projeto.
    - Adicione sua chave da API do Gemini a ele:
      ```
      GEMINI_API_KEY=SUA_CHAVE_DE_API_AQUI
      ```

### Uso

Para iniciar o servidor, execute o seguinte comando:

```bash
npm start
```

O servidor será iniciado na porta 3000 (ou na porta definida pela variável de ambiente `PORT`). Os logs no console mostrarão o status do monitoramento e do processamento das notícias.

## 📡 API

Uma vez que o servidor esteja rodando, você pode acessar as notícias processadas através do seguinte endpoint:

- **Endpoint:** `GET /`
- **URL:** `http://localhost:3000/`

#### Exemplo de Resposta (Sucesso)

```json
[
  {
    "id": "a1b2c3d4e5f6...",
    "timestamp": "2025-10-19T12:00:00.000Z",
    "refined": {
      "name": "Título da Notícia Exemplo",
      "url": "https://exemplonews.com/noticia-1",
      "image": "https://exemplonews.com/imagem-1.jpg",
      "summary": "Este é um resumo gerado pela IA sobre a notícia..."
    }
  }
]
```

#### Exemplo de Resposta (Sem Notícias)

Se nenhuma notícia foi processada ainda, a resposta será:

```json
{
  "message": "Nenhuma notícia foi processada ainda. Verifique novamente em alguns instantes."
}
```

## 📁 Estrutura de Arquivos

- `src/api/index.js`: Arquivo principal que configura o servidor Express, os endpoints da API e o loop de monitoramento.
- `src/services/summarizer.js`: Módulo responsável por interagir com a API do Gemini e gerar os resumos.
- `src/utils/logger.js`: Módulo centralizado para formatação de logs.
- `src/data/processed_articles.json`: Arquivo de cache onde as notícias processadas são armazenadas.
- `src/scripts/monitor-log.js`: Um script secundário para monitoramento e logging em arquivo (uso opcional).

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.