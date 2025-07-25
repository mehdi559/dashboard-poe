const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

console.log('🧪 Test de l\'application Electron...');

function createTestWindow() {
  const testWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'public/preload.js'),
      enableRemoteModule: false,
      webSecurity: true
    },
    show: false
  });

  // Charger l'app React
  testWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, 'build/index.html')}`
  );

  // Ouvrir les outils de développement pour les tests
  testWindow.webContents.openDevTools();

  // Afficher la fenêtre quand elle est prête
  testWindow.once('ready-to-show', () => {
    testWindow.show();
    console.log('✅ Fenêtre de test créée avec succès');
    
    // Test des fonctionnalités de base
    setTimeout(() => {
      console.log('🔍 Test des fonctionnalités de base...');
      
      // Vérifier que l'application se charge correctement
      testWindow.webContents.executeJavaScript(`
        console.log('Test: Application chargée');
        
        // Vérifier les éléments de base
        const dashboard = document.querySelector('[data-testid="dashboard"]');
        const navigation = document.querySelector('nav');
        const mainContent = document.querySelector('main');
        
        if (dashboard || navigation || mainContent) {
          console.log('✅ Interface utilisateur chargée');
        } else {
          console.log('❌ Interface utilisateur manquante');
        }
        
        // Vérifier les traductions
        const languageElements = document.querySelectorAll('[data-i18n]');
        if (languageElements.length > 0) {
          console.log('✅ Système de traduction actif');
        } else {
          console.log('⚠️ Système de traduction non détecté');
        }
        
        // Vérifier les composants React
        const reactRoot = document.getElementById('root');
        if (reactRoot && reactRoot.children.length > 0) {
          console.log('✅ Application React chargée');
        } else {
          console.log('❌ Application React non chargée');
        }
      `);
    }, 2000);
  });

  // Gérer la fermeture
  testWindow.on('closed', () => {
    console.log('🔚 Test terminé');
    app.quit();
  });
}

// Quand Electron est prêt
app.whenReady().then(() => {
  console.log('🚀 Démarrage du test Electron...');
  createTestWindow();
});

// Quitter quand toutes les fenêtres sont fermées
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createTestWindow();
  }
});

// Gérer les erreurs
process.on('uncaughtException', (error) => {
  console.error('❌ Erreur non gérée:', error);
  app.quit();
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promesse rejetée non gérée:', reason);
  app.quit();
}); 