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
    width: 1024, height: 800, fullscreen: true
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
    mapel: arg[0].mapel,
  }).update({
    "nilai": arg[0].nilai,
    "analisis": arg[0].reviews
  }).then(function (rows) {
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

//analisis review
ipcMain.on("getReview", function (ev, arg) {
  knex("penilaian").where({
    "kelas": arg[0].kelas,
    "mapel": arg[0].mapel
  }).select("analisis").then(function (rows) {
    mainWindow.webContents.send("setReview", rows);
  }).catch(function (err) {
    mainWindow.webContents.send(err);
  });
});

//register
ipcMain.on("onRegister", function (ev, arg) {
  var today = new Date();
  var dir = path.resolve(__dirname, '../db/');

  //read and verify kodebuku inside code.file
  fs.readFile(dir + '/code.file', { encoding: 'utf-8' }, function (err, data) {
    if (!err) {
      //true condition
      if (data.toString() === arg[0].kode) {
        //check data exist in table
        knex.select().table('_user').then(function(rows) {
          if(rows.length > 0) {
            //if table have data inside
            knex('_user').where('id_u','=',1).update({
              'fullname': arg[0].fullname,
              'nick': arg[0].nick
            }).then(function (res) {
              if(res === 1) {
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
                mainWindow.webContents.send("alerting", "unhaldled error when add data");
              }
            }).catch(function (err) {
              //feedback for alert error/fail
              console.log(err);
              mainWindow.webContents.send("alerting", err);
            });
          } else {
            //if table does'nt have data
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
              }
            });
          }
        });
      } else {
        mainWindow.webContents.send("alerting", "kode buku salah");
      }
    }
  });
});

//onstart service
ipcMain.on("onStartWin", function (ev, arg) {
  var today = new Date();
  var dir = path.resolve(__dirname, '../db');

  //check if reg.file not exists
  if (!fs.existsSync(dir + '/reg.file')) {

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
    mainWindow.webContents.send("regstat", true);
  }
});

//get nick for report
ipcMain.on("getNick", function (ev, arg) {
  var dir = path.resolve(__dirname, '../db/');

  //read and verify kodebuku inside code.file
  fs.readFile(dir + '/reg.file', { encoding: 'utf-8' }, function (err, data) {
    if (!err) {
      var rege = /[a-zA-Z]+/g;
      mainWindow.webContents.send("nicks", data.match(rege));
    }
  });
});

//exit apps
ipcMain.on("exitApp", function (ev, arg) {
  app.quit();
});