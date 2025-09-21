# Notas de Lançamento - v1.0.1

**Data de Lançamento:** 21 de setembro de 2025

Esta versão traz uma grande refatoração ao projeto, transformando o "web-monitor" em uma aplicação mais robusta e escalável. As principais mudanças incluem a introdução de uma API dedicada, um script de monitoramento separado e diversas melhorias de funcionalidades.

## ✨ Novas Funcionalidades

* **Sumarização em Lote:** A funcionalidade de monitoramento de notícias agora suporta sumarização em lote, permitindo o processamento eficiente de múltiplos artigos de uma só vez.
* **Sumarização Sequencial por IA:** Para garantir estabilidade e confiabilidade, todas as requisições de sumarização por IA agora são processadas de forma sequencial.

## 🚀 Melhorias

* **Log Aprimorado:** O mecanismo de log do serviço de sumarização Gemini foi significativamente aprimorado, fornecendo informações mais detalhadas e úteis.
* **Confiabilidade do Monitoramento:** A confiabilidade geral do script de monitoramento foi melhorada para evitar falhas e garantir operação contínua.
* **README:** O `README.md` do projeto foi atualizado com informações mais detalhadas, badges e uma estrutura melhor organizada.

## 🛠 Refatoração

* **Estrutura do Projeto:** O projeto foi refatorado para uma nova estrutura, separando a lógica principal em três componentes:
  * `src/api`: Uma API Express.js que expõe o serviço de sumarização.
    * `src/scripts`: Um script independente para monitoramento de páginas web.
    * `src/services`: O serviço central de sumarização alimentado pela API Gemini.
* **Base de Código:** Todo o código foi modularizado e aprimorado para melhor legibilidade, manutenção e escalabilidade.
