const storage = require('./utils/localStorage')
import {extensionApi} from "./utils/extensionApi"

let Storage = new storage()
global.disk = Storage

let user = {
    genesis: {
        pubkey:
            "029dd222eeddd5c3340e8d46ae0a22e2c8e301bfee4903bcf8c899766c8ceb3a7d",
        prvkey:
            "9d3ce1f3ec99c26c2e64e06d775a52578b00982bf1748e2e2972f7373644ac5c"
    },
    Alice:
        {
            prvkey:
                '33d23ca7d306026eaa68d8864dd3871584ed15cc20803077bea71831ee5492cc',
            pubkey:
                '0228333b99a4d1312f31851dad1c32b530d5ee61534951ebe650c66390fdcffe98'
        },
    Bob:
        {
            prvkey:
                '677b5c0340c1cf1cac4358a517fcf1032c8010e797f2ca87728e29ca638b5914',
            pubkey:
                '030b13a13272b663da33468929110c7505f700b955e1aee754cce17d66a3fde200'
        },
    Eva: {
        prvkey:
            '3f7c8d236678d45c4437b33d9206dc7626e4c61dc644ca02350ec80e9c908fdd',
        pubkey:
            '02b41309909a0c401c38e2dd734a6d7f13733d8c5bfa68639047b189fb78e0855d'
    }
}
global.users = user
let ports = {}

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
        if (msg.type === 'balanceOf') {
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
        if (msg.agree && msg.taskId) {
            taskHandler(msg.taskId)
            taskCounter()
        } else {
            if (msg.taskId) {
                // Storage.task.removeTask(msg.taskId)
                rejectTaskHandler(msg.taskId)
                console.log('removed')
                taskCounter()
            }
        }
    }
}


function listPorts() {
    console.log(ports)
    global.ports = ports
}

function disconnectHandler(port) {
    console.log('disconnected: ' + port.name)
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
    extensionApi.browserAction.setBadgeText({text: `${ids.length}`})
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
            ports.content.postMessage({data: JSON.stringify(data), taskId: taskId, cb: task.cb});
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
            ports.content.postMessage({data: JSON.stringify(data), taskId: taskId, cb: task.cb})
            Storage.task.removeTask(taskId)
            ENQWeb.Net.provider = buf
            break
        case 'balanceOf':
            console.log(' balanceOf handler work!')
            data = task.data
            ENQWeb.Net.provider = data.net || acc.net
            console.log(task.data, ENQWeb.Net.provider)
            data = await ENQWeb.Net.get.getBalance(wallet.pubkey, data.tokenHash)
                .catch(err => {
                    console.log(err)
                })
            ports.content.postMessage({data: JSON.stringify(data), taskId: taskId, cb: task.cb})
            console.log({data: JSON.stringify(data), taskId: taskId, cb: task.cb})
            Storage.task.removeTask(taskId)
            break
        default:
            break
    }
}

function rejectTaskHandler(taskId) {
    let task = Storage.task.getTask(taskId)
    let data = {reject: true}
    ports.content.postMessage({data: JSON.stringify(data), taskId: taskId, cb: task.cb})
    Storage.task.removeTask(taskId)
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