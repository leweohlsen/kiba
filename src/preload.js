const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  getTransactions: () => ipcRenderer.invoke("getTransactions"),
});
