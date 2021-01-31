const Storage = require('../utils/localStorage')

var Content = function Content(port){
    let storage= new Storage()
    function syncTask(){
        let task = storage.task.loadTask()
        let taskId = Object.keys(task)
        if(taskId.length>0){
            let html = ``
            for(let i = 0; i< taskId.length; i++){
                html += `
                <div class="" >
                    <h5 taskId='${taskId[i]}'>type: ${task[taskId[i]].type}; id: ${taskId[i]}</h5>
                    <button taskId='${taskId[i]}' taskApply="true">agree</button>
                    <button taskId='${taskId[i]}' taskApply="false">degree</button>
                </div>
                `
            }
            $('#body').html(html)
        }
    }
    function syncAcc(){
        let accs = storage.user.loadUser()
        let names = Object.keys(accs)
        if(names.length === 0 ){

        }else{
            let html = ``
            for(let i = 0; i<names.length; i++){
                html+=`
                <div class="">
                    <h5>name: ${names[i]}</h5>
                    <h5>net: ${accs[names[i]].net}</h5>
                    <h5>pub: ${accs[names[i]].pubkey}</h5>
                </div>
                `
            }
            $('#header').html(html)
        }
    }
    function eventHandler(){
        $('body').on('click', "[taskId]",function(){
            console.log('click task ', $(this).attr('taskId'))
            let task = $(this).attr('taskId')
            if($(this).attr('taskApply') === 'true'){
                port.postMessage({taskId:task, agree:true})
            }else {
                port.postMessage({taskId:task, agree:false})
            }
        })
    }
    function addAcc(){}
    this.init = function(){
        syncAcc()
        syncTask()
        eventHandler()
    }
    this.addAcc = addAcc()
}

module.exports = Content
