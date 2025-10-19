const chalk = require('chalk');

const logger = {
  info: (message) => {
    console.log(`[${chalk.blue('INFO')}] ${message}`);
  },
  success: (message) => {
    console.log(`[${chalk.green('SUCCESS')}] ${message}`);
  },
  warn: (message) => {
    console.warn(`[${chalk.yellow('WARN')}] ${message}`);
  },
  error: (message, error) => {
    console.error(`[${chalk.red('ERROR')}] ${message}`, error || '');
  },
  debug: (message) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${chalk.magenta('DEBUG')}] ${message}`);
    }
  },
};

module.exports = logger;
