import {initApp} from "./ui/index";

const Storage = require('./utils/localStorage')
let storage = new Storage('popup')
global.disk = storage

let toBackground = {};
let taskId = []
let awaitId = []
let dataId = []
let time = 200

// TODO electron support
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
        return {version: 'electron'}
    }

    console.log(chrome.runtime)
}

async function setupUi() {
    toBackground = chrome.runtime.connect({name: 'popup'})
    toBackground.onMessage.addListener(mainListener)
    global.Port = toBackground
    global.asyncRequest = asyncRequest
    await initApp(toBackground)
}

function msgHandler(msg, sender) {
    // console.log(msg)
    // console.log(sender)
}

document.addEventListener('DOMContentLoaded', () => {
    // console.log('loaded 1')
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
