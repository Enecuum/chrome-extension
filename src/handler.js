import {decryptAccount, encryptAccount, lockAccount} from "./lockAccount"

export function MsgHandler(msg, ENQWeb) {
    return new Promise((resolve, reject) => {

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
                resolve({response: ENQWeb.Enq.User})
            } else {
                resolve({response: false})
            }

        }
        if (msg.account && msg.unlock && msg.password) {
            let account = decryptAccount(msg.password)
            if (account) {
                ENQWeb.Enq.User = account
                // console.log(account)
                // console.log(ENQWeb.Enq.User)
                disk.user.addUser(account)
                encryptAccount()
                resolve({response: account})
            } else {
                resolve({response: false})
            }
        }
        if (msg.account && msg.set && msg.data) {
            // ENQWeb.Enq.User = msg.data
            //TODO HERE ENQWeb.Enq.User = ''
            disk.user.addUser(msg.data)
            encryptAccount()
            // console.log(ENQWeb.Enq.User)
            resolve({response: ENQWeb.Enq.User})
        }
        if (msg.account && msg.encrypt) {
            if (msg.again) {
                //TODO HERE (a, b, c) => addUser(obj) ?
                // disk.user.addUser(ENQWeb.Enq.User.publicKey, ENQWeb.Enq.User.privateKey, ENQWeb.Enq.User.net)
                disk.user.addUser(msg.data)
                encryptAccount()
            } else {
                encryptAccount()
            }
            resolve({response: true})
        }
        if (msg.lock) {
            ENQWeb.Enq.User = {}
            lockAccount()
            resolve({response: true})
        }
        if (msg.account && msg.logout) {
            ENQWeb.Enq.User = {}
            // disconnectPorts()
            resolve({response: true})
        }
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

export async function MsgPopupHandler(msg) {
    if (msg.popup) {
    }  else if (msg.connectionList) {
      return 0
    }
}

export {
    createPopupWindow
}

