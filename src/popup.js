import {initApp} from "./ui/index"
import {MsgHandler, MsgPopupHandler} from "./handler"
import * as serviceWorkerRegistration from './serviceWorkerRegistration'

const Storage = require('./utils/localStorage')
let storage = new Storage('popup')
global.disk = storage

global.Buffer = global.Buffer || require('buffer').Buffer

let toBackground = {}
let taskId = []
let awaitId = []
let dataId = []
let time = 200

// if (navigator.storage && navigator.storage.estimate) {
//     navigator.storage.estimate().then(quota => {
//         const remaining = quota.quota - quota.usage;
//         console.log(`You can write up to ${(remaining / Math.pow(1024, 3)).toFixed(3)} more gb.`);
//     })
// }

console.log('Popup version: ' + 4)
console.log('HEAD: ' + VERSION)
console.log('Cache available: ' + ('caches' in self))
console.log('Web workers available: ' + (typeof window.Worker === 'function'))

global.chrome = (typeof chrome === 'undefined') ? {} : chrome

// console.log(navigator.userAgent)
let electron = navigator.userAgent.toLowerCase().includes('electron')
let mobile = navigator.userAgent.toLowerCase().includes('mobile')
let type = electron ? ' web electron' : (mobile ? ' web mobile' : ' web')

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

if (!chrome.tabs) {
    chrome.tabs = {}
    chrome.tabs.create = (tab) => {
        window.open(tab.url, '_blank')
    }
}

// Sometimes there is no getManifest function
if (!chrome.runtime.getManifest) {
    console.log('chrome.runtime.getManifest: false')
    chrome.runtime.web = true
    chrome.runtime.getManifest = () => {
        return {version: alterVersion}
    }
}

let version = chrome.runtime.getManifest().version

async function setupUI() {

    if (version.includes('web')) { // web
        global.asyncRequest = asyncRequest
        global.webBack = MsgHandler
        await initApp()
        serviceWorkerRegistration.register()

    } else { // extension
        toBackground = chrome.runtime.connect({name: 'popup'})
        toBackground.onMessage.addListener(mainListener)
        global.Port = toBackground
        global.asyncRequest = asyncRequest
        await initApp(toBackground)
    }

    disk.promise.sendPromise({initial: true})
}

function msgHandler(msg, sender) {
    // console.log(msg)
    // console.log(sender)
}

document.addEventListener('DOMContentLoaded', () => {
    setupUI().then()
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
    let answer = ''
    if (version.includes('web')) {
        return MsgPopupHandler(data)
    } else
        return new Promise(async (resolve, reject) => {
            toBackground.postMessage(data)
            toBackground.onMessage.addListener(asyncMessenger)
            await awaitAsync(data)
                .then(() => {
                    // console.log('await work')
                    delete awaitId[data]
                    answer = dataId[data]
                    delete dataId[data]
                    toBackground.onMessage.removeListener(asyncMessenger)
                    resolve(answer)
                })
        })
}

async function cacheTokenInfo(tokens) {
    // let tokens = await  ENQWeb.Enq.sendAPI('get_tickers_all')
    disk.tokens.setTokens({net: ENQWeb.Enq.provider, tokens: tokens})
    return true
}

async function asyncMessenger(msg, sender, sendResponse) {
    if (msg.asyncAnswer && msg.data) {
        // console.log('await Messanger worked')
        awaitId[msg.data] = true
        dataId[msg.data] = msg
    }
}

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
