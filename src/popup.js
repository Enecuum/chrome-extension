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
    // await initApp(background)
}

function msgHandler(msg, sender){
    console.log(msg)
    console.log(sender)
}

setupUi()