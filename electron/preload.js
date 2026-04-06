const { contextBridge, ipcRenderer } = require('electron');

// Expose safe APIs to renderer process
contextBridge.exposeInMainWorld('electron', {
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  openExternal: (url) => {
    // Can be used to open external URLs in default browser
    ipcRenderer.send('open-external', url);
  },
});
