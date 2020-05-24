const { app, BrowserWindow } = require('electron')

function createMainWindow() {
    const mainWindow = new BrowserWindow({
        title: 'Resize Me',
        width: 400,
        height: 500,
        autoHideMenuBar: true
    })
}

app.on('ready', createMainWindow)