import { Transaction } from "./app/types";

const { contextBridge, ipcRenderer } = require("electron");

interface ElectronAPI {
    appendTransaction(transaction: Transaction<any>): void;
    getTransactions(): Promise<Transaction<any>[]>;
    selectProductImage(productId: string): void;
    updateProductImage: (channel: string, func: (event: string, data: string) => void) => void;
}

declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}

const electronAPI: ElectronAPI = {
    appendTransaction: (transaction) => ipcRenderer.invoke("appendTransaction", transaction),
    getTransactions: () => ipcRenderer.invoke("getTransactions"),
    selectProductImage: (productId: string) => ipcRenderer.send("selectProductImage", productId),
    updateProductImage: (channel: any, func: any) => {
        ipcRenderer.on(channel, func);
    },
};

contextBridge.exposeInMainWorld("electronAPI", electronAPI);
