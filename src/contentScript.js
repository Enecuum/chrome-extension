import {extensionApi} from "./utils/extensionApi";


let toBackground = {}
let pageToBack = {}
let taskId = []
let requests = {
    'tx': transaction,
    'balanceOf': balanceOf,
    'enable': enable,
    'getProvider': enable,
    'getVersion': enable,
    'sign': enable,
    'reconnect': enable
}

function setupConnection() {
    console.log('content ready')
    // chrome.runtime.sendMessage({greeting: "Content ready"}, function(response) {});
    toBackground = extensionApi.runtime.connect({name: window.origin})
    toBackground.onMessage.addListener((msg, sender, sendResponse) => {
        let cb = taskId[msg.taskId]
        if (cb) {
            cb(msg)
            delete taskId[msg.taskId]
            return
        }
    })
}

// TODO
function injectScript() {
    try {
        // inject in-page script
        let script = document.createElement('script');
        script.src = extensionApi.extension.getURL('inpage.js');
        const container = document.head || document.documentElement;
        container.insertBefore(script, container.children[0]);
        // (document.head || document.documentElement).appendChild(script)
        script.onload = () => script.remove();
    } catch (e) {
        console.error('Injection failed.', e);
    }
}

function eventContent(e) {
    let address = e.detail.cb.taskId
    taskId[address] = requests[e.detail.type]
    if (e.detail.type === 'tx')
        toBackground.postMessage({
            type: e.detail.type,
            tx: e.detail.tx,
            taskId: address,
            cb: e.detail.cb,
            data: e.detail.data
        })
    else
        toBackground.postMessage({type: e.detail.type, data: e.detail.data, taskId: address, cb: e.detail.cb})
    document.addEventListener('ENQContent', (e) => {
        eventContent(e)
    }, {once: true})
}


function eventConnect() {
    if (typeof toBackground.disconnect === typeof (Function)) {
        console.log(toBackground)
        toBackground.disconnect()
    }
    setupConnection()
    document.addEventListener('ENQContent', (e) => {
        eventContent(e)
    }, {once: true})
    // document.addEventListener('ENQConnect', eventConnect, {once: true})
}

async function eventHandler() {
    document.addEventListener('ENQConnect', eventConnect, {once: true})
}

function enable(msg) {
    injectCb(injectCodeGeneration(msg))
}

function balanceOf(msg) {
    injectCb(injectCodeGeneration(msg))
}

function transaction(msg) {
    injectCb(injectCodeGeneration(msg))
}

//TODO check error in msg
function injectCodeGeneration(msg) {
    let code = ''
    if (msg.cb) {
        code = `
        ENQWeb.Enq.cb['${msg.cb.taskId}'] = ${msg.data}
        ENQWeb.Enq.ready['${msg.cb.taskId}'] = true
        `
    }
    return code
}

function injectCb(code) {
    let script = document.createElement('script');
    script.textContent = code;
    (document.head || document.documentElement).appendChild(script);
    script.remove();
}

function autoConnect() {
    let script = `
    try {
        ENQWeb.Enq.ready["extConnect"] = true
    } catch(e){}
    `
    injectCb(script)
}

// setupConnection();
// injectScript();
eventHandler().then(r => {})

document.addEventListener('DOMContentLoaded', function () {
    autoConnect()
})
