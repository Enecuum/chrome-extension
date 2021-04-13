const storage = require('./utils/localStorage')
import {extensionApi} from './utils/extensionApi'

let Storage = new storage('background')
global.disk = Storage

let ports = {}
let requests = {
    'tx': true,
    'enable': true,
    "balanceOf": false,
    'getProvider': false
}

let Account = {}

function setupApp() {
    console.log('background ready')
    extensionApi.runtime.onMessage.addListener(msgHandler)
    extensionApi.runtime.onConnect.addListener(connectHandler)
    taskCounter()
}

async function msgHandler(msg, sender, sendResponse) {
    console.log(msg)
    if(msg.account && msg.request){
        if(!disk.lock.checkLock())
            sendResponse({response:Account})
        else
            sendResponse({response:false})
    }
    if(msg.account && msg.unlock && msg.password){
        let acc = decryptAccount(msg.password)
        if(acc){
            Account = acc
            sendResponse({response:true})
        }else{
            sendResponse({response:false})
        }
    }
    if(msg.account && msg.set && msg.data){
        Account = msg.data
        disk.user.addUser(msg.data.publicKey, msg.data.privateKey, msg.data.net)
        sendResponse({response:Account})
    }
    if(msg.account && msg.encrypt){
        if(msg.again){
            disk.user.addUser(Account.publicKey, Account.privateKey, Account.net)
            encryptAccount()
        }else{
            encryptAccount()
        }
        sendResponse({response:true})
    }
    if(msg.account && msg.logout){
        Account = {}
    }
}

async function msgConnectHandler(msg, sender) {
    console.log(msg)
    let answer = ''
    if (msg.taskId) {
        let acc = disk.user.loadUser()
        let lock = disk.lock.checkLock()
        if (!acc.net && !lock) {
            console.log('non auth')
            rejectTaskHandler(msg.taskId)
        } else {
            // console.log('auth ok',{acc,lock})
            if (!ports[msg.cb.url].enabled) {
                if (msg.type === 'enable') {
                    Storage.task.setTask(msg.taskId, {data: msg.data, type: msg.type, cb: msg.cb})
                    taskCounter()
                    // chrome.windows.create({url: 'popup.html', width: 350, height: 630, type: "popup"})
                }
            } else {
                if (msg.type === 'tx') {
                    Storage.task.setTask(msg.taskId, {
                        tx: msg.tx,
                        type: msg.type,
                        cb: msg.cb,
                        net: msg.net,
                        hash: msg.txHash
                    })
                } else {
                    Storage.task.setTask(msg.taskId, {data: msg.data, type: msg.type, cb: msg.cb})
                }
                if (!requests[msg.type]) {
                    taskHandler(msg.taskId)
                } else {
                    taskCounter()
                }
            }
        }
    } else {
        console.log(msg)
    }

}

async function msgPopupHandler(msg, sender) {
    console.log({msg, sender})
    if (msg.popup) {
        if (msg.type === 'tx') {
            let user = Storage.user.loadUser()
            let buf = ENQWeb.Net.provider
            ENQWeb.Net.provider = user.net
            let wallet = {pubkey: user.publicKey, prvkey: user.privateKey}
            let data = {
                from: wallet,
                to: msg.data.to,
                amount: Number(msg.data.amount) * 1e10
            }
            console.log(ENQWeb.Net.provider)
            console.log({data})
            let answer = await ENQWeb.Net.post.tx_fee_off(data)
            console.log(answer)
            ENQWeb.Net.provider = buf
        }
    } else if (msg.lock) {
        Account = {}
        lockAccount()
    } else if (msg.connectionList) {
        ports.popup.postMessage({asyncAnswer: true, data: msg, ports: ports})
    } else {
        if (msg.allow && msg.taskId) {
            await taskHandler(msg.taskId)
            taskCounter()
            if (msg.async) {
                ports.popup.postMessage({asyncAnswer: true, data: msg})
            }
        } else if (msg.disallow && msg.taskId) {
            // Storage.task.removeTask(msg.taskId)
            await rejectTaskHandler(msg.taskId)
            console.log('removed')
            taskCounter()
            if (msg.async) {
                ports.popup.postMessage({asyncAnswer: true, data: msg})
            }
        } else if (msg.reject_all) {
            let list = Storage.list.loadList()
            for (let i in list) {
                await rejectTaskHandler(list[i])
            }
            console.log('all request rejected');
            taskCounter()
            if (msg.async) {
                ports.popup.postMessage({asyncAnswer: true, data: msg})
            }
        } else {
            console.log(msg)
        }
    }
}


