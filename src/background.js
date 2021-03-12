const storage = require('./utils/localStorage')
import {extensionApi} from './utils/extensionApi'

let Storage = new storage()
global.disk = Storage

let ports = {}
let requests = {
    'tx': true,
    'enable': true,
    "balanceOf": false,
    'getProvider': false
}

function setupApp() {
    console.log('background ready')
    extensionApi.runtime.onMessage.addListener(msgHandler)
    extensionApi.runtime.onConnect.addListener(connectHandler)
    taskCounter()
}

async function msgHandler(msg, sender, sendResponse) {
    console.log(msg)
}

async function msgConnectHandler(msg, sender) {
    console.log(msg)
    let answer = ''
    if (msg.taskId) {
        Storage.task.setTask(msg.taskId, {data: msg.data, type: msg.type, cb: msg.cb})
        if (!requests[msg.type]) {
            taskHandler(msg.taskId)
        } else {
            taskCounter()
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
    } else {
        if (msg.allow && msg.taskId) {
            taskHandler(msg.taskId)
            taskCounter()
            if (msg.async) {
                ports.popup.postMessage({asyncAnswer: true, data: msg})
            }
        } else if (msg.disallow && msg.taskId) {
            // Storage.task.removeTask(msg.taskId)
            rejectTaskHandler(msg.taskId)
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
                ports.content.postMessage({data: JSON.stringify(data), taskId: taskId, cb: task.cb});
            } catch (e) {
                console.log('connection close');
            }
            Storage.task.removeTask(taskId)
            break
        case 'tx':
            console.log('tx handler work!')
            data = task.data
            let buf = ENQWeb.Net.provider
            ENQWeb.Net.provider = data.net || acc.net
            data.from = wallet
            data.amount = Number(data.value)
            data.value = ''
            data = await ENQWeb.Net.post.tx_fee_off(data)
            try {
                ports.content.postMessage({data: JSON.stringify(data), taskId: taskId, cb: task.cb})
            } catch (e) {
                console.log('connection close');
            }
            Storage.task.removeTask(taskId)
            ENQWeb.Net.provider = buf
            break
        case 'balanceOf':
            console.log('balanceOf handler work!')
            data = task.data
            console.log(acc)
            ENQWeb.Net.provider = data.net || acc.net
            console.log(task.data, ENQWeb.Net.provider)
            data = await ENQWeb.Net.get.getBalance(wallet.pubkey, data.tokenHash || ENQWeb.Enq.token[ENQWeb.Net.provider])
                .catch(err => {
                    console.log(err)
                })
            try {
                ports.content.postMessage({data: JSON.stringify(data), taskId: taskId, cb: task.cb})

            } catch (e) {
                console.log('connection close');
            }
            console.log({data: JSON.stringify(data), taskId: taskId, cb: task.cb})
            Storage.task.removeTask(taskId)
            break
        case 'getProvider':
            data = {net: acc.net}
            console.log(data);
            try {
                ports.content.postMessage({data: JSON.stringify(data), taskId: taskId, cb: task.cb})
            } catch (e) {
                console.log('connection close');
            }
            Storage.task.removeTask(taskId)
            break;
        default:
            break
    }
}

function rejectTaskHandler(taskId) {
    let task = Storage.task.getTask(taskId)
    Storage.task.removeTask(taskId)
    let data = {reject: true}
    try {
        ports.content.postMessage({data: JSON.stringify(data), taskId: taskId, cb: task.cb})
    } catch (e) {
        console.log('connection close');
    }
}

//TODO add cleaner connection list
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
            break
    }
    listPorts()
}

setupApp();
setTimeout(taskCounter, 1000 * 15)
