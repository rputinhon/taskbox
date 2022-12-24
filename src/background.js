'use strict'

import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'

// const FB = require('fb');
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import notification from './main/notification'
// var Env = JSON.parse(fs.readFileSync(`${__dirname}/env.json`));

const isDevelopment = process.env.NODE_ENV !== 'production'
const io = require('./main/io');

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

let mainWindow;

// app.disableHardwareAcceleration();

async function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    fullscreen: false,
    maximize: true,
    // icon:new Tray('public/img/tlogobox.png'),
    backgroundColor: '#fafafa',
    frame: false,
    autoHideMenuBar: true,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) mainWindow.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    mainWindow.loadURL('app://./index.html')
  }

  // mainWindow.webContents.on('will-navigate', (event) => {
  //   event.preventDefault();
  //   console.log(event);
  // })
  app.setAppUserModelId('Taskbox')
}


// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()

})


// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

ipcMain.on('app:getUID', () => {
  console.log(app);
})

ipcMain.on('app:droppedFiles', (event, arg) => {
  console.log(event, arg);
  event.returnValue = `asdasd${arg}`
})

ipcMain.on('app:restoreSize', () => {
  if (mainWindow.isMaximized())
    mainWindow.unmaximize();
  else
    mainWindow.maximize();
})

ipcMain.on('app:quit', () => {
  app.quit()
})

ipcMain.on('app:forcequit', () => {
  app.exit(0);
})

ipcMain.on('app:maximize', () => {
  mainWindow.maximize();
})

ipcMain.on('app:minimize', () => {
  mainWindow.minimize()
})

ipcMain.on('app:openFolder', (event, folder) => {
  io.openFolder(folder);
})

ipcMain.handle('app:workOnFileTask', (event, args) => {
  Object.assign(args, { win: mainWindow })
  return io.workOnFileTask(args);
})

ipcMain.handle('app:get-username', () => {
  return io.getUserName();
})

ipcMain.handle('app:pack-Project', (event, request) => {
  return io.packProject(request);
})

ipcMain.handle('app:duplicate-File', (event, file) => {
  return io.duplicateFile(file);
})

ipcMain.handle('app:import-Template', () => {
  return io.importTemplate();
})

ipcMain.handle('app:get-Template', (event, path) => {
  return io.getTemplate(path);
})

ipcMain.handle('app:export-Template', (event, taskbox) => {
  return io.exportTemplate(taskbox);
})

ipcMain.handle('app:get-Folders', () => {
  return io.getFolders();
})

ipcMain.handle('app:ensureFolder', (event, path) => {
  return io.ensureFolder(path);
})

ipcMain.handle('app:renameFolder', (event, path) => {
  return io.renameFolder(path);
})

ipcMain.handle('app:rename-File', (event, path) => {
  return io.renameFile(path);
})

ipcMain.handle('app:ensureFile', (event, file) => {
  return io.ensureFile(file);
})

ipcMain.handle('app:existInFilesFolder', (event, file) => {
  return io.existInFilesFolder(file);
})

ipcMain.handle('app:fileExist', (event, file) => {
  return io.fileExist(file);
})

ipcMain.handle('app:getFileList', () => {
  return io.fileList();
})

ipcMain.handle('app:getPackList', () => {
  return io.packList();
})

ipcMain.handle('app:getTemplateList', () => {
  return io.templateList();
})

ipcMain.handle('app:saveFile', (event, file) => {
  return io.saveFile(file);
})

ipcMain.handle('app:createFile', (event, file) => {
  return io.createFile(file);
})

ipcMain.handle('app:getFile', (event, file) => {
  return io.getFile(file);
})

ipcMain.handle('app:get-files', () => {
  return io.getFiles();
});

ipcMain.handle('app:selectImage', (event, request) => {
  // console.log'opening');
  return io.selectImage(request);
})

ipcMain.handle('app:selectFile', () => {
  // console.log'opening');
  return io.selectFile();
})

ipcMain.handle('app:deleteFile', (event, file) => {
  return io.deleteFile(file);
})

ipcMain.handle('app:deletePack', (event, pack) => {
  return io.deletePack(pack);
})

ipcMain.handle('app:deleteFolder', (event, folder) => {
  return io.deleteFolder(folder);
})

ipcMain.handle('app:openFile', (event, file) => {
  return io.openFile(file);
})

ipcMain.handle('app:set-taskDone', (event, task) => {
  return io.taskDone(task);
})

// listen to file(s) add event
ipcMain.handle('app:on-file-add', (event, files = []) => {
  io.addFiles(files);
});

/*-----*/

// listen to file delete event
ipcMain.on('app:on-file-delete', (event, file) => {
  io.deleteFile(file.filepath);
});

// listen to file open event
ipcMain.on('app:on-file-open', (event, file) => {
  io.openFile(file.filepath);
});

//local notifications
ipcMain.on('app:notify', (event, args) => {
  notification.default(args);
});