function listPorts() {
    console.log(ports)
    global.ports = ports
}

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

function taskCounter() {
    let tasks = Storage.task.loadTask()
    let ids = Object.keys(tasks)
    extensionApi.browserAction.setBadgeText({text: `${ids.length === 0 ? '' : ids.length}`})
}

global.counterTask = taskCounter

async function taskHandler(taskId) {
    let task = Storage.task.getTask(taskId)
    console.log(task)
    let acc = Storage.user.loadUser()
    let data = '';
    let wallet = {pubkey: acc.publicKey, prvkey: acc.privateKey};
    switch (task.type) {
        case 'enable':
            console.log('enable. returned: ', acc)
            data = {
                pubkey: acc.publicKey,
                net: acc.net,
            }
            try {
                ports[task.cb.url].postMessage({data: JSON.stringify(data), taskId: taskId, cb: task.cb});
                ports[task.cb.url].enabled = true
            } catch (e) {
                console.log('connection close');
            }
            Storage.task.removeTask(taskId)
            break
        case 'tx':
            if (ports[task.cb.url].enabled) {
                console.log('tx handler work!')
                data = task.data
                let buf = ENQWeb.Net.provider
                ENQWeb.Net.provider = acc.net
                data.from = wallet
                data.amount = Number(data.value)
                data.value = ''
                data = await ENQWeb.Net.post.tx_fee_off(data).catch(err => {
                    console.log(err)
                    return false
                })
                try {
                    ports[task.cb.url].postMessage({data: JSON.stringify(data), taskId: taskId, cb: task.cb})
                } catch (e) {
                    console.log('connection close');
                }
                ENQWeb.Net.provider = buf
            }
            Storage.task.removeTask(taskId)
            break
        case 'balanceOf':
            console.log('balanceOf handler work!')
            if (ports[task.cb.url].enabled) {
                data = task.data
                console.log(acc)
                ENQWeb.Net.provider = data.net || acc.net
                console.log(task.data, ENQWeb.Net.provider)
                data = await ENQWeb.Net.get.getBalance(wallet.pubkey, data.tokenHash || ENQWeb.Enq.token[ENQWeb.Net.provider])
                    .catch(err => {
                        console.log(err)
                        return false
                    })
                try {
                    ports[task.cb.url].postMessage({data: JSON.stringify(data), taskId: taskId, cb: task.cb})

                } catch (e) {
                    console.log('connection close');
                }
                console.log({data: JSON.stringify(data), taskId: taskId, cb: task.cb})
            }
            Storage.task.removeTask(taskId)
            break
        case 'getProvider':
            if (ports[task.cb.url].enabled) {
                ENQWeb.Net.provider = acc.net
                if (task.cb.fullUrl) {
                    data = {net: ENQWeb.Net.provider}
                } else {
                    data = {net: ENQWeb.Net.currentProvider}
                }
                console.log(data);
                try {
                    ports[task.cb.url].postMessage({data: JSON.stringify(data), taskId: taskId, cb: task.cb})
                } catch (e) {
                    console.log('connection close');
                }
            }
            Storage.task.removeTask(taskId)
            break;
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
        ports[task.cb.url].postMessage({data: JSON.stringify(data), taskId: taskId, cb: task.cb})
    } catch (e) {
        console.log('connection close');
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
    setupApp();
    setTimeout(taskCounter, 1000 * 15)
})