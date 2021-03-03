const content = require('./ui/content')
import {initApp} from "./ui/index";

const Storage = require('./utils/localStorage')
let storage = new Storage()
global.disk = storage

let toBackground = {};
let taskId = []

async function setupUi() {
    toBackground = chrome.runtime.connect({name: 'popup'})
    toBackground.onMessage.addListener((msg, sender, sendResponse) => {
        let cb = taskId[msg.taskId]
        if (cb) {
            cb(msg)
            delete taskId[msg.taskId]
            return
        }
        msgHandler(msg, sender)
    })
    global.Port = toBackground

    // Запуск интерфейса
    // let Content = new content(toBackground)
    // global.Content = Content
    await initApp(toBackground)
}

function msgHandler(msg, sender) {
    console.log(msg)
    console.log(sender)
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('loaded 1')
    setupUi().then()
})
