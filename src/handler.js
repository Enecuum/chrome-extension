import {decryptAccount, encryptAccount, lockAccount} from './lockAccount'

export function MessageHandler(message, ENQWeb, disk) {

    console.log(message)
    console.log(ENQWeb)
    console.log(disk)

    return new Promise((resolve, reject) => {
        if (message.initial) {
            lockTimer(disk)
            resolve({response: true})
        }
        if (message.window) {
            if (message.url != undefined) {
                createPopupWindow(message.url);
            } else {
                createPopupWindow(false);
            }
            resolve();
        }
        if (message.account && message.request) {
            if (!disk.lock.checkLock()) {

                // let userSession = Object.keys(ENQWeb.Enq.User).length > 0 ? ENQWeb.Enq.User : (JSON.parse(sessionStorage.getItem('User')) ? JSON.parse(sessionStorage.getItem('User')) : false)
                // if (!userSession.publicKey) {
                //     console.log('sessionStorage expired')
                //     resolve({response: {}})
                //     lockAccount()
                //     window.location.reload(false)
                // } else
                //     resolve({response: userSession})

            } else {
                resolve({response: false})
            }

        }
        if (message.account && message.unlock && message.password) {
            let account = decryptAccount(message.password, disk)
            if (account) {
                ENQWeb.Enq.User = account
                sessionStorage.setItem('User', JSON.stringify(account))
                console.log(account)
                console.log(ENQWeb.Enq.User)
                disk.user.addUser(account)
                encryptAccount(disk)
                resolve({response: account})
            } else {
                resolve({response: false})
            }
        }
        if (message.account && message.set && message.data) {
            disk.user.addUser(message.data)
            ENQWeb.Enq.User = message.data
            sessionStorage.setItem('User', JSON.stringify(message.data))
            encryptAccount()
            // console.log(ENQWeb.Enq.User)
            resolve({response: ENQWeb.Enq.User})
        }
        if (message.account && message.encrypt) {
            if (message.again) {
                disk.user.addUser(message.data)
                encryptAccount(disk)
            } else {
                encryptAccount(disk)
            }
            resolve({response: true})
        }
        if (message.lock) {
            lockAccount()
            resolve({response: true})
        }
        if (message.account && message.logout) {
            ENQWeb.Enq.User = {}
            sessionStorage.setItem('User', JSON.stringify({}))
            // disconnectPorts()
            resolve({response: true})
        }
        resolve({response: false})
    })
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

export function lockTimer(disk) {
    if (timer !== undefined) {
        clearTimeout(timer)
    }
    if (disk.name === 'background') {
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

