const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');

let mainWindow = null;
let staticServer = null;

// Check if running in development mode
const isDev = process.env.NODE_ENV === 'development' || 
              (process.defaultApp === true) ||
              (/[\\/]electron[\\/]/.test(process.execPath));

const startStaticServer = () => {
  if (isDev) return Promise.resolve();
  
  return new Promise((resolve) => {
    staticServer = require('./static-server.js');
    staticServer.on('listening', () => {
      console.log('[v0] Static server started');
      resolve();
    });
  });
};

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
    },
    icon: path.join(__dirname, '../public/icon.png'),
  });

  const startUrl = isDev
    ? 'http://localhost:3000'
    : 'http://localhost:3000';

  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

app.on('ready', async () => {
  await startStaticServer();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Application menu removed - use keyboard shortcuts instead
// File: CmdOrCtrl+Q to quit
// Edit: Standard undo/redo/cut/copy/paste
// View: CmdOrCtrl+R to reload, CmdOrCtrl+Shift+I for dev tools
// Use these shortcuts without the menu bar

// Handle IPC messages if needed
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});
