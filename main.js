const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const remote = electron.remote;
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
    fs.stat(path.resolve(dir + '/cbt.sqlite'), function (err, stat) {
      if (err === null) {
        console.log("EXISTS");
      } else if (err.code === "ENOENT") {
        //sqlite
        fs.mkdirSync(dir);
        let server = require(path.resolve(__dirname, './server.js'));
        if (!fs.existsSync(dir + '/code.file')) {
          fs.writeFile(dir + '/code.file', 'magentamedia', function (err) {
            if (err) {
              console.log(err);
            }
          });
        }
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
    mainWindow.webContents.send("alerting", err);
  });
});

ipcMain.on("selectData", function (ev, arg) {
  knex("penilaian").where("kelas", arg[0].kelas).select("mapel", "nilai").then(function (rows) {
    mainWindow.webContents.send("resultAll", rows);
  }).catch(function (err) {
    console.log(err);
    mainWindow.webContents.send("alerting", err);
  });

  //select sum
  knex('penilaian').where("kelas", arg[0].kelas).sum('nilai as nl').then(function (sums) {
    mainWindow.webContents.send("resultSum", sums);
    console.log(sums);
  }).catch(function (er) {
    console.log(er);
    mainWindow.webContents.send("alerting", er);
  });
});

//register
ipcMain.on("onRegister", function (ev, arg) {
  var today = new Date();
  var dir = path.resolve(__dirname, '../db/');

  //read and verify kodebuku inside code.file
  fs.readFile(dir + '/code.file', { encoding: 'utf-8' }, function (err, data) {
    if (!err) {

      //if same, insert the data
      if (data.toString() === arg[0].kode) {
        knex("_user").insert({
          fullname: arg[0].fullname,
          nick: arg[0].nick
        }).then(function (rows) {
          if (rows[0] > 0) {
            fs.writeFile(dir + '/reg.file', arg[0].nick + today.getDate() + (today.getMonth() + 1) + today.getFullYear(), function (err) {
              if (err) {
                console.log(err);
                mainWindow.webContents.send("alerting", err);
              } else {
                fs.unlink(dir + '/code.file', function (err) {
                  if (!err) {
                    mainWindow.webContents.send("regstat", true);
                  }
                });
              }
            });
          } else {

            //save failed alert
            mainWindow.webContents.send("alerting", "save user data failed");
          }
        });
      } else {

        //wrong, return alert
        console.log("kode salah");
        mainWindow.webContents.send("alerting", "kode buku salah");

      }
    } else {
      console.log(err);
      mainWindow.webContents.send("alerting", err);
    }
  });
});

//onstart service
ipcMain.on("onStartWin", function (ev, arg) {
  var today = new Date();
  var dir = path.resolve(__dirname, '../db');

  //check if reg.file not exists
  if (!fs.existsSync(dir + '/reg.file')) {

    //if true then check code.file not exists
    if (!fs.existsSync(dir + '/code.file')) {

      //if true, check sqlite data in table _user
      knex.select().table('_user').then(function (rows) {
        if (rows[0] === undefined) {

          //if data undefined (empty data), system will generate code.file, it contains kodebuku for register
          fs.writeFile(dir + '/code.file', 'magentamedia', function (err) {
            if (err) {
              console.log(err);
              mainWindow.webContents.send("alerting", err);
            } else {
              mainWindow.webContents.send("regstat", false);
            }
          });
        } else {

          //but if data exists and file is not, reg.file will be create
          fs.writeFile(dir + '/reg.file', rows[0].nick + today.getDate() + (today.getMonth() + 1) + today.getFullYear(), function (err) {
            if (err) {
              console.log(err);
              mainWindow.webContents.send("alerting", err);
            } else {
              // goto main menu
              mainWindow.webContents.send("regstat", true);
            }
          });
        }
      });
    } else {
      //code.file exists mean the app is not registered, go to register page
      mainWindow.webContents.send("regstat", false);
    }
  } else {

    //reg.file exists but data in sqlite return undefined, auto delete this file
    //after that it will generate code.file
    knex.select().table('_user').then(function (rows) {
      if (rows[0] === undefined) {
        fs.unlink(dir + '/reg.file', function (err) {
          if (!err) {
            fs.writeFile(dir + '/code.file', 'magentamedia', function (err) {
              if (!err) {
                mainWindow.webContents.send("regstat", false);
              }
            })
          } else {
            mainWindow.webContents.send("alerting", err);
          }
        })
      } else {

        //if data in sqlite exists, recreate file reg.file
        mainWindow.webContents.send("regstat", true);
      }
    });
  }
});

//exit apps
ipcMain.on("exitApp", function (ev, arg) {
  app.quit();
});