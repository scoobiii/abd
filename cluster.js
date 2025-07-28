/**
 * cluster.js
 * v0.3.0 - 2025-07-28
 * Orquestrador principal do sistema de autocura
 */
const { fork } = require('child_process');
const path = require('path');
const fs = require('fs');

const autocura = fork(path.resolve(__dirname, 'autocura.js'));

console.log('🚀 Iniciando orquestrador de autocura...');

autocura.on('message', (msg) => {
  console.log(`[Autocura] ${msg}`);
});

process.on('uncaughtException', (err) => {
  const logPath = path.resolve(__dirname, 'logs/devop-errors.log');
  const errorMsg = `[${new Date().toISOString()}] [cluster.js] ${err.stack}\n`;
  fs.appendFileSync(logPath, errorMsg);
  console.error('Erro capturado no cluster:', err.message);
  autocura.send({ cmd: 'error', error: err.message, stack: err.stack });
});

process.on('exit', () => {
  console.log('Orquestrador encerrado');
});
