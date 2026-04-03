// Preload script for Electron security
// This file runs in a secure context and bridges the gap between
// the main process and renderer process

const { contextBridge } = require('electron');

// Expose safe APIs to the renderer process
contextBridge.exposeInMainWorld('electron', {
  platform: process.platform,
  versions: process.versions,
});
