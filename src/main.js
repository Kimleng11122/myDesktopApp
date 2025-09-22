const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const DatabaseService = require('./database/database');
const ExcelService = require('./database/excelService');

// Keep a global reference of the window object
let mainWindow;
let db;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Load the HTML file
  mainWindow.loadFile('dist/index.html');

  // Open the DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  // Emitted when the window is closed
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

// Initialize database when app is ready
app.whenReady().then(async () => {
  try {
    console.log('Initializing database...');
    db = new DatabaseService();
    console.log('Database initialized, creating window...');
    createWindow();
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
});

// Quit when all windows are closed
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

// IPC handlers for database operations
ipcMain.handle('get-members', async () => {
  try {
    console.log('IPC: Getting members...');
    const result = await db.getMembers();
    console.log('IPC: Members result:', result);
    return result;
  } catch (error) {
    console.error('IPC: Error getting members:', error);
    throw error;
  }
});

ipcMain.handle('add-member', async (event, memberData) => {
  return db.addMember(memberData);
});

ipcMain.handle('update-member', async (event, id, memberData) => {
  return db.updateMember(id, memberData);
});

ipcMain.handle('delete-member', async (event, id) => {
  return db.deleteMember(id);
});

ipcMain.handle('get-payments', async (event, memberId) => {
  return db.getPayments(memberId);
});

ipcMain.handle('add-payment', async (event, paymentData) => {
  return db.addPayment(paymentData);
});

ipcMain.handle('get-dashboard-stats', async () => {
  try {
    console.log('IPC: Getting dashboard stats...');
    const result = await db.getDashboardStats();
    console.log('IPC: Dashboard stats result:', result);
    return result;
  } catch (error) {
    console.error('IPC: Error getting dashboard stats:', error);
    throw error;
  }
});

ipcMain.handle('export-excel', async () => {
  const members = await db.getMembers();
  const filePath = await dialog.showSaveDialog(mainWindow, {
    title: 'Export Members to Excel',
    defaultPath: 'members-export.xlsx',
    filters: [
      { name: 'Excel Files', extensions: ['xlsx'] }
    ]
  });
  
  if (!filePath.canceled) {
    const excelService = new ExcelService();
    await excelService.exportMembers(members, filePath.filePath);
    return { success: true, path: filePath.filePath };
  }
  return { success: false };
});

ipcMain.handle('import-excel', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Import Members from Excel',
    filters: [
      { name: 'Excel Files', extensions: ['xlsx'] }
    ],
    properties: ['openFile']
  });
  
  if (!result.canceled) {
    const excelService = new ExcelService();
    const members = await excelService.importMembers(result.filePaths[0]);
    const importedMembers = [];
    
    for (const member of members) {
      try {
        const newMember = await db.addMember(member);
        importedMembers.push(newMember);
      } catch (error) {
        console.error('Error importing member:', error);
      }
    }
    
    return { success: true, imported: importedMembers.length };
  }
  return { success: false };
});
