'use strict';
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { spawn }   = require('child_process');
const path        = require('path');
const { autoUpdater } = require('electron-updater');

let mainWindow;
let backendProcess;

const isDev = !app.isPackaged;
const BACKEND_PORT = 3001;

function startBackend() {
  if (isDev) return; // in dev, start backend manually with `npm run dev`

  const serverPath = path.join(process.resourcesPath, 'backend', 'src', 'server.js');
  backendProcess = spawn(process.execPath, [serverPath], {
    env: { ...process.env, PORT: BACKEND_PORT, NODE_ENV: 'production' },
    stdio: 'inherit',
  });

  backendProcess.on('error', err => console.error('Backend error:', err));
  backendProcess.on('exit', code => console.log('Backend exited with code', code));
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width:  1280,
    height: 800,
    minWidth:  1024,
    minHeight: 600,
    webPreferences: {
      preload:         path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration:  false,
    },
    title: 'PharmaDist ERP',
    show: false,
  });

  const url = isDev
    ? 'http://localhost:5173'
    : `file://${path.join(__dirname, '../frontend/dist/index.html')}`;

  mainWindow.loadURL(url);
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    if (!isDev) autoUpdater.checkForUpdatesAndNotify();
  });

  if (isDev) mainWindow.webContents.openDevTools();
}

// ── Backup via mysqldump ──────────────────────────────────────────────────────
ipcMain.handle('backup-db', async () => {
  const { filePath } = await dialog.showSaveDialog({
    title:       'Save Database Backup',
    defaultPath: `pharma-backup-${new Date().toISOString().slice(0,10)}.sql`,
    filters:     [{ name: 'SQL Files', extensions: ['sql'] }],
  });
  if (!filePath) return { success: false };

  return new Promise((resolve) => {
    const dump = spawn('mysqldump', [
      '-u', process.env.DB_USER || 'root',
      `-p${process.env.DB_PASSWORD || ''}`,
      process.env.DB_NAME || 'pharma_erp',
    ]);
    const fs = require('fs');
    const ws = fs.createWriteStream(filePath);
    dump.stdout.pipe(ws);
    dump.on('close', code => resolve({ success: code === 0, filePath }));
    dump.on('error', err => resolve({ success: false, error: err.message }));
  });
});

app.whenReady().then(() => {
  startBackend();
  // Small delay in production to let backend boot
  setTimeout(createWindow, isDev ? 0 : 2000);
});

app.on('window-all-closed', () => {
  if (backendProcess) backendProcess.kill();
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
