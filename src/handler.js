import {decryptAccount, encryptAccount, lockAccount, lockTime} from "./lockAccount"
import {account, getSeedAccounts, changeAccount, addAccountOldFormat, updateAccount} from "./user"

// const cacheStore = require('./indexDB') // es6
import indexDB from './indexDB'
import {logger} from "workbox-core/_private"; // commonjs
// var cacheStore = window.cacheStore // compiled javascript

export function MessageHandler(msg) {
    return new Promise(async (resolve, reject) => {

        if (msg.initial) {
            indexDB.get('user').then((user) => {
                if (user === undefined) {
                    indexDB.set('user', account).then()
                }
            })
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
        if (msg.account && msg.request) {
            if (!disk.lock.checkLock()) {

                let userSession
                resolve({
                    promise: indexDB.get('user').then(account => {

                        if (account !== undefined) {
                            userSession = account
                        }
                        if (!userSession.mainPublicKey) {
                            console.log('sessionStorage expired')
                            // resolve({response: {}})
                            lockAccount()
                            window.location.reload()
                        } else {
                            // resolve({response: userSession})
                            return {response: userSession}
                        }
                    })
                })
            } else {
                console.log(!disk.lock.checkLock())
                resolve({response: false})
            }

        }
        if (msg.account && msg.unlock && msg.password) {

            decryptAccount(msg.password)
            resolve({
                promise: indexDB.get('user').then(account => {
                    if (account !== undefined) {
                        // TODO
                        createWebSession(account)
                        // resolve({response: account})
                        return {response: account}
                    } else {
                        // resolve({response: false})
                        return {response: false}
                    }
                })
            })


        }
        if (msg.account && msg.set && msg.data) {

            // Edit user
            if (msg.add)
                addAccountOldFormat(msg.data)
            if (msg.update)
                updateAccount(msg.data)

            resolve({
                promise: indexDB.get('user').then(account => {
                    createWebSession(account)
                    // resolve({response: account})
                    return {response: account}
                })
            })


        }
        if (msg.account && msg.encrypt) {
            if (msg.again) {
                // console.log(msg.data)
                // disk.user.addUser(msg.data)
                // encryptAccount()
            } else {
                // encryptAccount()
            }
            resolve({response: true})
        }
        if (msg.lock) {
            lockAccount()
            resolve({response: true})
        }
        if (msg.account && msg.logout) {
            // ENQWeb.Enq.User = {}
            sessionStorage.setItem('User', JSON.stringify({}))
            indexDB.set('user', account).then()
            // disconnectPorts()
            resolve({response: true})
        }
        resolve({response: false})
    })
}

let createWebSession = (account) => {

    // TODO
    const webAccount = JSON.parse(JSON.stringify(account))
    webAccount.privateKey = true
    webAccount.seed = account.seed ? true : ''
    sessionStorage.setItem('User', JSON.stringify(webAccount))
}

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
        url: url ? url : "index.html",
        width: WinReg.test(navigator.platform) ? os_width.Win : os_width.Mac,
        height: LinuxReg.test(navigator.platform) ? os_height.Linux : os_height.Mac,
        type: 'popup'
    })
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
    if (disk.name === "background") {
        lockTimer = setTimeout(() => lockAccount(true), lockTime)
    } else {
        lockTimer = setTimeout(() => disk.promise.sendPromise({lock: true}), lockTime)
    }
}

export async function MsgPopupHandler(msg) {
    if (msg.popup) {
    } else if (msg.connectionList) {
        return 0
    }
}

export {
    createPopupWindow
}

