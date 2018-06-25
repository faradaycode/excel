const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const ipcMain = electron.ipcMain;
const path = require('path');
const url = require('url');
const fs = require('fs')
const dbPath = path.resolve(__dirname, '../db/cbt.sqlite');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

let knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: dbPath
  },
  useNullAsDefault: true
});

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200, height: 800, fullscreen: true
  });

  // and load the index.html of the app.
  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '/www/index.html'),
    protocol: 'file:',
    slashes: true
  });

  mainWindow.loadURL(startUrl);
  // mainWindow.loadURL("http://localhost:8100");

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow();

  //sqlite file checker
  //if exist, server.js which contain create database will skiped
  //if none, sqlite will created from server.js
  var dir = path.resolve(__dirname, '../db');

  if (!fs.existsSync(dir)) {
    fs.stat(path.resolve(__dirname, '../db/cbt.sqlite'), function (err, stat) {
      if (err === null) {
        console.log("EXISTS");
      } else if (err.code === "ENOENT") {
        //sqlite
        fs.mkdirSync(dir);
        let server = require(path.resolve(__dirname, './server.js'));
        console.log("null " + err.message);
      } else {
        console.log("some error");
      }
    });
  }
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
});

//ipc for crud
ipcMain.on("updateData", function (ev, arg) {
  //update data
  knex("penilaian").where({
    kelas: arg[0].kelas,
    mapel: arg[0].mapel
  }).update("nilai", arg[0].nilai).then(function (rows) {
    //feedback for alert success
    mainWindow.webContents.send("resultSent", rows);
    console.log(rows);
  }).catch(function (err) {
    //feedback for alert error/fail
    console.log(err);
  });
});

ipcMain.on("selectData", function (ev, arg) {
  mainWindow.webContents.send("location", dbPath);
  knex("penilaian").where("kelas", arg[0].kelas).select("mapel", "nilai").then(function (rows) {
    mainWindow.webContents.send("resultAll", rows);
  }).catch(function (err) {
    console.log(err);
  });

  //select sum
  knex('penilaian').sum('nilai as nl').then(function (sums) {
    mainWindow.webContents.send("resultSum", sums);
    console.log(sums);
  }).catch(function (er) {
    console.log(er);
  });
});