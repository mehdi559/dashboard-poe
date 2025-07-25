const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Création des fichiers exécutables...');

// Vérifier que le build React existe
if (!fs.existsSync('build/index.html')) {
  console.log('❌ Build React manquant. Lancement du build...');
  execSync('npm run build', { stdio: 'inherit' });
}

// Créer le dossier dist s'il n'existe pas
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
  console.log('📁 Dossier dist créé');
}

// Copier les fichiers nécessaires
console.log('📋 Copie des fichiers...');

// Créer un package simple pour macOS
const macAppPath = path.join('dist', 'Dashboard POE.app');
if (!fs.existsSync(macAppPath)) {
  fs.mkdirSync(macAppPath, { recursive: true });
  fs.mkdirSync(path.join(macAppPath, 'Contents'), { recursive: true });
  fs.mkdirSync(path.join(macAppPath, 'Contents', 'MacOS'), { recursive: true });
  fs.mkdirSync(path.join(macAppPath, 'Contents', 'Resources'), { recursive: true });
  
  // Créer Info.plist
  const infoPlist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleExecutable</key>
  <string>Dashboard POE</string>
  <key>CFBundleIdentifier</key>
  <string>com.dashboardpoe.app</string>
  <key>CFBundleName</key>
  <string>Dashboard POE</string>
  <key>CFBundleDisplayName</key>
  <string>Dashboard POE - Gestionnaire Financier</string>
  <key>CFBundleVersion</key>
  <string>1.0.0</string>
  <key>CFBundleShortVersionString</key>
  <string>1.0.0</string>
  <key>CFBundlePackageType</key>
  <string>APPL</string>
  <key>CFBundleSignature</key>
  <string>????</string>
  <key>LSMinimumSystemVersion</key>
  <string>10.14.0</string>
  <key>NSHighResolutionCapable</key>
  <true/>
</dict>
</plist>`;
  
  fs.writeFileSync(path.join(macAppPath, 'Contents', 'Info.plist'), infoPlist);
  
  // Créer un script de lancement simple
  const launcherScript = `#!/bin/bash
cd "$(dirname "$0")"
open -a "Safari" "file://$(pwd)/../Resources/index.html"
`;
  
  fs.writeFileSync(path.join(macAppPath, 'Contents', 'MacOS', 'Dashboard POE'), launcherScript);
  fs.chmodSync(path.join(macAppPath, 'Contents', 'MacOS', 'Dashboard POE'), '755');
  
  // Copier les fichiers de build
  execSync(`cp -r build/* "${path.join(macAppPath, 'Contents', 'Resources')}"`, { stdio: 'inherit' });
  
  console.log('✅ Application macOS créée');
}

// Créer un package simple pour Windows
const winAppPath = path.join('dist', 'Dashboard POE.exe');
if (!fs.existsSync(winAppPath)) {
  const winLauncher = `@echo off
cd /d "%~dp0"
start "" "index.html"
`;
  
  fs.writeFileSync(winAppPath, winLauncher);
  
  // Copier les fichiers de build
  const winResourcesPath = path.join('dist', 'Dashboard POE');
  if (!fs.existsSync(winResourcesPath)) {
    fs.mkdirSync(winResourcesPath, { recursive: true });
    execSync(`cp -r build/* "${winResourcesPath}"`, { stdio: 'inherit' });
  }
  
  console.log('✅ Application Windows créée');
}

// Créer un package simple pour Linux
const linuxAppPath = path.join('dist', 'Dashboard POE');
if (!fs.existsSync(linuxAppPath)) {
  fs.mkdirSync(linuxAppPath, { recursive: true });
  
  const linuxLauncher = `#!/bin/bash
cd "$(dirname "$0")"
xdg-open index.html
`;
  
  fs.writeFileSync(path.join(linuxAppPath, 'Dashboard POE'), linuxLauncher);
  fs.chmodSync(path.join(linuxAppPath, 'Dashboard POE'), '755');
  
  // Copier les fichiers de build
  execSync(`cp -r build/* "${linuxAppPath}"`, { stdio: 'inherit' });
  
  console.log('✅ Application Linux créée');
}

// Créer les fichiers ZIP
console.log('📦 Création des fichiers ZIP...');

// macOS ZIP
if (!fs.existsSync('dist/Dashboard POE - Gestionnaire Financier-mac.zip')) {
  execSync('cd dist && zip -r "Dashboard POE - Gestionnaire Financier-mac.zip" "Dashboard POE.app"', { stdio: 'inherit' });
  console.log('✅ ZIP macOS créé');
}

// Windows ZIP
if (!fs.existsSync('dist/Dashboard POE - Gestionnaire Financier-win.zip')) {
  execSync('cd dist && zip -r "Dashboard POE - Gestionnaire Financier-win.zip" "Dashboard POE.exe" "Dashboard POE"', { stdio: 'inherit' });
  console.log('✅ ZIP Windows créé');
}

// Linux ZIP
if (!fs.existsSync('dist/Dashboard POE - Gestionnaire Financier-linux.zip')) {
  execSync('cd dist && zip -r "Dashboard POE - Gestionnaire Financier-linux.zip" "Dashboard POE"', { stdio: 'inherit' });
  console.log('✅ ZIP Linux créé');
}

console.log('🎉 Tous les fichiers exécutables ont été créés !');
console.log('📁 Vérifiez le dossier dist/ pour voir vos fichiers à vendre sur Etsy'); 