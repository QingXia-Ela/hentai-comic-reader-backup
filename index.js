const { app, BrowserWindow } = require('electron')

function createWindow () {
  const win = new BrowserWindow({
    width: 1280,
    height: 700,
    minWidth: 400,
    minHeight: 200
  })

  // 隱藏菜單欄
  const { Menu } = require('electron');
  Menu.setApplicationMenu(null);

  win.loadFile('page/index.html')
}

app.whenReady().then(() => {
  require('./server/server');
  createWindow();
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin'){
        if (process.platform == 'linux'){
            console.log("Linux")
        }else if (process.platform == 'windows'){
            console.log("windows")
        }
        app.quit()
    } 
})