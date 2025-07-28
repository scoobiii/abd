/**
 * install_if_missing.js
 * v0.3.0 - 2025-07-28
 * Instala libs automaticamente se ausentes
 */

const { execSync } = require('child_process');
const pkg = require('./package.json');

module.exports = async function installIfMissing() {
  console.log('🔍 Verificando dependências...');
  try {
    execSync('npm list --depth=0', { stdio: 'ignore' });
    console.log('✅ Dependências presentes');
  } catch {
    console.log('⚠️ Dependências não encontradas, instalando...');
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependências instaladas');
  }
};
