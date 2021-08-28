import { app, BrowserWindow, screen } from "electron";
import * as path from "path";

function createWindow() {

  let width = 1920;
  let height = 1080;

  if(app.commandLine.hasSwitch("width")) {
    const val = app.commandLine.getSwitchValue("width");
    if(isNaN(parseInt(val))) throw new Error(`Given width is not a number "${val}"`);
    width = parseInt(val);
  }

  if(app.commandLine.hasSwitch("height")) {
    const val = app.commandLine.getSwitchValue("height");
    if(isNaN(parseInt(val))) throw new Error(`Given height is not a number "${val}"`);
    height = parseInt(val);
  }

  if(!app.commandLine.hasSwitch("url")) {
    console.error("Argument --url is missing.");
    app.quit();
    return;
  }

  const url = app.commandLine.getSwitchValue("url");

  const factor = screen.getPrimaryDisplay().scaleFactor;

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: height / factor,
    width: width / factor,
    useContentSize: true,
    title: "Simple HLS Player",
    autoHideMenuBar: true,
    titleBarStyle: "hidden",
    webPreferences: {
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js"),
      webSecurity: false, //Allow cross origin content to load HLS playlist
      allowRunningInsecureContent: false,
      contextIsolation: true,
      additionalArguments: [`hls-url=${url}`]
    }
  });

  // and load the index.html of the app.
  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadFile(path.join(__dirname, "../public/index.html"));

  // Open the DevTools.
  if(app.commandLine.hasSwitch("dev-tools")) {
    mainWindow.webContents.openDevTools();
  }

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
