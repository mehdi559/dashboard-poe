const { app, BrowserWindow, Menu, shell, dialog } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';
const fs = require('fs');

function createWindow() {
  // Créer la fenêtre du navigateur
  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      enableRemoteModule: false,
      webSecurity: true
    },
    icon: path.join(__dirname, 'logo192.png'),
    titleBarStyle: 'default',
    show: false,
    backgroundColor: '#ffffff',
    title: 'Dashboard POE - Gestionnaire Financier'
  });

  // Charger l'app React
  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`  );

  // Ouvrir les outils de développement en mode dev
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Afficher la fenêtre quand elle est prête
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Gérer la fermeture de l'app
  mainWindow.on('closed', () => {
    app.quit();
  });

  // Gérer les liens externes
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Créer le menu personnalisé
  const template = [
    {
      label: 'Fichier',
      submenu: [
        {
          label: 'Nouveau',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.send('new-document');
          }
        },
        {
          label: 'Ouvrir',
          accelerator: 'CmdOrCtrl+O',
          click: () => {
            mainWindow.webContents.send('open-file');
          }
        },
        {
          label: 'Sauvegarder',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            mainWindow.webContents.send('save-file');
          }
        },
        { type: 'separator' },
        {
          label: 'Quitter',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Édition',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' }
      ]
    },
    {
      label: 'Affichage',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Aide',
      submenu: [
        {
          label: 'À propos',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'Dashboard POE',
              message: 'Dashboard POE - Gestionnaire Financier',
              detail: 'Version 1.0.0\n\nApplication de gestion financière personnelle avec IA intégrée.',
              buttons: ['OK']
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// === Handlers IPC pour utilisateur avec chiffrement ===
const { ipcMain } = require('electron');
const path = require('path');
const { encryptAndSaveJSON, decryptAndLoadJSON } = require('./utils/encryption');

const userDataPath = path.join(app.getPath('userData'), 'userData.enc');

ipcMain.handle('db-get-user', async () => {
  try {
    return decryptAndLoadJSON(userDataPath);
  } catch (e) {
    return null;
  }
});

ipcMain.handle('db-update-user', async (event, userData) => {
  encryptAndSaveJSON(userData, userDataPath);
  return { changes: 1 };
});

const expensesPath = path.join(app.getPath('userData'), 'expenses.enc');

// Lire les dépenses (mois optionnel)
ipcMain.handle('db-get-expenses', async (event, month) => {
  try {
    const allExpenses = decryptAndLoadJSON(expensesPath) || [];
    if (!month) return allExpenses;
    return allExpenses.filter(expense => expense.date && expense.date.startsWith(month));
  } catch (e) {
    return [];
  }
});

// Ajouter une dépense
ipcMain.handle('db-add-expense', async (event, expense) => {
  let allExpenses = [];
  try {
    allExpenses = decryptAndLoadJSON(expensesPath) || [];
  } catch (e) {
    allExpenses = [];
  }
  const newExpense = {
    id: Date.now(),
    ...expense,
    created_at: new Date().toISOString()
  };
  allExpenses.push(newExpense);
  encryptAndSaveJSON(allExpenses, expensesPath);
  return { id: newExpense.id };
});

const revenuesPath = path.join(app.getPath('userData'), 'revenues.enc');

// Lire les revenus (mois optionnel)
ipcMain.handle('db-get-revenues', async (event, month) => {
  try {
    const allRevenues = decryptAndLoadJSON(revenuesPath) || [];
    if (!month) return allRevenues;
    return allRevenues.filter(revenue => revenue.date && revenue.date.startsWith(month));
  } catch (e) {
    return [];
  }
});

// Ajouter un revenu
ipcMain.handle('db-add-revenue', async (event, revenue) => {
  let allRevenues = [];
  try {
    allRevenues = decryptAndLoadJSON(revenuesPath) || [];
  } catch (e) {
    allRevenues = [];
  }
  const newRevenue = {
    id: Date.now(),
    ...revenue,
    created_at: new Date().toISOString()
  };
  allRevenues.push(newRevenue);
  encryptAndSaveJSON(allRevenues, revenuesPath);
  return { id: newRevenue.id };
});

const categoriesPath = path.join(app.getPath('userData'), 'categories.enc');

// Lire les catégories
ipcMain.handle('db-get-categories', async () => {
  try {
    return decryptAndLoadJSON(categoriesPath) || [];
  } catch (e) {
    return [];
  }
});

// Ajouter une catégorie
ipcMain.handle('db-add-category', async (event, category) => {
  let allCategories = [];
  try {
    allCategories = decryptAndLoadJSON(categoriesPath) || [];
  } catch (e) {
    allCategories = [];
  }
  const newCategory = {
    id: Date.now(),
    ...category
  };
  allCategories.push(newCategory);
  encryptAndSaveJSON(allCategories, categoriesPath);
  return { id: newCategory.id };
});

const debtsPath = path.join(app.getPath('userData'), 'debts.enc');

// Lire les dettes
ipcMain.handle('db-get-debts', async () => {
  try {
    return decryptAndLoadJSON(debtsPath) || [];
  } catch (e) {
    return [];
  }
});

// Ajouter une dette
ipcMain.handle('db-add-debt', async (event, debt) => {
  let allDebts = [];
  try {
    allDebts = decryptAndLoadJSON(debtsPath) || [];
  } catch (e) {
    allDebts = [];
  }
  const newDebt = {
    id: Date.now(),
    ...debt
  };
  allDebts.push(newDebt);
  encryptAndSaveJSON(allDebts, debtsPath);
  return { id: newDebt.id };
});

const savingsGoalsPath = path.join(app.getPath('userData'), 'savingsGoals.enc');

// Lire les objectifs d'épargne
ipcMain.handle('db-get-savings-goals', async () => {
  try {
    return decryptAndLoadJSON(savingsGoalsPath) || [];
  } catch (e) {
    return [];
  }
});

// Ajouter un objectif d'épargne
ipcMain.handle('db-add-savings-goal', async (event, goal) => {
  let allGoals = [];
  try {
    allGoals = decryptAndLoadJSON(savingsGoalsPath) || [];
  } catch (e) {
    allGoals = [];
  }
  const newGoal = {
    id: Date.now(),
    ...goal
  };
  allGoals.push(newGoal);
  encryptAndSaveJSON(allGoals, savingsGoalsPath);
  return { id: newGoal.id };
});

const recurringExpensesPath = path.join(app.getPath('userData'), 'recurringExpenses.enc');

// Lire les dépenses récurrentes
ipcMain.handle('db-get-recurring-expenses', async () => {
  try {
    return decryptAndLoadJSON(recurringExpensesPath) || [];
  } catch (e) {
    return [];
  }
});

// Ajouter une dépense récurrente
ipcMain.handle('db-add-recurring-expense', async (event, expense) => {
  let allRecurring = [];
  try {
    allRecurring = decryptAndLoadJSON(recurringExpensesPath) || [];
  } catch (e) {
    allRecurring = [];
  }
  const newExpense = {
    id: Date.now(),
    ...expense,
    created_at: new Date().toISOString()
  };
  allRecurring.push(newExpense);
  encryptAndSaveJSON(allRecurring, recurringExpensesPath);
  return { id: newExpense.id };
});

// Fonction pour chiffrer n'importe quel buffer ou string
function encryptAndSaveBuffer(buffer, filePath) {
  const crypto = require('crypto');
  const algorithm = 'aes-256-cbc';
  const key = crypto.scryptSync('ma-cle-secrete-tres-longue', 'sel', 32);
  const iv = Buffer.alloc(16, 0);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  fs.writeFileSync(filePath, encrypted);
}

// Handler IPC générique pour export chiffré
ipcMain.handle('db-export-encrypted-file', async (event, { data, type, defaultName }) => {
  const { filePath } = await dialog.showSaveDialog({
    title: 'Exporter un fichier chiffré',
    defaultPath: defaultName || 'export.enc',
    filters: [{ name: 'Encrypted', extensions: ['enc'] }]
  });
  if (filePath) {
    let buffer;
    if (type === 'json') {
      buffer = Buffer.from(JSON.stringify(data), 'utf8');
    } else if (type === 'html' || type === 'pdf' || type === 'excel') {
      buffer = Buffer.isBuffer(data) ? data : Buffer.from(data, 'utf8');
    } else {
      return { success: false, error: 'Type non supporté' };
    }
    encryptAndSaveBuffer(buffer, filePath);
    return { success: true, filePath };
  }
  return { success: false };
});

// Quand Electron est prêt
app.whenReady().then(createWindow);

// Quitter quand toutes les fenêtres sont fermées
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
}); 