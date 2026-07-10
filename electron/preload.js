'use strict';
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  backupDB: () => ipcRenderer.invoke('backup-db'),
  platform: process.platform,
});
