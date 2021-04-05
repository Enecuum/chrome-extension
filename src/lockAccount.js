document.addEventListener('DOMContentLoaded', function (){
    console.log('lock loaded. status: ', disk.lock.checkLock())
    window.onunload = function (){
        if(!disk.lock.checkLock() && disk.lock.getHashPassword()){
            lockAccount()
        }
    }
})

function lockAccount() {
    let account = disk.user.loadUserNotJson()
    let password = disk.lock.getHashPassword()
    if (password && !disk.lock.checkLock()) {
        password = ENQWeb.Utils.crypto.strengthenPassword('salt*/-+^' + password)
        disk.lock.setLock(true)
        account = ENQWeb.Utils.crypto.encrypt(account, password)
        disk.user.changeUser(account)
        console.log('account locked')
    } else {
        if(!disk.lock.getHashPassword())
            console.log('password not set')
    }
}

global.lockAccount = function (){
    return lockAccount()
}
