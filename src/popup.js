import {initApp} from './ui/index'
import {globalMessageHandler, messagePopupHandler} from './handler'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import {versions} from './utils/names'
import {globalState} from './globalState'
import {initializeApp} from "firebase/app";
import {getAnalytics, isSupported} from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAfzIpCa45DfzVYW5DRFYi3S23RdZEXkyI",
    authDomain: "pwa-android-721ae.firebaseapp.com",
    projectId: "pwa-android-721ae",
    storageBucket: "pwa-android-721ae.appspot.com",
    messagingSenderId: "73300778516",
    appId: "1:73300778516:web:d0dc5e8f729b8639409101",
    measurementId: "G-5ZQ7VZ6CSH"
};

// Init storage
import Storage from './utils/localStorage'
import TransportWebUSB from '@ledgerhq/hw-transport-webusb'

const androidRegex = /android/

global.userStorage = new Storage('popup')

// TODO initial globalState
globalState.init()

// TODO we have to move this to background or service worker
global.publisher = {ws: {readyState: 3}}

// TODO
global.Buffer = global.Buffer || require('buffer').Buffer

// TODO port to ext background
let backgroundPort = {}
// TODO array of async tasks id
let taskId = []
// TODO array of async tasks
let awaitId = []
// TODO callbacks of async tasks
let dataId = []
// TODO time of await function
let time = 100

let lockOffsetInterval = 10 * 1000

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

TransportWebUSB.isSupported()
    .then((result) => {
        console.log('WebUSB supported: ' + result)
    })

global.chrome = (typeof chrome === 'undefined') ? {} : chrome

// console.log(navigator.userAgent)
let electron = navigator.userAgent.toLowerCase()
    .includes('electron')
let mobile = navigator.userAgent.toLowerCase()
    .includes('mobile')
// let standalone = window.navigator.standalone === true
let type = electron ? versions.ELECTRON : (mobile ? versions.MOBILE : versions.WEB) // + ' ' + standalone

chrome.manifest = (function () {
    let manifestObject = false
    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            manifestObject = JSON.parse(xhr.responseText)
        }
    }
    xhr.open('GET', 'manifest.json', false)
    try {
        xhr.send()
    } catch (e) {
        console.error('OFFLINE')
    }
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

        console.log('We are looking for process here.')
        // console.log('Process: ' + !!process)

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

    userStorage.promise.sendPromise({initial: true})
        .then(r => {
        })

    // if (!version.includes('web')) {
    //     setInterval(() => {
    //         userStorage.promise.sendPromise({ initial: true }).then(r => {})
    //     }, lockOffsetInterval)
    // }

    const iframe = document.createElement('iframe')
    iframe.setAttribute('id', 'iframe')
    iframe.hidden = true
    document.body.appendChild(iframe)
}

let errors
window.onerror = (error, url, line) => {
    // TODO we have to send error somewhere
}

let initFirebase = () => {
    isSupported().then(result => {
        if (result) {
            const app = initializeApp(firebaseConfig);
            const analytics = getAnalytics(app);
            console.log('FIREBASE')
        }
    })
}

document.addEventListener('DOMContentLoaded', () => {
    setupUI().then()
    initFirebase()
})

let messageListener = {}

function messageListenerSetup(cb) {
    try {
        window.removeEventListener('message', messageListener, false)
        window.addEventListener('message', cb, false)
        messageListener = cb
    } catch (e) {
        console.warn('bug in onmessage setup')
    }
}

global.messageListenerSetup = messageListenerSetup

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


// TODO Msg => Message
let bufferForMsg

global.bufferForMsg = bufferForMsg

let iframeWork = false

let setIframeWork = (data) => {
    iframeWork = data
}

global.setIframeWork = setIframeWork

function asyncRequest(data) {
    data.async = true
    awaitId[data] = false
    let answer = ''
    // iframeWork = true
    if (version.includes('web') || iframeWork === true || androidRegex.test(Capacitor.getPlatform())) {
        answer = messagePopupHandler(data)
        // console.log(answer)
        return answer
    } else {
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
    // console.log(tokens)
    // let tokens = await  ENQWeb.Enq.sendAPI('get_tickers_all')
    userStorage.tokens.setTokens({
        net: ENQWeb.Enq.provider,
        tokens: tokens
    })
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
