#!/usr/bin/env node

/**
 * Script pour vérifier la version de Papicons et suggérer la version pour ce fork
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Fonction pour récupérer le package.json de Papicons
function fetchPapiconsVersion() {
  return new Promise((resolve, reject) => {
    https.get('https://raw.githubusercontent.com/PapillonApp/Papicons/main/package.json', (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const packageJson = JSON.parse(data);
          resolve(packageJson.version);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

// Fonction pour lire notre version actuelle
function getCurrentVersion() {
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  return packageJson.version;
}

// Fonction pour suggérer la prochaine version
function suggestNextVersion(papiconsVersion, currentVersion) {
  const [papiconsMajor, papiconsMinor, papiconsPatch] = papiconsVersion.split('.').map(Number);
  const [currentMajor, currentMinor, currentPatch] = currentVersion.split('.').map(Number);
  
  // Si Papicons a une nouvelle version
  if (papiconsVersion !== `${currentMajor}.${currentMinor}.${currentPatch - 1}`) {
    return `${papiconsMajor}.${papiconsMinor}.${papiconsPatch + 1}`;
  }
  
  // Sinon, incrémenter notre patch
  return `${currentMajor}.${currentMinor}.${currentPatch + 1}`;
}

// Fonction principale
async function main() {
  try {
    console.log('🦋 Vérification de la version de Papicons...\n');
    
    const papiconsVersion = await fetchPapiconsVersion();
    const currentVersion = getCurrentVersion();
    
    console.log(`📦 Version actuelle de Papicons: ${papiconsVersion}`);
    console.log(`🎯 Version actuelle de Papicons-Vue: ${currentVersion}`);
    
    const suggestedVersion = suggestNextVersion(papiconsVersion, currentVersion);
    
    console.log(`\n💡 Version suggérée pour la prochaine publication: ${suggestedVersion}`);
    
    // Vérifier si on doit suivre une nouvelle version de Papicons
    const [papiconsMajor, papiconsMinor, papiconsPatch] = papiconsVersion.split('.').map(Number);
    const [currentMajor, currentMinor, currentPatch] = currentVersion.split('.').map(Number);
    
    if (papiconsVersion !== `${currentMajor}.${currentMinor}.${currentPatch - 1}`) {
      console.log(`\n🔄 Papicons a une nouvelle version !`);
      console.log(`   Vous devriez mettre à jour vers ${suggestedVersion}`);
    } else {
      console.log(`\n✅ Vous êtes à jour avec Papicons`);
      console.log(`   Pour vos propres modifications, utilisez: ${suggestedVersion}`);
    }
    
    console.log(`\n📝 Pour mettre à jour la version:`);
    console.log(`   npm version patch  # ou minor/major selon le cas`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error.message);
    process.exit(1);
  }
}

// Exécuter le script
if (require.main === module) {
  main();
}

module.exports = {
  fetchPapiconsVersion,
  getCurrentVersion,
  suggestNextVersion
};
