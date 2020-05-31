const path = require('path');
const os = require('os');
const { app, BrowserWindow, Menu, globalShortcut, ipcMain, shell } = require('electron');
const imagemin = require('imagemin');
const imageminMozJpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const slash = require('slash');


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
        width: isDev ? 1000 : 500,
        height: 550,
        autoHideMenuBar: true,
        icon: './assets/icon.png',
        resizable: isDev ? true : false,
        backgroundColor: '#353535',
        webPreferences: {
            nodeIntegration: true,
        }
    })

    if (isDev) {
        mainWindow.webContents.openDevTools()
    }

    mainWindow.loadURL(`file://${__dirname}/app/index.html`)
}

function createAboutWindow() {
    aboutWindow = new BrowserWindow({
        title: 'About Resize Me',
        width: 250,
        height: auto,
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

ipcMain.on('image:minimize', (event, options) => {
    options.dest = path.join(os.homedir(), 'imageresize')
    resizeImage(options)
})

async function resizeImage({ imgPath, quality, dest }) {
    try {
        const pngQuality = quality / 100
        const files = await imagemin([slash(imgPath)], {
            destination: dest,
            plugins: [
                imageminMozJpeg({ quality }),
                imageminPngquant({
                    quality: [pngQuality, pngQuality]
                })
            ]
        })
        console.log(files)
        shell.openPath(dest)

        mainWindow.webContents.send('image:done')
    } catch (err) {
        console.log(err)
    }
}

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