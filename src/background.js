const storage = require('./utils/localStorage')
import {extensionApi} from './utils/extensionApi'
import {decryptAccount, encryptAccount, lockAccount, say} from "./lockAccount"
import {MsgHandler} from "./handler"

say()

let Storage = new storage('background')
global.disk = Storage

let ports = {}
let requestsMethods = {
    'tx': true,
    'enable': true,
    'balanceOf': false,
    'getProvider': false,
    'getVersion': false,
    'sign': true
}


let popupOpenMethods = {
    'enable': true,
    'tx': true,
    'sign': true
}

const VALID_VERSION_LIB = '0.2.0'

let Account = {}

function setupApp() {
    // console.log('background ready')
    extensionApi.runtime.onMessage.addListener(msgHandler)
    extensionApi.runtime.onConnect.addListener(connectHandler)
    taskCounter()
    if (!Storage.config.getConfig()) {
        Storage.config.initConfig()
    }
}

async function msgHandler(msg, sender, sendResponse) {
    if (msg.ports && msg.disconnect) {
        if (msg.all) {
            disconnectPorts()
        }
        if (msg.name) {
            disconnectPorts(msg.name)
        }
    }
    MsgHandler(msg, ENQWeb).then(answer=>sendResponse(answer))
}

async function msgConnectHandler(msg, sender) {
    // console.log(msg)
    let answer = ''
    if (msg.taskId) {
        popupOpenMethods.enable = disk.config.getConfig().openEnablePopup
        popupOpenMethods.tx = disk.config.getConfig().openTxPopup
        popupOpenMethods.sign = disk.config.getConfig().openSignPopup
        let account = ENQWeb.Enq.User
        let lock = disk.lock.checkLock()
        if (!account.net && !lock) {
            // console.log('non auth')
            rejectTaskHandler(msg.taskId)
        } else {
            // console.log('auth ok',{acc,lock})
            if (!ports[msg.cb.url].enabled) {
                if (msg.type === 'enable') {
                    if (typeof msg.data !== 'object' || msg.data.version < VALID_VERSION_LIB) {
                        console.log('old version of ENQWeb lib')
                    } else {
                        await Storage.task.setTask(msg.taskId, {
                            data: msg.data,
                            type: msg.type,
                            cb: msg.cb
                        })
                        taskCounter()
                        if (popupOpenMethods.enable) {
                            createPopupWindow(`index.html?type=${msg.type}&id=${msg.taskId}`)
                        }
                    }
                }
            } else {
                if (msg.type === 'tx') {
                    Storage.task.setTask(msg.taskId, {
                        tx: msg.tx,
                        type: msg.type,
                        cb: msg.cb,
                        data: msg.data,
                    })
                } else {
                    Storage.task.setTask(msg.taskId, {
                        data: msg.data,
                        type: msg.type,
                        cb: msg.cb
                    })
                }
                if (!requestsMethods[msg.type]) {
                    taskHandler(msg.taskId)
                } else {
                    taskCounter()
                }
                if (ports[msg.cb.url].enabled && popupOpenMethods[msg.type]) {
                    createPopupWindow(`index.html?type=${msg.type}&id=${msg.taskId}`)
                }
            }
        }
    } else {
        // console.log(msg)
    }

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

async function msgPopupHandler(msg, sender) {
    // console.log({msg, sender})
    if (msg.popup) {
        if (msg.type === 'tx') {
            let user = Account
            let buf = ENQWeb.Net.provider
            ENQWeb.Net.provider = user.net
            let wallet = {
                pubkey: user.publicKey,
                prvkey: user.privateKey
            }
            let data = {
                from: wallet,
                to: msg.data.to,
                amount: Number(msg.data.amount) * 1e10,
                tokenHash: user.token
            }
            console.log(ENQWeb.Net.provider)
            // console.log({data})
            let answer = await ENQWeb.Net.post.tx_fee_off(data)
            // console.log(answer)
            ENQWeb.Net.provider = buf
        }
    } else if (msg.lock) {
        Account = {}
        lockAccount()
    } else if (msg.connectionList) {
        ports.popup.postMessage({
            asyncAnswer: true,
            data: msg,
            ports: ports
        })
    } else {
        if (msg.allow && msg.taskId) {
            await taskHandler(msg.taskId)
            taskCounter()
            if (msg.async) {
                ports.popup.postMessage({
                    asyncAnswer: true,
                    data: msg
                })
            }
        } else if (msg.disallow && msg.taskId) {
            // Storage.task.removeTask(msg.taskId)
            await rejectTaskHandler(msg.taskId)
            // console.log('removed')
            taskCounter()
            if (msg.async) {
                ports.popup.postMessage({
                    asyncAnswer: true,
                    data: msg
                })
            }
        } else if (msg.reject_all) {
            let list = Storage.list.loadList()
            for (let i in list) {
                await rejectTaskHandler(list[i])
            }
            // console.log('all request rejected');
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


function listPorts() {
    // console.log(ports)
    global.ports = ports
}

// function disconnectAllPorts() {
//     for (let port in ports) {
//         console.log(port)
//     }
// }
//
// global.disconnectAllPorts = disconnectAllPorts

function disconnectHandler(port) {
    console.log('disconnected: ' + port.name)
    ports[port.name].disconnect()
    delete ports[port.name]
}

function connectController(port) {
    if (ports[port.name]) {
        ports[port.name].disconnect()
        ports[port.name] = port
    } else {
        ports[port.name] = port
    }
}

function disconnectPorts(name) {
    if (!name) {
        for (let key in ports) {
            // console.log(key,ports[key]);
            if (ports[key].name !== 'popup') {
                ports[key].disconnect()
                delete ports[key]
            }
        }
    } else {
        ports[name].disconnect()
        delete ports[name]
    }
    return true
}

global.disconnectPorts = disconnectPorts

function taskCounter() {
    let tasks = Storage.task.loadTask()
    let ids = Object.keys(tasks)
    extensionApi.browserAction.setBadgeText({text: `${ids.length === 0 ? '' : ids.length}`})
}

global.counterTask = taskCounter

async function taskHandler(taskId) {
    let task = Storage.task.getTask(taskId)
    console.log(task)
    let account = ENQWeb.Enq.User
    let data = ''
    let wallet = {
        pubkey: account.publicKey,
        prvkey: account.privateKey
    }
    switch (task.type) {
        case 'enable':
            console.log('enable. returned: ', account)
            data = {
                pubkey: account.publicKey,
                net: account.net,
            }
            try {
                ports[task.cb.url].postMessage({
                    data: JSON.stringify(data),
                    taskId: taskId,
                    cb: task.cb
                })
                ports[task.cb.url].enabled = true
            } catch (e) {
                console.log('connection close')
            }
            Storage.task.removeTask(taskId)
            break
        case 'tx':
            if (ports[task.cb.url].enabled) {
                console.log('tx handler work!')
                data = task.tx
                console.log(data)
                let buf = ENQWeb.Net.provider
                ENQWeb.Net.provider = account.net
                data.from = wallet
                data.amount = data.value ? Number(data.value) : Number(data.amount)
                data.tokenHash = data.ticker ? data.ticker : data.tokenHash
                data.value = ''
                data = await ENQWeb.Net.post.tx_fee_off(data)
                    .catch(err => {
                        console.log(err)
                        return false
                    })
                try {
                    ports[task.cb.url].postMessage({
                        data: JSON.stringify({hash: data.hash ? data.hash : 'Error'}),
                        taskId: taskId,
                        cb: task.cb
                    })
                } catch (e) {
                    console.log('connection close')
                }
                ENQWeb.Net.provider = buf
            }
            Storage.task.removeTask(taskId)
            break
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
                data = await ENQWeb.Net.get.getBalance(wallet.pubkey, data.tokenHash || ENQWeb.Enq.token[ENQWeb.Net.provider])
                    .catch(err => {
                        console.log(err)
                        return false
                    })
                try {
                    ports[task.cb.url].postMessage({
                        data: JSON.stringify(data),
                        taskId: taskId,
                        cb: task.cb
                    })

                } catch (e) {
                    console.log('connection close')
                }
                console.log({
                    data: JSON.stringify(data),
                    taskId: taskId,
                    cb: task.cb
                })
                ENQWeb.Net.provider = buf
            }
            Storage.task.removeTask(taskId)
            break
        case 'getProvider':
            if (ports[task.cb.url].enabled) {
                ENQWeb.Net.provider = account.net
                if (task.cb.fullUrl) {
                    data = {net: ENQWeb.Net.provider}
                } else {
                    data = {net: ENQWeb.Net.currentProvider}
                }
                console.log(data)
                try {
                    ports[task.cb.url].postMessage({
                        data: JSON.stringify(data),
                        taskId: taskId,
                        cb: task.cb
                    })
                } catch (e) {
                    console.log('connection close')
                }
            }
            Storage.task.removeTask(taskId)
            break
        case 'getVersion':
            if (ports[task.cb.url].enabled) {
                console.log('version: ', extensionApi.app.getDetails().version)
                ports[task.cb.url].postMessage({
                    data: JSON.stringify(extensionApi.app.getDetails().version),
                    taskId: taskId,
                    cb: task.cb
                })
            }
            Storage.task.removeTask(taskId)
            break
        case 'sign':
            console.log('sign work')
            if (ports[task.cb.url].enabled) {
                try {
                    ports[task.cb.url].postMessage({
                        data: JSON.stringify(task.result),
                        taskId: taskId,
                        cb: task.cb
                    })
                } catch (e) {
                    console.log('connection close')
                }
            }
            Storage.task.removeTask(taskId)
            break
        default:
            break
    }
    return true
}

function rejectTaskHandler(taskId) {
    let task = Storage.task.getTask(taskId)
    Storage.task.removeTask(taskId)
    let data = {reject: true}
    try {
        ports[task.cb.url].postMessage({
            data: JSON.stringify(data),
            taskId: taskId,
            cb: task.cb
        })
    } catch (e) {
        console.log('connection close')
    }
    return true
}

async function connectHandler(port) {
    await connectController(port)
    switch (port.name) {
        case 'content':
            port.onMessage.addListener(msgConnectHandler)
            break
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
    setTimeout(taskCounter, 1000 * 15)
})
