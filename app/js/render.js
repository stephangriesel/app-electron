const path = require('path');
const os = require('os');
const { ipcRenderer } = require('electron') // https://www.electronjs.org/docs/api/ipc-renderer

const form = document.getElementById('image-form');
const slider = document.getElementById('slider');
const img = document.getElementById('img');

document.getElementById('output-path').innerText = path.join(os.homedir(), 'resizeme')

// Event Listeners

form.addEventListener('submit', event => {
    event.preventDefault()

    const imgPath = img.files[0].path
    const quality = slider.value
    ipcRenderer.send('image:minimize', {
        imgPath,
        quality
    })
})