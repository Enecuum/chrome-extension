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
                    <h5>type: ${task[taskId[i]].type}; id: ${taskId[i]}</h5>
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
            html = addBlock()
            $('#header').html(html)
        }else{
            let html = ``
            html += addBtn()
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
    function addBlock(){
        let html = `<div className="container">
            <div className="">
                <input type="text" id="accName" placeholder="acc Name">
            </div>
            <div className="">
                <input type="text" id="pvtkey" placeholder="private key">
            </div>
            <div className="">
                <select name="net" id="net">
                    <option value="https://pulse.enecuum.com">pulse</option>
                    <option value="https://bit.enecuum.com">bit</option>
                    <option value="http://95.216.207.173">f3</option>
                </select>
            </div>
            <div className="">
                <button addAccBtn className="btn success">add</button>
                <button addAccBtnCnl className="btn success">Cancel</button>
            </div>
        </div>`
        return html
    }

    function addBtn(){
        let html = `<div>
                    <button addBtn class="success">add Acc</button>
                </div>   `
        return html
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
            syncTask()
        })
        $('body').on('click', "[addAccBtn]", function (){
            console.log('add ', $('#pvtkey').val())
            let name = $('#accName').val()
            let pvtkey = $('#pvtkey').val()
            let pubkey = ENQWeb.Utils.Sign.getPublicKey(pvtkey, true)
            let net = $('select[name=net]').val()
            console.log(name, pubkey, pvtkey, net)
            storage.user.addUser(name, pubkey, pvtkey,net)
            storage.mainAcc.set(name)
            syncAcc()
        })
        $('body').on('click', '[addBtn]', function (){
            let html = addBlock()
            $('#header').html(html)
        })
        $('body').on('click', '[addAccBtnCnl]', function (){
            syncAcc()
        })
    }

    this.init = function(){
        syncAcc()
        syncTask()
        eventHandler()
    }
}

module.exports = Content