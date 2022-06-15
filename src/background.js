import { signHash } from './utils/ledgerShell'

import { extensionApi } from './utils/extensionApi'
import { lockAccount, say } from './lockAccount'
import { createPopupWindow, globalMessageHandler } from './handler'
import TransportWebHID from '@ledgerhq/hw-transport-webhid'
import { apiController } from './utils/apiController'
// import {startPoa} from "./utils/poa/index"

document.addEventListener('DOMContentLoaded', function () {
    if (!userStorage.lock.checkLock() && userStorage.lock.getHashPassword()) {
        lockAccount()
    }
    console.log('Lock status: ', userStorage.lock.checkLock())
    console.log('Hash password: ', userStorage.lock.getHashPassword() ? true : false)
})

// TODO Hmm
say()

const Storage = require('./utils/localStorage')
global.userStorage = new Storage('background')

let ports = {}
let requestQueue = {}
let limitOfTransactions = 10

let requestsMethods = {
    'tx': true,
    'enable': false,
    'balanceOf': false,
    'getProvider': false,
    'getVersion': false,
    'sign': true,
    'reconnect': false
}

let lockedMethods = {
    'enable': true,
    'reconnect': true
}

let popupOpenMethods = {
    'enable': true,
    'tx': true,
    'sign': true
}

let antiSpamMethods = {
    'tx': true,
    'sign': true
}

let ledgerTransport = false
const VALID_VERSION_LIB = '0.2.3'

let Account = {}

function setupApp() {
    // console.log('background ready')
    extensionApi.runtime.onMessage.addListener(messageHandler)
    extensionApi.runtime.onConnect.addListener(connectHandler)
    taskCounter()
    if (!userStorage.config.getConfig()) {
        userStorage.config.initConfig()
    }
    let tasks = userStorage.list.listOfTask()
    for (let i in tasks) {
        if (antiSpamMethods[tasks[i].type]) {
            if (!requestQueue[tasks[i].cb.url]) {
                requestQueue[tasks[i].cb.url] = 0
            }
            requestQueue[tasks[i].cb.url] += 1
        }
    }
}

function messageHandler(msg, sender, sendResponse) {

    if (msg.ports && msg.disconnect) {
        if (msg.all) {
            disconnectPorts()
        }
        if (msg.name) {
            if (msg.favorite) {
                disconnectFavoriteSite(msg.name)
            } else {
                disconnectPorts(msg.name)
            }
        }
    }

    if (msg.account && msg.logout) {
        ports = {}
    }

    globalMessageHandler(msg, ENQWeb)
        .then(answer => sendResponse(answer))

    return true
}

async function msgConnectHandler(msg, sender) {
    // console.log(msg)
    let answer = ''
    if (msg.taskId) {
        let sites = userStorage.sites.getSites()
        popupOpenMethods.enable = userStorage.config.getConfig().openEnablePopup
        popupOpenMethods.tx = userStorage.config.getConfig().openTxPopup
        popupOpenMethods.sign = userStorage.config.getConfig().openSignPopup
        let lock = userStorage.lock.checkLock()
        // if (lock) {
        //     if (!lockedMethods[msg.type]) {
        //         await userStorage.task.setTask(msg.taskId, {
        //             data: msg.data,
        //             type: msg.type,
        //             cb: msg.cb
        //         })
        //         rejectTaskHandler(msg.taskId, "extension is locked")
        //         return
        //     }
        // }

        if (!ports[msg.cb.url].enabled) {
            if (msg.type === 'enable') {
                await userStorage.task.setTask(msg.taskId, {
                    data: msg.data,
                    type: msg.type,
                    cb: msg.cb
                })

                if (typeof msg.data !== 'object' || msg.data.version < VALID_VERSION_LIB) {
                    console.log('old version of ENQWeb lib')
                    rejectTaskHandler(msg.taskId, 'old version')
                    return
                } else {
                    if (sites[msg.cb.url] === true && !lock) {
                        taskHandler(msg.taskId)
                            .then(r => {
                            })
                    } else {
                        taskCounter()
                        if (popupOpenMethods.enable) {
                            createPopupWindow(`index.html?type=${msg.type}&id=${msg.taskId}`)
                        }
                    }
                }
            }
            if (msg.type === 'reconnect') {
                await userStorage.task.setTask(msg.taskId, {
                    data: msg.data,
                    type: msg.type,
                    cb: msg.cb
                })
                taskHandler(msg.taskId)
            }
        } else {
            if (msg.type === 'tx') {
                userStorage.task.setTask(msg.taskId, {
                    tx: msg.tx,
                    type: msg.type,
                    cb: msg.cb,
                    data: msg.data,
                })
                if (requestQueue[msg.cb.url] >= limitOfTransactions) {
                    console.log('too many requests')
                    rejectTaskHandler(msg.taskId, `too many requests`)
                    requestQueue[msg.cb.url] += 1
                    return false
                } else {
                    requestQueue[msg.cb.url] += 1
                    console.log(requestQueue[msg.cb.url])
                }
                if (msg.data.net.length > 0) {
                    if (msg.data.net !== ENQWeb.Enq.User.net) {
                        console.log('bad net work')
                        rejectTaskHandler(msg.taskId, `Network mismatch. Set ${msg.data.net}`)
                        return false
                    }
                }
            } else {
                userStorage.task.setTask(msg.taskId, {
                    data: msg.data,
                    type: msg.type,
                    cb: msg.cb
                })

            }
            if (!requestsMethods[msg.type]) {
                taskHandler(msg.taskId)
                    .then(r => {
                    })
            } else {
                taskCounter()
                if (ports[msg.cb.url].enabled && popupOpenMethods[msg.type]) {
                    createPopupWindow(`index.html?type=${msg.type}&id=${msg.taskId}`)
                }
            }
        }
    } else {
        // console.log(msg)
    }

}

