let ext_api = {}

function checkLib() {

    global.ENQExt = ext_api
    if (typeof ENQWeb !== "undefined" || typeof ENQweb3lib !== "undefined") {
        console.log('Enecuum lib connected!')
        global.ENQExt = ext_api
    } else {
        // console.log('Not found Enecuum Web lib.')
    }
}

async function setupInPageApi() {

}

document.addEventListener('DOMContentLoaded', () => {
    checkLib()
    // setupInPageApi().then()
});
