const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Member operations
  getMembers: () => ipcRenderer.invoke('get-members'),
  addMember: (memberData) => ipcRenderer.invoke('add-member', memberData),
  updateMember: (id, memberData) => ipcRenderer.invoke('update-member', id, memberData),
  deleteMember: (id) => ipcRenderer.invoke('delete-member', id),
  
  // Payment operations
  getPayments: (memberId) => ipcRenderer.invoke('get-payments', memberId),
  addPayment: (paymentData) => ipcRenderer.invoke('add-payment', paymentData),
  
  // Dashboard operations
  getDashboardStats: () => ipcRenderer.invoke('get-dashboard-stats'),
  
  // Excel operations
  exportExcel: () => ipcRenderer.invoke('export-excel'),
  importExcel: () => ipcRenderer.invoke('import-excel'),
});
