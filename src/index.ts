import { app, BrowserWindow, ipcMain, dialog } from "electron";
import Store from "electron-store";
import path from "path";
import fs from "fs";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { EventPayload } from "./app/types";

declare const MAIN_WINDOW_WEBPACK_ENTRY: any;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

async function handleSaveTransactions(_, transactions: PayloadAction<EventPayload>[]) {
  const transactionsFilePath = path.join(app.getPath("userData"), "transactions.json");
  await fs.promises.writeFile(transactionsFilePath, JSON.stringify(transactions));
  return transactions;
}

async function handleGetTransactions() {
  const transactionsFilePath = path.join(app.getPath("userData"), "transactions.json");
  const buffer = await fs.promises.readFile(transactionsFilePath);
  return JSON.parse(buffer.toString());
}

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      preload: path.join(__dirname, "../../src/preload.js"),
    },
  });

  ipcMain.handle("getTransactions", handleGetTransactions);
  ipcMain.handle("saveTransactions", handleSaveTransactions);

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
