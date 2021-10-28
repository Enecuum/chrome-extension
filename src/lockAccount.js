let lockTime = 10 * 60 * 1000
// let lockTime = 10 * 1000

function lockAccount() {
    disk.lock.setLock(true)
    if (disk.name === 'background') {
        ENQWeb.Enq.User = {publicKey: ENQWeb.Enq.User.publicKey, net: ENQWeb.Enq.User.net}
    }
    location.reload()
    console.log('account locked')
}

function encryptAccount() {
    let account = disk.user.loadUserNotJson()
    //TODO HERE {}
    // console.log(account)
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
        // console.log(disk.user.loadUserNotJson())
        let accountString = ENQWeb.Utils.crypto.decrypt(disk.user.loadUserNotJson(), hash)
        // console.log(accountString)
        let account = JSON.parse(accountString)
        // console.log(account)
        return account
    } else {
        return false
    }
}

export {lockAccount, encryptAccount, decryptAccount, lockTime}

function say() {
    console.log("lock account loaded! background started")
}

export {say}
