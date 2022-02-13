import {decryptAccount, encryptAccount, lockAccount, lockTime} from "./lockAccount"

// const cacheStore = require('./indexDB') // es6
import indexDB from './utils/indexDB'
import {account} from "./user";
import {LOCK, USER} from "./utils/names";
import * as events from "events";
import eventBus from "./utils/eventBus";
import { startPoa } from './utils/poa' // commonjs
// var cacheStore = window.cacheStore // compiled javascript

let PoAs = []

export function globalMessageHandler(msg, ENQWeb) {

    return new Promise((resolve, reject) => {

        indexDB.get(USER).then(function (user) {
            // console.warn('IndexDB USER')
            // console.log(user)
        })

        // TODO Description
        if (msg.initial) {
            runLockTimer()
            resolve({response: true})
        }

        // TODO Open new window from background or worker
        if (msg.window) {
            if (msg.url != undefined) {
                createPopupWindow(msg.url)
            } else {
                createPopupWindow(false)
            }
            resolve()
        }

        // TODO Popup window request user object
        if (msg.account && msg.request) {

            // If user locked
            if (userStorage.lock.checkLock()) {
                resolve({response: false})
            }

            // If user on background or worker memory
            if (Object.keys(ENQWeb.Enq.User).length > 0) {

                console.log('Memory session')
                resolve({response: ENQWeb.Enq.User})

            // User unlocked but not on memory, old web version
            } else {

                // We lost session
                console.warn('LOST SESSION')

                if (userStorage.user.userExist()) {

                    lockAccount()
                    eventBus.dispatch('lock', {message: true})
                    resolve({response: false})
                }

                // let webSession = JSON.parse(sessionStorage.getItem('User'))
                // userSession = webSession ? webSession : false
                // console.warn('Session storage: ' + !!userSession)
            }
        }

        // Unlock user.account object to memory
        if (msg.account && msg.unlock && msg.password) {

            runLockTimer()

            let account
            try {
                account = decryptAccount(msg.password)
            } catch (e) {
                eventBus.dispatch('lock', {message: false})
            }

            if (account) {

                // Unlock user to memory user
                ENQWeb.Enq.User = account

                // Set user to storage memory (localStorage or IndexedDB)
                userStorage.user.addUser(account)

                // Set user to sessionStorage for web
                // createWebSession(account)

                encryptAccount()
                resolve({response: account})

            } else {
                resolve({response: false})
            }
        }

        // Login by seed and simple login, set user data to app
        if (msg.account && msg.set && msg.data) {

            let account = msg.data

            // console.log(account)

            // Unlock user to memory user
            ENQWeb.Enq.User = account

            // Set user to storage memory (localStorage or IndexedDB)
            userStorage.user.addUser(account)

            encryptAccount()
            resolve({response: account})
        }

        // TODO
        if (msg.account && msg.encrypt) {

            // TODO Password
            if (msg.again) {
                // console.log(msg.data)
                userStorage.user.addUser(msg.data)
            }

            encryptAccount()
            resolve({response: true})
        }

        // Lock user model
        if (msg.lock) {
            lockAccount()
            resolve({response: true})
        }

        // TODO Logout
        if (msg.account && msg.logout) {


            ENQWeb.Enq.User = {}
            userStorage.user.removeUser()

            // disconnectPorts()
            resolve({response: true})
        }

        if(msg.poa && msg.get){
            resolve({response: PoAs})
        }

        if(msg.poa && msg.account){
            if(PoAs.find(el=>el.id === msg.account.publicKey) !== undefined){
                resolve({response: false})
            }else{
                startPoa(msg.account, ENQWeb.Enq.ticker, 'test').forEach(el=>PoAs.push(el))
            }
            console.log(PoAs)
        }

        resolve({response: false})
    })
}

// TODO TEMP
let createWebSession = (account) => {
    const webAccount = JSON.parse(JSON.stringify(account))
    webAccount.privateKey = true
    webAccount.seed = account.seed ? true : ''
    sessionStorage.setItem('User', JSON.stringify(webAccount))
}

let lockTimer

export function Timer(ms) {
    lockTime = ms
    return true
}

export function runLockTimer() {
    console.log('Run lock timer')
    if (lockTimer !== undefined) {
        clearTimeout(lockTimer)
    }
    if (userStorage.name === "background") {
        lockTimer = setTimeout(() => lockAccount(true), lockTime)
    } else {
        lockTimer = setTimeout(() => {
            eventBus.dispatch('lock', {message: true})
            userStorage.promise.sendPromise({lock: true})
        }, lockTime)
    }
}

export async function messagePopupHandler(msg) {
    if (msg.popup) {
    } else if (msg.connectionList) {
        return 0
    }
}

//TODO
function createPopupWindow(url) {
    let mainHeight = 600
    let mainWidth = 350
    const os_width = {
        'Win': mainWidth + 20,
        'Mac': mainWidth,
        'Linux': mainWidth
    }
    const os_height = {
        'Win': mainHeight + 30,
        'Mac': mainHeight + 30,
        'Linux': mainHeight
    }
    const WinReg = /Win/
    const LinuxReg = /Linux/
    chrome.windows.create({
        url: url ? url : 'index.html',
        width: WinReg.test(navigator.platform) ? os_width.Win : os_width.Mac,
        height: LinuxReg.test(navigator.platform) ? os_height.Linux : os_height.Mac,
        type: 'popup'
    })
}

function createTabWindow(params = '') {
    // chrome.windows.create({
    //     url: window.location.href + params,
    // })
    window.open(window.location.href.split('?')[0] + params, '_blank').focus();
}

export {
    createPopupWindow, createTabWindow
}
