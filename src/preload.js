const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  appendTransaction: (transaction) => ipcRenderer.invoke("appendTransaction", transaction),
  getTransactions: () => ipcRenderer.invoke("getTransactions"),
  selectProductImage: (productId) => ipcRenderer.send("selectProductImage", productId),
  updateProductImage: (channel, func) => {
    ipcRenderer.once(channel, func);
  }
});
