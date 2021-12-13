import {initApp} from "./ui/index"
import {globalMessageHandler, messagePopupHandler} from "./handler"
import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import {versions} from "./utils/names";

// Init storage
import Storage from './utils/localStorage'
global.userStorage = new Storage('popup')

// TODO
global.Buffer = global.Buffer || require('buffer').Buffer

// TODO Description
let backgroundPort = {}
// TODO Description
let taskId = []
// TODO Description
let awaitId = []
// TODO Description
let dataId = []
// TODO Description
let time = 200

// if (navigator.storage && navigator.storage.estimate) {
//     navigator.storage.estimate().then(quota => {
//         const remaining = quota.quota - quota.usage;
//         console.log(`You can write up to ${(remaining / Math.pow(1024, 3)).toFixed(3)} more gb.`);
//     })
// }

// console.log('Popup version: ' + 4)
console.log('HEAD: ' + VERSION)
console.log('Cache available: ' + ('caches' in self))
console.log('Web workers available: ' + (typeof window.Worker === 'function'))

global.chrome = (typeof chrome === 'undefined') ? {} : chrome

// console.log(navigator.userAgent)
let electron = navigator.userAgent.toLowerCase().includes('electron')
let mobile = navigator.userAgent.toLowerCase().includes('mobile')
let type = electron ? versions.ELECTRON : (mobile ? versions.MOBILE : versions.WEB)

chrome.manifest = (function () {
    let manifestObject = false;
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {if (xhr.readyState == 4) {manifestObject = JSON.parse(xhr.responseText)}}
    xhr.open('GET', '/manifest.json', false)
    try {xhr.send()} catch (e) {console.error('OFFLINE')}
    return manifestObject
})()

// fetch('/manifest.json')
//     .then(response => response.json())
//     .then(data => {
//         console.log(data)
//         chrome.manifest = data
//     })

let alterVersion = chrome.manifest.version + type

// TODO Move away from chrome runtime
if (!chrome.runtime) {
    console.log('chrome.runtime: ' + !!chrome.runtime)
    chrome.runtime = {}
    chrome.runtime.connect = () => {
        return {
            onMessage: {
                addListener: () => {
                }
            }
        }
    }
    chrome.runtime.sendMessage = () => {
        return {response: true}
    }
    chrome.runtime.getManifest = () => {
        return {version: alterVersion}
    }
    chrome.runtime.web = true
}

if (!chrome.windows) {
    chrome.windows = {}
    chrome.windows.create = (tab) => {
        window.open(tab.url, '_blank')
    }
}

if (!chrome.tabs) {
    chrome.tabs = {}
    chrome.tabs.create = (tab) => {
        window.open(tab.url, '_blank')
    }
}

// Sometimes there is no getManifest function within chrome.runtime
if (!chrome.runtime.getManifest) {
    console.log('chrome.runtime.getManifest: false')
    chrome.runtime.web = true
    chrome.runtime.getManifest = () => {
        return {version: alterVersion}
    }
}

let version = chrome.runtime.getManifest().version

async function setupUI() {

    if (version.includes('web')) { // If this is our WEB version with service worker

        // Simple message provider
        global.webBackgroundPort = globalMessageHandler
        // Service worker start
        serviceWorkerRegistration.register()

        global.asyncRequest = asyncRequest
        await initApp()

    } else { // Extension version

        // Connect to background
        backgroundPort = chrome.runtime.connect({name: 'popup'})
        backgroundPort.onMessage.addListener(mainListener)

        // TODO
        // global.Port = backgroundPort

        global.asyncRequest = asyncRequest
        await initApp(backgroundPort)
    }

    userStorage.promise.sendPromise({initial: true}).then(r => {})
}

document.addEventListener('DOMContentLoaded', () => {
    setupUI().then()
})


// TODO Rename CB
function mainListener(msg, sender, sendResponse) {
    let cb = taskId[msg.taskId]
    if (cb) {
        cb(msg)
        delete taskId[msg.taskId]
        return
    }
    // msgHandler(msg, sender)
}

function msgHandler(msg, sender) {
    // console.log(msg)
    // console.log(sender)
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
    let answer = ''
    if (version.includes('web')) {
        return messagePopupHandler(data)
    } else
        return new Promise(async (resolve, reject) => {
            backgroundPort.postMessage(data)
            backgroundPort.onMessage.addListener(asyncMessenger)
            await awaitAsync(data)
                .then(() => {
                    // console.log('await work')
                    delete awaitId[data]
                    answer = dataId[data]
                    delete dataId[data]
                    backgroundPort.onMessage.removeListener(asyncMessenger)
                    resolve(answer)
                })
        })
}

async function asyncMessenger(msg, sender, sendResponse) {
    if (msg.asyncAnswer && msg.data) {
        // console.log('await Messanger worked')
        awaitId[msg.data] = true
        dataId[msg.data] = msg
    }
}

// TODO Description
async function cacheTokenInfo(tokens) {
    // let tokens = await  ENQWeb.Enq.sendAPI('get_tickers_all')
    userStorage.tokens.setTokens({net: ENQWeb.Enq.provider, tokens: tokens})
    return true
}

// TODO Description
function getUrlVars() {
    let params = []
    let str
    let url = window.location.search.substr(1)
    url = url.split('&')
    for (let i in url) {
        str = url[i].split('=')
        params[str[0]] = str[1]
    }
    return params
}

global.getUrlVars = getUrlVars
global.cacheTokens = cacheTokenInfo
