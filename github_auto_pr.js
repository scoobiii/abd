/**
 * github_auto_pr.js
 * v0.3.0 - 2025-07-28
 * Cria projeto e faz PR automático no GitHub
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const axios = require('axios');

async function prompt(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(question, ans => {
    rl.close();
    resolve(ans.trim());
  }));
}

async function createRepo(token, username, repoName, description) {
  try {
    const response = await axios.post(
      `https://api.github.com/user/repos`,
      { name: repoName, description, private: false },
      { headers: { Authorization: `token ${token}` } }
    );
    return response.data;
  } catch (err) {
    throw new Error(`Erro criando repositório: ${err.response?.data?.message || err.message}`);
  }
}

async function main() {
  console.log('🤖 Automatizador GitHub PR');

  const token = process.env.GITHUB_TOKEN || await prompt('Token GitHub: ');
  const username = process.env.GITHUB_USERNAME || await prompt('Usuário GitHub: ');
  const repoName = await prompt('Nome do novo repositório: ');
  const description = await prompt('Descrição do projeto (opcional): ');

  console.log('Criando repositório no GitHub...');
  await createRepo(token, username, repoName, description);

  console.log('Configurando git local...');
  execSync('git init', { stdio: 'inherit' });
  execSync(`git remote add origin https://github.com/${username}/${repoName}.git`, { stdio: 'inherit' });
  execSync('git add .', { stdio: 'inherit' });
  execSync('git commit -m "feat: projeto inicial v0.3.0"', { stdio: 'inherit' });
  execSync('git branch -M main', { stdio: 'inherit' });
  execSync(`git push -u origin main`, { stdio: 'inherit' });

  console.log('Criando Pull Request...');
  // PR via API GitHub (exemplo simplificado)
  const prResponse = await axios.post(
    `https://api.github.com/repos/${username}/${repoName}/pulls`,
    { title: 'PR inicial', head: 'main', base: 'main', body: 'Projeto criado automaticamente.' },
    { headers: { Authorization: `token ${token}` } }
  );

  console.log(`PR criado: ${prResponse.data.html_url}`);
  console.log('✅ Processo finalizado com sucesso!');
}

if (require.main === module) {
  main().catch(e => {
    console.error('Erro no processo:', e.message);
  });
}

module.exports = main;
