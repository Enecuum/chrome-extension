// TODO We have to renew timer every event
// TODO

let lockTime = 10 * 60 * 1000 * 6 * 100 // 100 hours
import eventBus from './utils/eventBus'

// let lockTime = 60 * 1000 // 60 sec

console.log('Lock time: ' + (lockTime / 1000) + ' sec.')

// let lockTime = 10 * 1000

let SALT = 'salt*/-+^'
let PASSWORD = SALT

function lockAccount(timer = false) {

    // LOCK > {lock: true}
    userStorage.lock.setLock(true)

    // if (userStorage.name === 'background') {
    //
    //     // Only publicKey and net left
    //     ENQWeb.Enq.User = { publicKey: ENQWeb.Enq.User.publicKey, net: ENQWeb.Enq.User.net }
    // }

    eventBus.dispatch('lock', { message: true })

    // {publicKey, net}
    ENQWeb.Enq.User = {
        publicKey: ENQWeb.Enq.User.publicKey,
        net: ENQWeb.Enq.User.net
    }

    const accountLockedString = 'Account locked'
    console.log(accountLockedString)

    // if (timer)
    //     location.reload()
}

//
function encryptAccount() {

    let account = userStorage.user.loadUserNotJson()

    // TODO HERE {}
    // console.log(account)

    let password = userStorage.lock.getHashPassword()
    if (password && !userStorage.lock.checkLock()) {

        password = ENQWeb.Utils.crypto.strengthenPassword(SALT + password)
        account = ENQWeb.Utils.crypto.encrypt(account, password)
        userStorage.user.changeUser(account)

        const accountEncryptedString = 'Account encrypted'
        console.log(accountEncryptedString)

    } else {

        if (!userStorage.lock.getHashPassword()) {

            const passwordString = 'Password not set'
            console.log(passwordString)
        }
    }
}

function encryptAccountWithPass(account = false, password = false) {
    // let account = userStorage.user.loadUserNotJson()
    if (password) {
        console.log('password install')
        PASSWORD = password
    }
    if (PASSWORD.length > 0 && !userStorage.lock.checkLock() && account) {
        let password = ENQWeb.Utils.crypto.strengthenPassword(SALT + PASSWORD)
        password = ENQWeb.Utils.crypto.strengthenPassword(SALT + password)
        account = ENQWeb.Utils.crypto.encrypt(JSON.stringify(account), password)
        userStorage.user.addUser(account)
        // console.log('account encrypted')
        return true
    } else {
        return false
    }
}

function decryptAccount(password) {
    let hash = ENQWeb.Utils.crypto.strengthenPassword(SALT + password)
    hash = ENQWeb.Utils.crypto.strengthenPassword(SALT + hash)
    let userData = userStorage.user.loadUserNotJson()

    if (!userData) {
        return false
    }
    try {
        try {
            userData = JSON.parse(userData)
        } catch (e) {
            console.log('old algorithm')
        }
        let accountString = ENQWeb.Utils.crypto.decrypt(userData, hash)
        // console.log(accountString)
        let account = JSON.parse(accountString)
        // console.log(account)
        PASSWORD = password
        userStorage.lock.setLock(false)
        return account
    } catch (e) {
        console.warn('Wrong password')
        return false
    }


}

export { lockAccount, encryptAccount, decryptAccount, encryptAccountWithPass, lockTime }

function say() {
    let lockString = 'Lock account loaded. Background started'
    console.log(lockString)
}

export { say }
