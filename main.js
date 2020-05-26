const { app, BrowserWindow, Menu, globalShortcut } = require('electron')

process.env.NODE_ENV = 'development';

const isDev = process.env.NODE_ENV !== 'production' ? true : false;
const isMac = process.platform === 'darwin' ? true : false;
const isLinux = process.platform === 'linux' ? true : false;
console.log(process.platform);

let mainWindow;

function createMainWindow() {
    mainWindow = new BrowserWindow({
        title: 'Resize Me',
        width: 400,
        height: 550,
        autoHideMenuBar: true,
        icon: './assets/icon.png',
        resizable: isDev ? true : false,
        backgroundColor: '#353535',
    })

    mainWindow.loadURL(`file://${__dirname}/app/index.html`)
}

app.on('ready', () => {
    createMainWindow()

    const mainMenu = Menu.buildFromTemplate(menu)
    Menu.setApplicationMenu(mainMenu)

    globalShortcut.register('CmdOrCtrl+R', () => mainWindow.reload())
    globalShortcut.register(isMac ? 'Command+Alt+I' : 'Ctrl+Shift+I', () => mainWindow.toggleDevTools())

    mainWindow.on('ready', () => mainWindow = null)
})

const menu = [
    ...(isMac ? [{
        role: 'appMenu'
    }] : []),
    {
        role: 'fileMenu'
    },
    ...(isDev ? [
        {
            label: 'Developer',
            subMenu: [
                {
                    role: 'reload'
                },
                {
                    role: 'forcereload'
                },
                {
                    type: 'seperator'
                },
                {
                    role: 'toggledevtools'
                },
            ]
        }
    ] : [])
]

app.on('window-all-closed', () => {
    if (isMac) {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow()
    }
})