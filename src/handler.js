import {decryptAccount, encryptAccount, lockAccount} from "./lockAccount"

export function MessageHandler(msg, ENQWeb) {
    return new Promise((resolve, reject) => {
        if (msg.initial) {
            lockTimer()
            resolve({response: true})
        }
        if (msg.window) {
            if (msg.url != undefined) {
                createPopupWindow(msg.url);
            } else {
                createPopupWindow(false);
            }
            resolve();
        }
        if (msg.account && msg.request) {
            if (!disk.lock.checkLock()) {

                let userSession
                if (Object.keys(ENQWeb.Enq.User).length > 0) {
                    console.log('Memory session')
                    userSession = ENQWeb.Enq.User
                } else {
                    let webSession = JSON.parse(sessionStorage.getItem('User'))
                    userSession = webSession ? webSession : false
                    console.warn('Session storage: ' + !!userSession)
                }

                if (!userSession.publicKey) {
                    console.log('sessionStorage expired')
                    resolve({response: {}})
                    lockAccount()
                    window.location.reload()
                } else
                    resolve({response: userSession})

            } else {
                resolve({response: false})
            }

        }
        if (msg.account && msg.unlock && msg.password) {

            let account = decryptAccount(msg.password)
            if (account) {

                // Unlock user to memory user
                ENQWeb.Enq.User = account
                disk.user.addUser(account)

                // TODO
                createWebSession(account)

                encryptAccount()
                resolve({response: account})
            } else {
                resolve({response: false})
            }
        }
        if (msg.account && msg.set && msg.data) {

            // Edit user
            console.log(msg.data)
            let account = msg.data
            ENQWeb.Enq.User = account
            disk.user.addUser(account)

            // TODO
            createWebSession(account)

            encryptAccount()
            resolve({response: account})
        }
        if (msg.account && msg.encrypt) {
            if (msg.again) {
                console.log(msg.data)
                disk.user.addUser(msg.data)
                encryptAccount()
            } else {
                encryptAccount()
            }
            resolve({response: true})
        }
        if (msg.lock) {
            lockAccount()
            resolve({response: true})
        }
        if (msg.account && msg.logout) {
            ENQWeb.Enq.User = {}
            sessionStorage.setItem('User', JSON.stringify({}))
            // disconnectPorts()
            resolve({response: true})
        }
        resolve({response: false})
    })
}

let createWebSession = (account) => {

    // TODO
    const webAccount = JSON.parse(JSON.stringify(account))
    webAccount.web = true
    webAccount.privateKey = ''
    webAccount.seed = account.seed ? true : ''
    webAccount.account1 = account.seed ? true : ''
    sessionStorage.setItem('User', JSON.stringify(webAccount))
}

function createPopupWindow(url) {
    let mainHeight = 600
    let mainWidth = 350
    const os_width = {
        'Win': mainWidth + 20,
        'Mac': mainWidth,
        'Linux': mainWidth
    }
    const os_height = {
        'Win': mainHeight + 30,
        'Mac': mainHeight + 30,
        'Linux': mainHeight
    }
    const WinReg = /Win/
    const LinuxReg = /Linux/
    chrome.windows.create({
        url: url ? url : "index.html",
        width: WinReg.test(navigator.platform) ? os_width.Win : os_width.Mac,
        height: LinuxReg.test(navigator.platform) ? os_height.Linux : os_height.Mac,
        type: 'popup'
    })
}

let lockTime = 10 * 60 * 1000
let timer

export function Timer(ms) {
    lockTime = ms
    return true
}

export function lockTimer() {
    if (timer !== undefined) {
        clearTimeout(timer)
    }
    if (disk.name === "background") {
        timer = setTimeout(() => lockAccount(), lockTime)
    } else {
        timer = setTimeout(() => disk.promise.sendPromise({lock: true}), lockTime)
    }
}

export async function MsgPopupHandler(msg) {
    if (msg.popup) {
    } else if (msg.connectionList) {
        return 0
    }
}

export {
    createPopupWindow
}

