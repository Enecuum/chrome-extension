let lockTime = 10 * 60 * 1000

// let lockTime = 10 * 1000

let SALT = 'salt*/-+^'

function lockAccount(timer = false) {
    userStorage.lock.setLock(true)
    if (userStorage.name === 'background') {

        // Only publicKey and net left
        ENQWeb.Enq.User = { publicKey: ENQWeb.Enq.User.publicKey, net: ENQWeb.Enq.User.net }
    }

    if (timer)
        location.reload()

    const accountLockedString = 'Account locked'
    console.log(accountLockedString)
}

function encryptAccount() {

    let account = userStorage.user.loadUserNotJson()

    // TODO HERE {}
    // console.log(account)

    let password = userStorage.lock.getHashPassword()
    if (password && !userStorage.lock.checkLock()) {

        password = ENQWeb.Utils.crypto.strengthenPassword(SALT + password)
        account = ENQWeb.Utils.crypto.encrypt(account, password)
        userStorage.user.changeUser(account)

        const encryptedString = 'Account encrypted'
        console.log(encryptedString)

    } else {

        if (!userStorage.lock.getHashPassword()) {

            const passwordString = 'Password not set'
            console.log(passwordString)
        }
    }
}

function encryptAccountWithPass(account, password) {
    if (password && !userStorage.lock.checkLock()) {
        password = ENQWeb.Utils.crypto.strengthenPassword(SALT + password)
        account = ENQWeb.Utils.crypto.encrypt(account, password)
        userStorage.user.changeUser(account)
        // console.log('account encrypted')
    }
}

function decryptAccount(password) {
    let hash = ENQWeb.Utils.crypto.strengthenPassword(SALT + password)
    if (userStorage.lock.unlock(hash)) {
        hash = ENQWeb.Utils.crypto.strengthenPassword(SALT + hash)
        // console.log(hash)
        // console.log(userStorage.user.loadUserNotJson())
        let accountString = ENQWeb.Utils.crypto.decrypt(userStorage.user.loadUserNotJson(), hash)
        // console.log(accountString)
        let account = JSON.parse(accountString)
        // console.log(account)
        return account
    } else {
        return false
    }
}

export {lockAccount, encryptAccount, decryptAccount, encryptAccountWithPass, lockTime}

function say() {
    let lockString = 'Lock account loaded! background started'
    console.log(lockString)
}

export {say}
