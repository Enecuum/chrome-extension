import {extensionApi} from "./utils/extensionApi";


let toBackground = {}
let pageToBack = {}
let taskId = []


function setupConnection() {
    console.log('content ready')

    // chrome.runtime.sendMessage({greeting: "Content ready"}, function(response) {});
    toBackground = extensionApi.runtime.connect({name: 'content'})
    toBackground.onMessage.addListener((msg, sender, sendResponse) => {
        let cb = taskId[msg.taskId]
        if (cb) {
            cb(msg)
            delete taskId[msg.taskId]
            return
        }
        console.log(msg)
    })

}


function injectScript(){
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

async function eventHandler() {
    document.addEventListener('ENQConnect', (e) => {
        setupConnection()
        document.addEventListener('ENQContent', (e) => {
            let address = Math.random().toString(36)
            switch (e.detail.type) {
                case 'enable':
                    taskId[address] = enable
                    break
                case 'balanceOf':
                    taskId[address] = balanceOf
                    break
                case 'tx':
                    taskId[address] = transaction
                    break
                default:
                    break
            }
            toBackground.postMessage({type: e.detail.type, data: e.detail.data, taskId: address, cb: e.detail.cb})
        })
    })
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
    if (msg.cb.cb) {
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

// setupConnection();
    injectScript();
    eventHandler()