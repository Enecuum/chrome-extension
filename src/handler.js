import {decryptAccount, encryptAccount, lockAccount, lockTime} from "./lockAccount"

// const cacheStore = require('./indexDB') // es6
import indexDB from './utils/indexDB'
import {account} from "./user";
import {LOCK, USER} from "./utils/names";
import * as events from "events";
import eventBus from "./utils/eventBus";
import TransportWebHID from '@ledgerhq/hw-transport-webhid'
import {signHash} from './utils/ledgerShell'
import {apiController} from './utils/apiController'
import {extensionApi} from './utils/extensionApi' // commonjs
// var cacheStore = window.cacheStore // compiled javascript

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

        resolve({response: false})
    })
}

//TODO add rule for add to storage
const webBackground = (msg, net) => {
    let popupOpenMethods = {
        'enable': true,
        'tx': true,
        'sign': true
    }
    if (msg.cb.taskId) {
        if (!popupOpenMethods[msg.type]) {
            return true
        }
        console.log(msg)
        if (msg.type === 'tx') {
            userStorage.task.setTask(msg.cb.taskId, {
                tx: msg.tx,
                type: msg.type,
                cb: msg.cb,
                data: msg.data,
            })
            if (msg.data.net.length > 0) {
                if (msg.data.net !== net) {
                    console.log('bad net work')
                    rejectTaskHandler(msg.cb.taskId, `Network mismatch. Set ${msg.data.net}`)
                    return `Network mismatch. Set ${msg.data.net}`
                }
            }
        } else {
            userStorage.task.setTask(msg.cb.taskId, {
                data: msg.data,
                type: msg.type,
                cb: msg.cb
            })
        }
        return true
    } else {
        // console.log(msg)
        return false
    }

}

function rejectTaskHandler(taskId, reason = 'rejected') {
    userStorage.task.removeTask(taskId)
    return true
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
    if (msg.allow && msg.taskId) {
        return await taskHandler(msg.taskId)
            .then(data => {
                return {
                    asyncAnswer: true,
                    data: data
                }
            })
            .catch(err => {
                console.warn(err)
                return {
                    asyncAnswer: true,
                    data: {status: 'reject'}
                }
            })

    } else if (msg.disallow && msg.taskId) {
        rejectTaskHandler(msg.taskId)
        return {
            reject: true,
            data: {
                data: JSON.stringify({
                    reject: true,
                    data: 'rejected'
                })
            }
        }
    }
    if (msg.connectionList) {
        return 0
    }
}

let ledgerTransport

const taskHandler = async (taskId) => {
    let task = userStorage.task.getTask(taskId)
    let buf
    let account = await userStorage.user.loadUser()
    let data = ''

    let wallet = {
        pubkey: account.publicKey,
        prvkey: account.privateKey
    }
    switch (task.type) {
        // TODO Description
        case 'enable':
            data = {
                pubkey: account.publicKey,
                net: account.net,
            }
            console.log('enable. returned: ', data)
            userStorage.task.removeTask(taskId)
            return {
                data: JSON.stringify(data),
                taskId: taskId,
                cb: task.cb
            }
        // TODO Description
        case 'tx':
            data = task.tx
            console.log(data)
            buf = ENQWeb.Net.provider
            ENQWeb.Net.provider = account.net
            if (account.ledger !== undefined && account.type === 2) {
                data.from = wallet.pubkey
                data.amount = data.value ? Number(data.value) : Number(data.amount)
                data.tokenHash = data.ticker ? data.ticker : data.tokenHash
                data.value = ''
                data.nonce ? data.nonce : Math.floor(Math.random() * 1e10)
                data.hash = ENQWeb.Utils.Sign.hash_tx_fields(data)
                let Transport = ledgerTransport ? ledgerTransport : await TransportWebHID.create()
                if (!ledgerTransport) {
                    ledgerTransport = Transport
                }
                data.sign = await signHash(ENQWeb.Utils.crypto.sha256(data.hash), wallet.prvkey, Transport)
                    .catch(() => {
                        return false
                    })
                if (data.sign) {
                    data = await apiController.sendTransaction(data)
                        .then(data => {
                            if (data.hash) {
                                return data
                            }
                            console.warn(data)
                        })
                        .catch(er => {
                            console.error(er)
                        })
                } else {
                    console.warn('Transaction rejected')
                    throw new Error('reject')
                }

            } else {
                data.from = wallet
                data.amount = data.value ? Number(data.value) : Number(data.amount)
                data.tokenHash = data.ticker ? data.ticker : data.tokenHash
                data.value = ''
                data = await apiController.postTransaction(data)
                    .catch(err => {
                        console.log(err)
                        return false
                    })
            }
            ENQWeb.Net.provider = buf
            userStorage.task.removeTask(taskId)
            return {
                data: JSON.stringify({hash: data.hash ? data.hash : 'Error'}),
                taskId: taskId,
                cb: task.cb
            }
            break
        // TODO Description
        case 'balanceOf':
            data = task.data
            buf = ENQWeb.Net.provider
            console.log(account)
            if (data.to) {
                wallet.pubkey = data.to
            }
            ENQWeb.Net.provider = data.net || account.net
            console.log(task.data, ENQWeb.Net.provider)
            data = await apiController.getBalance(wallet.pubkey, data.tokenHash || ENQWeb.Enq.token[ENQWeb.Net.provider])
                .catch(err => {
                    console.log(err)
                    return false
                })
            userStorage.task.removeTask(taskId)
            ENQWeb.Net.provider = buf
            return {
                data: JSON.stringify(data),
                taskId: taskId,
                cb: task.cb
            }
        // TODO Description
        case 'getProvider':
            ENQWeb.Net.provider = account.net
            if (task.cb.fullUrl) {
                data = {net: ENQWeb.Net.provider}
            } else {
                data = {net: ENQWeb.Net.currentProvider}
            }
            userStorage.task.removeTask(taskId)
            return {
                data: JSON.stringify(data),
                taskId: taskId,
                cb: task.cb
            }
        // TODO Description
        case 'getVersion':
            console.log('version: ', extensionApi.app.getDetails().version)
            userStorage.task.removeTask(taskId)
            return {
                data: JSON.stringify(extensionApi.app.getDetails().version),
                taskId: taskId,
                cb: task.cb
            }
        // TODO Description
        case 'sign':
            userStorage.task.removeTask(taskId)
            return {
                data: JSON.stringify(task.result),
                taskId: taskId,
                cb: task.cb
            }
        // TODO Description
        case 'reconnect':
            console.log('reconnect')
            userStorage.task.removeTask(taskId)
        default:
            break
    }
    return true
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
    createPopupWindow, createTabWindow, webBackground, taskHandler
}
