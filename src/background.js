const storage = require('./utils/localStorage')
let Storage = new storage()
global.disk = Storage

let user = {
    genesis:{
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
    Eva:{
        prvkey:
            '3f7c8d236678d45c4437b33d9206dc7626e4c61dc644ca02350ec80e9c908fdd',
        pubkey:
            '02b41309909a0c401c38e2dd734a6d7f13733d8c5bfa68639047b189fb78e0855d' }
}
global.users = user
var ports = {}

function setupApp() {
    console.log('background ready')
    chrome.runtime.onMessage.addListener(msgHandler)
    chrome.runtime.onConnect.addListener(connectHandler)
}

async function msgHandler(msg,sender, sendResponse){
    console.log(msg)
}

async function msgConnectHandler(msg,sender){
    console.log(msg)
    let answer = ''
    if(msg.taskId){
        // console.log(msg.taskId)
        // sender.postMessage({msg:'all work', taskId:msg.taskId, data:'qqq'})
        switch (msg.type){
            case 'enable':
                sender.postMessage({data:user.Alice.pubkey,taskId:msg.taskId, cb:msg.cb})
                break
            case 'balanceOf':
                ENQWeb.Enq.provider = 'http://95.216.207.173'
                answer = await ENQWeb.Net.get.getBalance(msg.data.address, msg.data.token)
                sender.postMessage({data:answer.amount,taskId:msg.taskId,cb:msg.cb})
                break
            case 'tx':
                ENQWeb.Enq.provider = 'http://95.216.207.173'
                ENQWeb.Enq.User = user.genesis
                ENQWeb.Net.post.tx(user.genesis,msg.data.address,ENQWeb.Enq.ticker,msg.data.amount, '', msg.data.token).then(answer=>{
                    console.log(answer)
                    sender.postMessage({data:answer.hash,taskId:msg.taskId,cb:msg.cb})
                }).catch(err=>{
                    console.log(err)
                }) //TODO catch errors
                break
            default:
                break
        }
        Storage.task.setTask(msg.taskId, {data:msg.data, type:msg.type, cb:msg.cb})
    }else{
        console.log(msg)
    }
}

function msgPopupHandler(msg, sender){
    console.log(msg)
    if(msg.agree){
        taskHandler(msg.taskId)
    }else{
        Storage.task.removeTask(msg.taskId)
        console.log('removed')
    }
}

function listPorts(){
    console.log(ports)
    global.ports = ports
}
function disconnectHandler(port){
    console.log('disconnected: ' + port.name)
}
function connectController(port){
    if(ports[port.name]){
        ports[port.name].disconnect()
        ports[port.name] = port
    }else{
        ports[port.name] = port
    }
}

function taskHandler(taskId){
    let task = Storage.task.getTask(taskId)
    console.log(task)
    let acc = Storage.mainAcc.get()
    switch(task.type){
        case 'enable':
            if(typeof acc){
                console.log('enable. returned: ', acc)
                // ports.content.postMessage();
            }
            break
        case 'tx':
            console.log()
            if(typeof acc){
                console.log('tx, returned ', acc)

                // ports.content.postMessage()
            }
            break
        case 'balanceOf':
            console.log()
            break
        default:
            break
    }
}

//TODO add cleaner connection list
async function connectHandler(port){
    await connectController(port)
    switch (port.name){
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