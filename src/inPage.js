let ext_api = {}

function checkLib() {
    if (typeof ENQWeb !== "undefined") {
        console.log('Enecuum lib connected!')
        global.ENQExt = ext_api
        // let event = new CustomEvent('ENQConnect',{})
        // document.dispatchEvent(event)
    } else {
        console.log('not found ENQ Web lib.')
    }
}

async function setupInPageApi() {

}

document.addEventListener('DOMContentLoaded', () => {
    checkLib()
    // setupInPageApi().then()
});