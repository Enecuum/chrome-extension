const content = require('./ui/content')
const UI = require('./ui')
import {initApp} from "./ui/index";

var toBackground = {};
var taskId = []
async function setupUi() {
    toBackground = chrome.runtime.connect({name:'popup'})
    toBackground.onMessage.addListener((msg,sender, sendResponse)=>{
        var cb = taskId[msg.taskId]
        if(cb){
            cb(msg)
            delete taskId[msg.taskId]
            return
        }
        msgHandler(msg, sender)
    })
    global.Port = toBackground

    // Запуск интерфейса
    let Content = new content(toBackground)
    // document.addEventListener('DOMContentLoaded',Content.init)
    global.Content = Content
    await initApp()
}

function msgHandler(msg, sender){
    console.log(msg)
    console.log(sender)
}
document.addEventListener('DOMContentLoaded', ()=>{
    setupUi()
})

