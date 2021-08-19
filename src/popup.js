import {initApp} from "./ui/index";
import {MsgHandler} from "./handler"

const Storage = require('./utils/localStorage')
let storage = new Storage('popup')
global.disk = storage

let toBackground = {};
let taskId = []
let awaitId = []
let dataId = []
let time = 200

global.chrome = (typeof chrome === 'undefined') ? {} : chrome;

console.log(navigator.userAgent)
let electron = navigator.userAgent.toLowerCase().includes('electron')
let mobile = navigator.userAgent.toLowerCase().includes('mobile')
let type = electron ? ' web electron' : (mobile ? ' web mobile' : ' web')

chrome.manifest = (function () {
    let manifestObject = false;
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {if (xhr.readyState == 4) {manifestObject = JSON.parse(xhr.responseText)}}
    xhr.open("GET", '/manifest.json', false)
    try {xhr.send()} catch (e) {}
    return manifestObject
})()

let alterVersion = chrome.manifest.version + type

// TODO Move away from chrome runtime
console.log(chrome.runtime)
if (!chrome.runtime) {

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

    //TODO
    chrome.runtime.web = true
    chrome.tabs = {}
    chrome.tabs.create = (tab) => {
        window.open(tab.url,'_blank');
    }
}

// Sometimes there is no getManifest function
if (!chrome.runtime.getManifest) {
    chrome.runtime.getManifest = () => {
        return {version: alterVersion}
    }
}

let version = chrome.runtime.getManifest().version

async function setupUi() {

    if (version.includes('web')) {
        global.asyncRequest = asyncRequest
        global.electronBack = MsgHandler
        await initApp()
    } else { // extension
        toBackground = chrome.runtime.connect({name: 'popup'})
        toBackground.onMessage.addListener(mainListener)
        global.Port = toBackground
        global.asyncRequest = asyncRequest
        await initApp(toBackground)
    }
}

function msgHandler(msg, sender) {
    // console.log(msg)
    // console.log(sender)
}

document.addEventListener('DOMContentLoaded', () => {
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
    let answer = '';
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
    // let tokens = await  ENQWeb.Enq.sendAPI('get_tickers_all');
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
    let url = window.location.search.substr(1);
    url = url.split('&')
    for (let i in url) {
        str = url[i].split('=')
        params[str[0]] = str[1]
    }
    return params
}

global.getUrlVars = getUrlVars
global.cacheTokens = cacheTokenInfo
