const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Début du build pour Etsy...');

// Fonction pour nettoyer le dossier dist
function cleanDist() {
  const distPath = path.join(__dirname, 'dist');
  if (fs.existsSync(distPath)) {
    console.log('🧹 Nettoyage du dossier dist...');
    fs.rmSync(distPath, { recursive: true, force: true });
  }
}

// Fonction pour mettre à jour la version
function updateVersion() {
  const packagePath = path.join(__dirname, 'package.json');
  const package = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  // Incrémenter la version patch
  const versionParts = package.version.split('.');
  versionParts[2] = parseInt(versionParts[2]) + 1;
  package.version = versionParts.join('.');
  
  fs.writeFileSync(packagePath, JSON.stringify(package, null, 2));
  console.log(`📦 Version mise à jour: ${package.version}`);
}

// Fonction pour créer le build React
function buildReact() {
  console.log('⚛️ Build React en cours...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Build React terminé');
  } catch (error) {
    console.error('❌ Erreur lors du build React:', error);
    process.exit(1);
  }
}

/// Fonction pour créer les packages Electron
function buildElectron() {
  console.log('🔧 Build Electron en cours...');
  try {
    // Build pour macOS avec electron-packager
    console.log('🍎 Build macOS...');
    execSync('npx electron-packager . dashboard-poe --platform=darwin --arch=x64 --out=dist --overwrite --ignore="node_modules/(electron-builder|@electron/rebuild)"', { stdio: 'inherit' });
    
    // Build pour Windows
    console.log('🪟 Build Windows...');
    execSync('npx electron-packager . dashboard-poe --platform=win32 --arch=x64 --out=dist --overwrite --ignore="node_modules/(electron-builder|@electron/rebuild)"', { stdio: 'inherit' });
    
    // Build pour Linux
    console.log('🐧 Build Linux...');
    execSync('npx electron-packager . dashboard-poe --platform=linux --arch=x64 --out=dist --overwrite --ignore="node_modules/(electron-builder|@electron/rebuild)"', { stdio: 'inherit' });
    
    console.log('✅ Tous les builds Electron terminés');
  } catch (error) {
    console.error('❌ Erreur lors du build Electron:', error);
    process.exit(1);
  }
}

// Fonction pour créer le package Etsy
function createEtsyPackage() {
  console.log('📦 Création du package Etsy...');
  
  const distPath = path.join(__dirname, 'dist');
  const etsyPath = path.join(__dirname, 'etsy-package');
  
  // Créer le dossier Etsy
  if (fs.existsSync(etsyPath)) {
    fs.rmSync(etsyPath, { recursive: true, force: true });
  }
  fs.mkdirSync(etsyPath);
  
  // Copier les fichiers de build
  const buildFiles = fs.readdirSync(distPath);
  buildFiles.forEach(file => {
    if (file.endsWith('.zip')) {
      const sourcePath = path.join(distPath, file);
      const destPath = path.join(etsyPath, file);
      fs.copyFileSync(sourcePath, destPath);
      console.log(`📁 Copié: ${file}`);
    }
  });
  
  // Créer le fichier README pour Etsy
  const readmeContent = `# Dashboard POE - Gestionnaire Financier

## Description
Application de gestion financière personnelle avec IA intégrée pour macOS, Windows et Linux.

## Fonctionnalités
- 📊 Dashboard financier complet
- 💰 Gestion des dépenses et revenus
- 📈 Rapports et analyses
- 🤖 IA intégrée pour l'analyse
- 📅 Calendrier financier
- 💳 Gestion des dettes et épargnes
- 📊 Export de rapports
- 🎨 Interface moderne et intuitive

## Installation
1. Décompressez le fichier ZIP correspondant à votre système d'exploitation
2. Lancez l'application
3. Commencez à gérer vos finances !

## Support
Pour toute question ou problème, contactez-nous.

## Version
${JSON.parse(fs.readFileSync('package.json', 'utf8')).version}
`;

  fs.writeFileSync(path.join(etsyPath, 'README.md'), readmeContent);
  
  console.log('✅ Package Etsy créé avec succès !');
  console.log(`📁 Dossier: ${etsyPath}`);
}

// Exécution du script
async function main() {
  try {
    cleanDist();
    updateVersion();
    buildReact();
    buildElectron();
    createEtsyPackage();
    
    console.log('🎉 Build Etsy terminé avec succès !');
    console.log('📦 Votre application est prête pour Etsy !');
  } catch (error) {
    console.error('❌ Erreur lors du build:', error);
    process.exit(1);
  }
}

main(); 