// //TODO
// function createPopupWindow(url) {
//     let mainHeight = 600
//     let mainWidth = 350
//     const os_width = {
//         'Win': mainWidth + 20,
//         'Mac': mainWidth,
//         'Linux': mainWidth
//     }
//     const os_height = {
//         'Win': mainHeight + 30,
//         'Mac': mainHeight + 30,
//         'Linux': mainHeight
//     }
//     const WinReg = /Win/
//     const LinuxReg = /Linux/
//     chrome.windows.create({
//         url: url ? url : 'index.html',
//         width: WinReg.test(navigator.platform) ? os_width.Win : os_width.Mac,
//         height: LinuxReg.test(navigator.platform) ? os_height.Linux : os_height.Mac,
//         type: 'popup'
//     })
// }

async function msgPopupHandler(msg, sender) {
    if (msg.popup) {
    } else if (msg.connectionList) {
        ports.popup.postMessage({
            asyncAnswer: true,
            data: msg,
            ports: enabledPorts()
        })
    } else if (msg.favoriteList) {

        ports.popup.postMessage({
            asyncAnswer: true,
            data: msg,
            ports: favoriteSites()
        })
    } else {
        if (msg.allow && msg.taskId) {
            await taskHandler(msg.taskId)
                .then(() => {
                    taskCounter()
                    if (msg.async) {
                        ports.popup.postMessage({
                            asyncAnswer: true,
                            data: msg
                        })
                    }
                })
                .catch(err => {
                    console.warn(err)
                    if (msg.async) {
                        ports.popup.postMessage({
                            asyncAnswer: true,
                            data: { status: 'reject' }
                        })
                    }
                })

        } else if (msg.disallow && msg.taskId) {
            await rejectTaskHandler(msg.taskId)
            taskCounter()
            if (msg.async) {
                ports.popup.postMessage({
                    asyncAnswer: true,
                    data: msg
                })
            }
        } else if (msg.reject_all) {
            let list = userStorage.list.loadList()
            for (let i in list) {
                await rejectTaskHandler(list[i])
            }
            taskCounter()
            if (msg.async) {
                ports.popup.postMessage({
                    asyncAnswer: true,
                    data: msg
                })
            }
        } else {
            // console.log(msg)
        }
    }
}

function enabledPorts() {
    let list = {}
    for (let i in ports) {
        if (ports[i].enabled) {
            list[i] = ports[i]
        }
    }
    return list
}

function favoriteSites() {
    let sites = userStorage.sites.getSites()
    let list = []
    for (let i in sites) {
        if (sites[i] === true) {
            list.push(i)
        }
    }
    return list
}

function listPorts() {
    global.ports = ports
}


function disconnectHandler(port) {
    console.log('disconnected: ' + port.name)
    ports[port.name].disconnect()
    delete ports[port.name]
}

function connectController(port) {
    if (port.name === 'popup') {
        ports[port.name] = port
        return
    }
    if (ports[port.name]) {
        ports[port.name].push(port)
    } else {
        ports[port.name] = []
        ports[port.name].push(port)
    }
    if (!requestQueue[port.name]) {
        requestQueue[port.name] = 0
    }
}

function checkConnection() {
    // console.log("check live")
    if (Object.keys(ports).length > 0) {
        for (let i in ports) {
            if (i === 'popup') {
                continue
            }
            for (let j in ports[i]) {
                if (j === 'enabled') {
                    continue
                }
                try {
                    ports[i][j].postMessage({ check: 'are u live?' })
                } catch (e) {
                    // console.log("deleted")
                    delete ports[i][j]
                }
            }
        }
    }
}

global.ports = ports

function disconnectPorts(name) {
    if (!name) {
        for (let key in ports) {
            // console.log(key,ports[key]);
            if (ports[key].name !== 'popup') {
                ports[key].enabled = false
            }
        }
    } else {
        ports[name].enabled = false
    }
    return true
}

function disconnectFavoriteSite(name) {
    let sites = userStorage.sites.getSites()
    if (sites[name] === true) {
        sites[name] = false
        userStorage.sites.setSites(sites)
    }
}

global.disconnectPorts = disconnectPorts

