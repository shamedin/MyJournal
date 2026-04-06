const { app, BrowserWindow, Menu, ipcMain, protocol } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow = null;

// Check if running in development mode
const isDev = process.env.NODE_ENV === 'development' || 
              (process.defaultApp === true) ||
              (/[\\/]electron[\\/]/.test(process.execPath));

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
    : `file://${path.join(__dirname, '../out/index.html').replace(/\\/g, '/')}`;

  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

// Intercept file:// requests to properly serve CSS and other assets
if (!isDev) {
  app.whenReady().then(() => {
    protocol.interceptFileProtocol('file', (request, callback) => {
      const url = request.url.substr(7);
      let filePath = decodeURIComponent(url);

      // Handle Windows paths
      if (process.platform === 'win32') {
        filePath = filePath.replace(/^\/([a-z]):/i, '$1:');
      }

      // Try to serve the file
      fs.readFile(filePath, (error, data) => {
        if (error) {
          // If file not found and it's an HTML request, try serving index.html
          if (filePath.endsWith('.html') === false) {
            const indexPath = path.join(path.dirname(filePath), 'index.html');
            fs.readFile(indexPath, (err, data) => {
              if (!err) {
                return callback({ mimeType: 'text/html', data: data });
              }
              callback(-6); // FILE_NOT_FOUND
            });
          } else {
            callback(-6); // FILE_NOT_FOUND
          }
        } else {
          const ext = path.extname(filePath).toLowerCase();
          const mimeTypes = {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'application/javascript',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.woff': 'font/woff',
            '.woff2': 'font/woff2',
            '.ttf': 'font/ttf',
            '.eot': 'application/vnd.ms-fontobject',
          };
          callback({
            mimeType: mimeTypes[ext] || 'application/octet-stream',
            data: data,
          });
        }
      });
    });
  });
}

app.on('ready', createWindow);

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

// Create application menu
const template = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Exit',
        accelerator: 'CmdOrCtrl+Q',
        click: () => {
          app.quit();
        },
      },
    ],
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
    ],
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' },
    ],
  },
  {
    label: 'Help',
    submenu: [
      {
        label: 'About Trading Journal',
        click: () => {
          // You can create an about dialog here
        },
      },
    ],
  },
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

// Handle IPC messages if needed
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});
