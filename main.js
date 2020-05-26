const { app, BrowserWindow, Menu, globalShortcut } = require('electron')

process.env.NODE_ENV = 'development';

const isDev = process.env.NODE_ENV !== 'production' ? true : false;
const isMac = process.platform === 'darwin' ? true : false;
const isLinux = process.platform === 'linux' ? true : false;
console.log(process.platform);

let mainWindow;
let aboutWindow;

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

function createAboutWindow() {
    aboutWindow = new BrowserWindow({
        title: 'About Resize Me',
        width: 250,
        height: 250,
        autoHideMenuBar: true,
        icon: './assets/icon.png',
        resizable: false,
        backgroundColor: '#678391',
    })

    aboutWindow.loadURL(`file://${__dirname}/app/about.html`)
}

app.on('ready', () => {
    createMainWindow()

    const mainMenu = Menu.buildFromTemplate(menu)
    Menu.setApplicationMenu(mainMenu)


    // Not needed, set in roles on Developer menu
    globalShortcut.register('CmdOrCtrl+R', () => mainWindow.reload())
    globalShortcut.register(isMac ? 'Command+Alt+I' : 'Ctrl+Shift+I', () => mainWindow.toggleDevTools())

    mainWindow.on('ready', () => mainWindow = null)
})

const menu = [
    ...(isMac ? [{
        label: app.name,
        submenu: [
            {
                label: 'About',
                click: createAboutWindow,
            }
        ]
    }] : []),
    {
        role: 'fileMenu'
    },
    ...(!isMac ? [
        {
            label: 'Help',
            submenu: [
                {
                    label: 'About',
                    click: createAboutWindow,
                },
            ]
        }
    ] : []),
    // Developer Menu: Not working at moment, review
    ...(isDev ? [
        {
            label: 'Developer Menu',
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