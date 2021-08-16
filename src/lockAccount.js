import {extensionApi} from './utils/extensionApi'

document.addEventListener('DOMContentLoaded', function () {
    // console.log('lock loaded. status: ', disk.lock.checkLock())
    if (!disk.lock.checkLock() && disk.lock.getHashPassword()) {
        lockAccount()
    }
})

function lockAccount() {
    disk.lock.setLock(true)
    // console.log('account locked')
}

function encryptAccount() {
    let account = disk.user.loadUserNotJson()
    let password = disk.lock.getHashPassword()
    if (password && !disk.lock.checkLock()) {
        password = ENQWeb.Utils.crypto.strengthenPassword('salt*/-+^' + password)
        account = ENQWeb.Utils.crypto.encrypt(account, password)
        disk.user.changeUser(account)
        // console.log('account encrypted')
    } else {
        if (!disk.lock.getHashPassword())
            console.log('password not set')
    }
}

function decryptAccount(password) {
    let hash = ENQWeb.Utils.crypto.strengthenPassword('salt*/-+^' + password)
    if (disk.lock.unlock(hash)) {
        hash = ENQWeb.Utils.crypto.strengthenPassword('salt*/-+^' + hash)
        // console.log(hash)
        // console.log(ENQWeb.Utils.crypto.decrypt(disk.user.loadUserNotJson(), hash))
        return JSON.parse(ENQWeb.Utils.crypto.decrypt(disk.user.loadUserNotJson(), hash))
    } else {
        return false
    }
}

global.lockAccount = function () {
    return lockAccount()
}

global.encryptAccount = function () {
    return encryptAccount()
}

global.decryptAccount = function (password) {
    return decryptAccount(password)
}

export {lockAccount, encryptAccount, decryptAccount}
function say(){
    console.log("hello")
}

export {say}
