# News Anime Monitor

![Version](https://img.shields.io/badge/version-1.0.2-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)

`News Anime Monitor` é um sistema de monitoramento e sumarização de notícias automatizado e inteligente. Ele rastreia uma página de notícias de anime, extrai novos artigos, utiliza a IA do Google Gemini para gerar resumos concisos e os expõe através de uma API REST local. Com persistência de dados, sistema de logs avançado e suporte a gerenciamento de processos via PM2, é uma solução completa para acompanhar notícias de anime.

## ✨ Funcionalidades Principais

- **Monitoramento Contínuo:** Verifica periodicamente a página de notícias em busca de novos artigos (intervalo configurável, padrão: 15 minutos).
- **Sumarização com IA:** Utiliza o Google Gemini 2.0 Flash para criar resumos inteligentes, informativos e contextualizados dos artigos.
- **API REST:** Disponibiliza os artigos processados e seus resumos através de um endpoint HTTP local para fácil integração.
- **Persistência de Dados:** Salva as notícias em um arquivo JSON (`processed_articles.json`), garantindo que os dados não sejam perdidos ao reiniciar o servidor.
- **Sistema de Logs Avançado:** Logs coloridos e organizados (INFO, SUCCESS, ERROR) para fácil depuração e monitoramento da aplicação.
- **Limpeza Automática:** Remove notícias antigas (mais de 24 horas) automaticamente para manter a base de dados relevante e otimizada.
- **Graceful Shutdown:** Encerramento gracioso que salva o estado antes de desligar, garantindo integridade dos dados.
- **Suporte PM2:** Configuração pronta para gerenciamento de processos em produção com PM2.

## 🚀 Começando

Siga estas instruções para ter o projeto rodando em sua máquina local.

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 14 ou superior recomendada)
- Uma chave de API do [Google Gemini](https://aistudio.google.com/app/apikey)
- (Opcional) [PM2](https://pm2.keymetrics.io/) para gerenciamento de processos em produção

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
    - Copie o arquivo de exemplo:
      ```bash
      cp .env.example .env
      ```
    - Edite o arquivo `.env` e adicione sua chave da API do Gemini:
      ```
      GEMINI_API_KEY=SUA_CHAVE_DE_API_AQUI
      ```

### Uso

#### Desenvolvimento / Modo Padrão

Para iniciar o servidor em modo de desenvolvimento, execute:

```bash
npm start
```

O servidor será iniciado na porta 3000 (ou na porta definida pela variável de ambiente `PORT`). Os logs no console mostrarão o status do monitoramento e do processamento das notícias em tempo real.

#### Produção com PM2

Para executar em produção com gerenciamento de processos PM2:

```bash
npm run start:pm2
```

Este comando iniciará o aplicativo usando a configuração do `ecosystem.config.js`, que inclui:
- Reinício automático em caso de falhas
- Logs estruturados em arquivos (`./logs/out.log` e `./logs/error.log`)
- Gerenciamento de processos otimizado

**Comandos úteis do PM2:**

```bash
# Ver logs em tempo real
npm run pm2:logs

# Parar o processo
pm2 stop news-anime-monitor

# Reiniciar o processo
pm2 restart news-anime-monitor

# Ver status
pm2 status

# Ver informações detalhadas
pm2 show news-anime-monitor
```

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

```
news-anime-monitor/
├── src/
│   ├── api/
│   │   └── index.js           # Servidor Express, endpoints da API e loop de monitoramento
│   ├── services/
│   │   └── summarizer.js      # Integração com a API do Gemini para geração de resumos
│   ├── utils/
│   │   └── logger.js          # Sistema centralizado de logs com formatação colorida
│   ├── scripts/
│   │   └── monitor-log.js     # Script auxiliar para monitoramento e logging
│   └── data/
│       └── processed_articles.json  # Cache local das notícias processadas
├── logs/                      # Diretório de logs (criado automaticamente)
├── ecosystem.config.js        # Configuração do PM2
├── package.json              # Dependências e scripts do projeto
├── .env                      # Variáveis de ambiente (não versionado)
└── README.md                 # Este arquivo
```

## ⚙️ Configuração Avançada

O sistema pode ser configurado através de variáveis de ambiente e constantes no código.

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Obrigatório
GEMINI_API_KEY=sua_chave_de_api_do_gemini

# Opcional
PORT=3000                      # Porta do servidor (padrão: 3000)
NODE_ENV=production           # Ambiente de execução
```

### Configurações do Sistema

As seguintes configurações podem ser ajustadas em `src/api/index.js`:

- **`URL_TO_MONITOR`**: URL da página a ser monitorada (padrão: `https://animenew.com.br/noticias/animes/`)
- **`CHECK_INTERVAL_MS`**: Intervalo de verificação de novas notícias em milissegundos (padrão: 900000 = 15 minutos)
- **`EXPIRATION_TIME_MS`**: Tempo de expiração das notícias em milissegundos (padrão: 86400000 = 24 horas)
- **`CLEANUP_INTERVAL_MS`**: Intervalo de limpeza automática em milissegundos (padrão: 3600000 = 1 hora)

## 🔧 Troubleshooting

### Erro: "A variável de ambiente GEMINI_API_KEY não foi definida"

**Solução:** Certifique-se de que o arquivo `.env` existe na raiz do projeto e contém sua chave de API válida do Google Gemini.

### Nenhuma notícia está sendo processada

**Soluções:**
1. Verifique sua conexão com a internet
2. Confirme que a URL monitorada (`URL_TO_MONITOR`) está acessível
3. Verifique os logs para identificar possíveis erros
4. Aguarde pelo menos um ciclo de verificação (15 minutos por padrão)

### Erro ao salvar/carregar notícias

**Solução:** Verifique as permissões de escrita no diretório `src/data/`. O aplicativo precisa de permissões para criar e modificar arquivos neste diretório.

### PM2 não encontrado

**Solução:** Instale o PM2 globalmente:
```bash
npm install -g pm2
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Se você deseja contribuir com este projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaNovaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/MinhaNovaFeature`)
5. Abra um Pull Request

## 📋 Roadmap

- [ ] Suporte a múltiplas fontes de notícias
- [ ] Interface web para visualização das notícias
- [ ] Sistema de notificações (email, Discord, Telegram)
- [ ] Filtros personalizáveis por categoria/tag
- [ ] API com autenticação
- [ ] Suporte a outros modelos de IA além do Gemini

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👤 Autor

**Kaiky Brito**
- GitHub: [@kaikybrofc](https://github.com/kaikybrofc)

## 🌟 Agradecimentos

- [Google Gemini](https://ai.google.dev/) - API de IA generativa
- [AnimeNew](https://animenew.com.br/) - Fonte de notícias
- Comunidade open source

---

⭐ Se este projeto foi útil para você, considere dar uma estrela no repositório!