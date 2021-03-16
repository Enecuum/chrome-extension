import {initApp} from "./ui/index";

const Storage = require('./utils/localStorage')
let storage = new Storage()
global.disk = storage

let toBackground = {};
let taskId = []
let awaitId = []
let time = 200

async function setupUi() {
    toBackground = chrome.runtime.connect({name: 'popup'})
    toBackground.onMessage.addListener(mainListener)
    global.Port = toBackground
    global.asyncRequest = asyncRequest
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


function mainListener(msg, sender, sendResponse) {
    let cb = taskId[msg.taskId]
    if (cb) {
        cb(msg)
        delete taskId[msg.taskId]
        return
    }
    msgHandler(msg, sender)
}

function awaitAsync(data) {
    return new Promise((resolve, reject) => {
        let a = setInterval(() => {
            if (awaitId[data] === true) {
                clearInterval(a)
                resolve()
            }
        }, time)
    })
}

function asyncRequest(data) {
    data.async = true
    awaitId[data] = false
    return new Promise(async (resolve, reject) => {
        toBackground.postMessage(data)
        toBackground.onMessage.addListener(asyncMessenger)
        await awaitAsync(data)
            .then(() => {
                console.log('await work')
                delete awaitId[data]
                toBackground.onMessage.removeListener(asyncMessenger)
                resolve()
            })
    })
}

async function asyncMessenger(msg, sender, sendResponse) {
    if (msg.asyncAnswer && msg.data) {
        console.log('await Messanger worked')
        awaitId[msg.data] = true
    }
}