function taskCounter() {
    let tasks = userStorage.task.loadTask()
    let ids = Object.keys(tasks)
    extensionApi.browserAction.setBadgeText({ text: `${ids.length === 0 ? '' : ids.length}` })
}

global.counterTask = taskCounter

async function taskHandler(taskId) {

    let task = userStorage.task.getTask(taskId)
    console.log(task)

    let sites = userStorage.sites.getSites()

    let account = ENQWeb.Enq.User
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
        broadcast(task.cb.url, {
            data: JSON.stringify(data),
            taskId: taskId,
            cb: task.cb
        })
            .then()
        ports[task.cb.url].enabled = true
        userStorage.task.removeTask(taskId)
        break
        // TODO Description
    case 'tx':
        if (ports[task.cb.url].enabled) {
            console.log('tx handler work!')
            data = task.tx
            console.log(data)
            let buf = ENQWeb.Net.provider
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
                console.log({ sign: data.sign })
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
            broadcast(task.cb.url, {
                data: JSON.stringify({ hash: data.hash ? data.hash : 'Error' }),
                taskId: taskId,
                cb: task.cb
            })
                .then()
            ENQWeb.Net.provider = buf
        }
        userStorage.task.removeTask(taskId)
        if (requestQueue[task.cb.url] > 0) {
            requestQueue[task.cb.url] -= 1
        }
        break
        // TODO Description
    case 'balanceOf':
        console.log('balanceOf handler work!')
        if (ports[task.cb.url].enabled) {
            data = task.data
            let buf = ENQWeb.Net.provider
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
            broadcast(task.cb.url, {
                data: JSON.stringify(data),
                taskId: taskId,
                cb: task.cb
            })
                .then()
            console.log({
                data: JSON.stringify(data),
                taskId: taskId,
                cb: task.cb
            })
            ENQWeb.Net.provider = buf
        }
        userStorage.task.removeTask(taskId)
        break
        // TODO Description
    case 'getProvider':
        if (ports[task.cb.url].enabled) {
            ENQWeb.Net.provider = account.net
            if (task.cb.fullUrl) {
                data = { net: ENQWeb.Net.provider }
            } else {
                data = { net: ENQWeb.Net.currentProvider }
            }
            console.log(data)
            broadcast(task.cb.url, {
                data: JSON.stringify(data),
                taskId: taskId,
                cb: task.cb
            })
                .then()
        }
        userStorage.task.removeTask(taskId)
        break
        // TODO Description
    case 'getVersion':
        if (ports[task.cb.url].enabled) {
            console.log('version: ', extensionApi.app.getDetails().version)
            broadcast(task.cb.url, {
                data: JSON.stringify(extensionApi.app.getDetails().version),
                taskId: taskId,
                cb: task.cb
            })
                .then()
        }
        userStorage.task.removeTask(taskId)
        break
        // TODO Description
    case 'sign':
        console.log('sign work')
        if (ports[task.cb.url].enabled) {
            broadcast(task.cb.url, {
                data: JSON.stringify(task.result),
                taskId: taskId,
                cb: task.cb
            })
                .then()
        }
        userStorage.task.removeTask(taskId)
        break
        // TODO Description
    case 'reconnect':
        console.log('reconnect')
        let connected = ports[task.cb.url].enabled ? true : false
        if (sites[task.cb.url] === true) {
            connected = true
        }
        broadcast(task.cb.url, {
            data: JSON.stringify({ status: connected }),
            taskId: taskId,
            cb: task.cb
        })
            .then()
        userStorage.task.removeTask(taskId)
    default:
        break
    }
    return true
}

function rejectTaskHandler(taskId, reason = 'rejected') {
    let task = userStorage.task.getTask(taskId)
    userStorage.task.removeTask(taskId)
    let data = {
        reject: true,
        data: reason
    }
    broadcast(task.cb.url, {
        data: JSON.stringify(data),
        taskId: taskId,
        cb: task.cb || ''
    })
        .then()
    if (task.type === 'tx') {
        if (requestQueue[task.cb.url] > 0) {
            requestQueue[task.cb.url] -= 1
        }
    }
    return true
}

function broadcast(host, data) {
    return new Promise((resolve) => {
        if (ports[host]) {
            for (let i in ports[host]) {
                if (i === 'enable') {
                    continue
                }
                try {
                    ports[host][i].postMessage(data)
                } catch (e) {

                }
            }
            resolve(true)
        } else {
            resolve(false)
        }
    })
}

async function connectHandler(port) {
    await connectController(port)
    switch (port.name) {
        // TODO Description
    case 'content':
        port.onMessage.addListener(msgConnectHandler)
        break
        // TODO Description
    case 'popup':
        port.onMessage.addListener(msgPopupHandler)
        break
    default:
        port.onMessage.addListener(msgConnectHandler)
        break
    }
    listPorts()
}

document.addEventListener('DOMContentLoaded', () => {
    setupApp()
    setInterval(checkConnection, 1000 * 5)
})
