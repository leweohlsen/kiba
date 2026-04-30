import { app, BrowserWindow, ipcMain, protocol, type IpcMainInvokeEvent } from "electron";
import path from "path";
import fs from "fs";
import readline from "readline";
import type { Transaction } from "./app/types";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

function getAppIconPath(): string {
    return app.isPackaged
        ? path.join(process.resourcesPath, "icon_x4.png")
        : path.join(app.getAppPath(), "src", "assets", "icon_x4.png");
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
    // eslint-disable-line global-require
    app.quit();
}

app.setName("kiba");
const linuxApp = app as typeof app & { setDesktopName?: (desktopName: string) => void };
linuxApp.setDesktopName?.("kiba.desktop");

async function handleAppendTransaction(_: any, newTransaction: Transaction<any>) {
    const transactionsFilePath = path.join(app.getPath("userData"), "transactions.jsonl");
    fs.appendFileSync(transactionsFilePath, JSON.stringify(newTransaction) + "\r\n");
}

async function handleGetTransactions() {
    const transactionsFilePath = path.join(app.getPath("userData"), "transactions.jsonl");
    if (!fs.existsSync(transactionsFilePath.toString())) {
        fs.openSync(transactionsFilePath, "w");
    }

    const fileStream = fs.createReadStream(transactionsFilePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    });

    const transactionList = [];

    for await (const line of rl) {
        transactionList.push(JSON.parse(line));
    }

    return transactionList;
}

type DuckDuckGoImageResult = {
    image?: string;
    thumbnail?: string;
};

async function fetchFirstImageUrls(query: string): Promise<string[]> {
    const encodedQuery = encodeURIComponent(query);
    const searchPageUrl = `https://duckduckgo.com/?q=${encodedQuery}&iax=images&ia=images`;
    const searchPageResponse = await fetch(searchPageUrl, {
        headers: { "User-Agent": "Mozilla/5.0" },
    });

    if (!searchPageResponse.ok) {
        throw new Error(`Image search failed with status ${searchPageResponse.status}`);
    }

    const searchPage = await searchPageResponse.text();
    const vqd = searchPage.match(/vqd=['"]?([^'"&]+)['"]?/)?.[1];
    if (!vqd) {
        throw new Error("Could not read image search token");
    }

    const imageSearchParams = new URLSearchParams({
        l: "wt-wt",
        o: "json",
        q: query,
        vqd,
        f: ",,,",
        p: "1",
    });
    const imageSearchResponse = await fetch(`https://duckduckgo.com/i.js?${imageSearchParams.toString()}`, {
        headers: {
            Accept: "application/json",
            Referer: searchPageUrl,
            "User-Agent": "Mozilla/5.0",
        },
    });

    if (!imageSearchResponse.ok) {
        throw new Error(`Image search API failed with status ${imageSearchResponse.status}`);
    }

    const imageSearch = (await imageSearchResponse.json()) as { results?: DuckDuckGoImageResult[] };
    const firstResult = imageSearch.results?.[0];
    const imageUrls = [firstResult?.image, firstResult?.thumbnail].filter(Boolean) as string[];
    if (imageUrls.length === 0) {
        throw new Error("Image search returned no results");
    }

    return imageUrls;
}

function getImageExtension(contentType: string | null, imageUrl: string): string {
    if (contentType?.includes("image/png")) return ".png";
    if (contentType?.includes("image/webp")) return ".webp";
    if (contentType?.includes("image/gif")) return ".gif";
    if (contentType?.includes("image/jpeg")) return ".jpg";

    const pathname = new URL(imageUrl).pathname;
    const extension = path.extname(pathname).toLowerCase();
    return [".png", ".jpg", ".jpeg", ".webp", ".gif"].includes(extension) ? extension : ".jpg";
}

async function handleFetchProductImage(_: IpcMainInvokeEvent, productId: string, query: string): Promise<string> {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
        throw new Error("Product image search query is empty");
    }

    const imageUrls = await fetchFirstImageUrls(trimmedQuery);
    let lastError: Error = undefined;

    for (const imageUrl of imageUrls) {
        try {
            const imageResponse = await fetch(imageUrl, {
                headers: {
                    Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
                    Referer: "https://duckduckgo.com/",
                    "User-Agent": "Mozilla/5.0",
                },
            });
            if (!imageResponse.ok) {
                throw new Error(`Image download failed with status ${imageResponse.status}`);
            }

            const contentType = imageResponse.headers.get("content-type");
            if (!contentType?.startsWith("image/")) {
                throw new Error(`Image download returned ${contentType || "unknown content type"}`);
            }

            const targetFileName =
                productId + "-" + Date.now() + getImageExtension(imageResponse.headers.get("content-type"), imageUrl);
            const productImageDir = path.join(app.getPath("userData"), "product_images");
            await fs.promises.mkdir(productImageDir, { recursive: true });
            const targetFilePath = path.join(productImageDir, targetFileName);
            await fs.promises.writeFile(targetFilePath, Buffer.from(await imageResponse.arrayBuffer()));
            console.log(`Created product image file ${targetFilePath}`);

            return targetFileName;
        } catch (error) {
            lastError = error as Error;
            console.warn(`Could not download product image from ${imageUrl}: ${lastError.message}`);
        }
    }

    throw lastError || new Error("Could not download product image");
}

const createWindow = (): void => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        show: false,
        icon: getAppIconPath(),
        webPreferences: {
            contextIsolation: true,
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
        },
    });

    mainWindow.maximize();
    mainWindow.show();

    ipcMain.handle("getTransactions", handleGetTransactions);
    ipcMain.handle("appendTransaction", handleAppendTransaction);
    ipcMain.handle("fetchProductImage", handleFetchProductImage);

    protocol.registerFileProtocol("productimage", (request, callback) => {
        const file = request.url.substr(15);
        const productImagePath = path.join(app.getPath("userData"), "product_images");
        callback({ path: path.join(productImagePath, file) });
    });
    // and load the index.html of the app.
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
};

protocol.registerSchemesAsPrivileged([{ scheme: "productimage", privileges: { bypassCSP: true } }]);

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
    app.quit();
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
