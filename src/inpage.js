
let hello = function (){
    console.log('hello from Enecuum ext')
}
let click = function (){

}

var ext_api =  {
        hello: hello,
        click:click,
        task:'',
}

function checkLib(){
    if(ENQWeb){
        console.log('Enecuum lib connected!')
        global.ENQExt = ext_api
    }else{
        console.error('not found ENQ Web lib.')
    }
}

async function setupInpageApi() {

}

document.addEventListener('DOMContentLoaded', ()=>{
    checkLib()
    setupInpageApi()
});