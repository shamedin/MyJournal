import { contextBridge, ipcRenderer } from 'electron';

// Expose safe APIs to renderer process
contextBridge.exposeInMainWorld('electron', {
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  openExternal: (url: string) => {
    // Can be used to open external URLs in default browser
    ipcRenderer.send('open-external', url);
  },
});

// Type declaration for TypeScript
declare global {
  interface Window {
    electron: {
      getAppVersion: () => Promise<string>;
      openExternal: (url: string) => void;
    };
  }
}

export {};
