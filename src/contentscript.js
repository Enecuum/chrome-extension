import {extensionApi} from "./utils/extensionApi";

var toBackground = {}
var taskId = []

function setupConnection(){
    console.log('content ready')
    // chrome.runtime.sendMessage({greeting: "Content ready"}, function(response) {});
    toBackground = chrome.runtime.connect({name:'content'})
    toBackground.onMessage.addListener((msg,sender, sendResponse)=>{
        var cb = taskId[msg.taskId]
        if(cb){
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
        script.onload = () => script.remove();
    } catch (e) {
        console.error('Injection failed.', e);
    }
}

async function eventHandler() {
    document.addEventListener('ENQContent', (e)=>{
        let address = Math.random().toString(36)
        switch (e.detail.type){
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
        toBackground.postMessage({type:e.detail.type,data:e.detail.data, taskId:address, cb:e.detail.cb})
    })

}

function enable(msg){
    injectCb(injectCodeGeneration(msg))
}
function balanceOf(msg){
    injectCb(injectCodeGeneration(msg))
}
function transaction(msg){
    injectCb(injectCodeGeneration(msg))
}

//TODO check error in msg
function injectCodeGeneration(msg){
    var code = ''
    if(msg.cb){
        if(msg.cb.inText && msg.cb.id){
            code = `
        document.getElementById('${msg.cb.id}').innerText = "${msg.data}"
        `
        }
        else if(msg.cb.inDoc && msg.cb.id){
            code=`
            document.${msg.cb.id} = "${msg.data}"
            `
        }
        else if(msg.cb.inWin && msg.cb.id){
            code=`
            window.${msg.cb.id} = "${msg.data}"
            `
        }
        else if(msg.cb.inSite && msg.cb.id){
            code=`
            ${msg.cb.id}="${msg.data}"
            `
        }
        else{
            code = `
        document.getElementById('${msg.cb}').setAttribute('ENQ', '${msg.data}')
        `
        }
    }else{
        code = `
        ENQWeb.Enq.cb = "${msg.data}"
        `
    }
    return code
}

function injectCb(code){
    var script = document.createElement('script');
    script.textContent = code;
    (document.head||document.documentElement).appendChild(script);
    script.remove();
}

setupConnection();
injectScript();
eventHandler()


