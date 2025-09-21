# Release Notes - v1.0.1

**Release Date:** September 21, 2025

This release introduces a major project refactoring, transforming the "web-monitor" into a more robust and scalable application. The key changes include the introduction of a dedicated API, a separate monitoring script, and several feature enhancements.

## ✨ New Features

*   **Bulk Summarization:** The news monitoring functionality now supports bulk summarization, allowing for more efficient processing of multiple news articles at once.
*   **Sequential AI Summarization:** To ensure stability and reliability, all AI-powered summarization requests are now processed sequentially.

## 🚀 Improvements

*   **Enhanced Logging:** The logging mechanism for the Gemini summarization service has been significantly improved, providing more detailed and insightful information.
*   **Monitoring Reliability:** The overall reliability of the monitoring script has been enhanced to prevent crashes and ensure continuous operation.
*   **README:** The project's `README.md` has been updated with more detailed information, badges, and a better-organized structure.

## 🛠 Refactoring

*   **Project Structure:** The project has been refactored into a new structure, separating the core logic into three main components:
    *   `src/api`: An Express.js API that exposes the summarization service.
    *   `src/scripts`: A standalone script for monitoring web pages.
    *   `src/services`: The core summarization service powered by the Gemini API.
*   **Codebase:** The entire codebase has been modularized and improved for better readability, maintainability, and scalability.

