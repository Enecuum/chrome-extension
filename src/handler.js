import {decryptAccount, encryptAccount, lockAccount, lockTime} from "./lockAccount"

// const cacheStore = require('./indexDB') // es6
import indexDB from './utils/indexDB'
import {account} from "./user";
import {USER} from "./utils/names";
import * as events from "events";
import eventBus from "./utils/eventBus"; // commonjs
// var cacheStore = window.cacheStore // compiled javascript

export function globalMessageHandler(msg, ENQWeb) {

    return new Promise((resolve, reject) => {

        indexDB.get(USER).then(function (user) {
            console.warn('IndexDB USER')
            console.log(user)
        })

        // TODO Description
        if (msg.initial) {
            runLockTimer()
            resolve({response: true})
        }

        if (msg.window) {
            if (msg.url != undefined) {
                createPopupWindow(msg.url);
            } else {
                createPopupWindow(false);
            }
            resolve();
        }

        // TODO Description
        if (msg.account && msg.request) {
            if (!userStorage.lock.checkLock()) {

                // TODO UNDER CONSTRUCTION

                let userSession
                if (Object.keys(ENQWeb.Enq.User).length > 0) {

                    console.log('Memory session')
                    userSession = ENQWeb.Enq.User

                } else {

                    // let webSession = JSON.parse(sessionStorage.getItem('User'))
                    // userSession = webSession ? webSession : false
                    // console.warn('Session storage: ' + !!userSession)

                    lockAccount()

                    eventBus.dispatch('lock', { message: true })
                    resolve({response: true})
                }

                if (!userSession.publicKey) {
                    console.log('sessionStorage expired')
                    resolve({response: {}})
                    lockAccount()
                    location.reload()
                } else
                    resolve({response: userSession})

            } else {
                resolve({response: false})
            }
        }

        // Unlock user.account object to memory
        if (msg.account && msg.unlock && msg.password) {

            let account = decryptAccount(msg.password)
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
    if (lockTimer !== undefined) {
        clearTimeout(lockTimer)
    }
    if (userStorage.name === "background") {
        lockTimer = setTimeout(() => lockAccount(true), lockTime)
    } else {
        lockTimer = setTimeout(() => userStorage.promise.sendPromise({lock: true}), lockTime)
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

export {
    createPopupWindow
}
