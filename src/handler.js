import {decryptAccount, encryptAccount, lockAccount} from "./lockAccount"

export function MsgHandler(msg) {
    return new Promise((resolve, reject) => {

        // console.log(msg)

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
        if (msg.ports && msg.disconnect) {
            if (msg.all) {
                // disconnectPorts()
            }
            if (msg.name) {
                // disconnectPorts(msg.name)
            }
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

export async function msgPopupHandler(msg, sender) {
    // console.log({msg, sender})
    if (msg.popup) {
        if (msg.type === 'tx') {
            let user = ENQWeb.Enq.User
            let buf = ENQWeb.Net.provider
            ENQWeb.Net.provider = user.net
            let wallet = {
                pubkey: user.publicKey,
                prvkey: user.privateKey
            }
            let data = {
                from: wallet,
                to: msg.data.to,
                amount: Number(msg.data.amount) * 1e10,
                tokenHash: user.token
            }
            console.log(ENQWeb.Net.provider)
            // console.log({data})
            let answer = await ENQWeb.Net.post.tx_fee_off(data)
            // console.log(answer)
            ENQWeb.Net.provider = buf
        }
    } else if (msg.lock) {
        ENQWeb.Enq.User = {}
        lockAccount()
    } else if (msg.connectionList) {
        // ports.popup.postMessage({
        //     asyncAnswer: true,
        //     data: msg,
        //     ports: ports
        // })
    } else {
        if (msg.allow && msg.taskId) {
            // await taskHandler(msg.taskId)
            // taskCounter()
            // if (msg.async) {
            //     ports.popup.postMessage({
            //         asyncAnswer: true,
            //         data: msg
            //     })
            // }
        } else if (msg.disallow && msg.taskId) {
            // await rejectTaskHandler(msg.taskId)
            // taskCounter()
            // if (msg.async) {
            //     ports.popup.postMessage({
            //         asyncAnswer: true,
            //         data: msg
            //     })
            // }
        } else if (msg.reject_all) {
            // let list = Storage.list.loadList()
            // for (let i in list) {
            //     await rejectTaskHandler(list[i])
            // }
            // console.log('all request rejected');
            // if (msg.async) {
            //     ports.popup.postMessage({
            //         asyncAnswer: true,
            //         data: msg
            //     })
            // }
        } else {
            // console.log(msg)
        }
    }
}

