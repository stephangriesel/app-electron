const { app, BrowserWindow } = require('electron')

let mainWindow;

function createMainWindow() {
    mainWindow = new BrowserWindow({
        title: 'Resize Me',
        width: 400,
        height: 500,
        autoHideMenuBar: true,
        icon: './assets/icons/icon.png'
    })

    mainWindow.loadURL(`file://${__dirname}/app/index.html`)
}

app.on('ready', createMainWindow)