import { Transaction } from "./app/types";

const { contextBridge, ipcRenderer } = require("electron");

interface ElectronAPI {
    appendTransaction(transaction: Transaction<any>): void;
    getTransactions(): Promise<Transaction<any>[]>;
    fetchProductImage(productId: string, query: string): Promise<string>;
}

declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}

const electronAPI: ElectronAPI = {
    appendTransaction: (transaction) => ipcRenderer.invoke("appendTransaction", transaction),
    getTransactions: () => ipcRenderer.invoke("getTransactions"),
    fetchProductImage: (productId: string, query: string) => ipcRenderer.invoke("fetchProductImage", productId, query),
};

contextBridge.exposeInMainWorld("electronAPI", electronAPI);
