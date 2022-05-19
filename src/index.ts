import { app, BrowserWindow, ipcMain, dialog } from "electron";
import Store from "electron-store";
import path from "path";

declare const MAIN_WINDOW_WEBPACK_ENTRY: any;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

async function handleGetTransactions() {
  // const { canceled, filePaths } = await dialog.showOpenDialog();
  // if (canceled) {
  //   return;
  // } else {
  //   return filePaths[0];
  // }
  return [
    {
      type: "events/addGroup",
      payload: { id: "g0", name: "Zelt 1" },
    },
    {
      type: "events/addGroup",
      payload: { id: "g1", name: "Zelt 2" },
    },
    {
      type: "events/addGroup",
      payload: { id: "g2", name: "Zelt 3" },
    },
    {
      type: "events/addAccount",
      payload: { id: "a0", name: "Hein Blöd", balance: 3.57, groupId: "g0" },
    },

    {
      type: "events/addAccount",
      payload: {
        id: "a1",
        name: "Käptn Blaubär",
        groupId: "g0",
        balance: 5410.5,
      },
    },
  ];
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
