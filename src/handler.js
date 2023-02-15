import {
    decryptAccount, deletePasswordBiometry,
    encryptAccount,
    encryptAccountWithPass, getPasswordBiometry,
    lockAccount,
    lockTime,
    savePasswordBiometry
} from './lockAccount'

// const cacheStore = require('./indexDB') // es6
import indexDB from './utils/indexDB'
import { USER, REFERRAL } from './utils/names'
import eventBus from './utils/eventBus'
import TransportWebHID from '@ledgerhq/hw-transport-webhid'
import { signHash } from './utils/ledgerShell'
import { apiController } from './utils/apiController'
import { extensionApi } from './utils/extensionApi'
import { getMiners, initPoa, startPoa, stopPoa, swithMiner, updateToken } from './utils/poa/poaStarter' // commonjs
import { getMnemonicPrivateKeyHex } from './ui/Utils'
import { Capacitor, registerPlugin } from '@capacitor/core'
import { startBackgroundMining, getMobileMiners, stopMobileMiners } from './mobileBackground'
import { NativeBiometric } from 'capacitor-native-biometric'
// var cacheStore = window.cacheStore // compiled javascript

let miningStatus = { miningProcess: false }
let handlerMiners = []
const androidRegex = /android/
const iosRegex = /ios/

let test = registerPlugin('PoA')


export function globalMessageHandler(msg, ENQWeb) {

    return new Promise(async (resolve, reject) => {


        if (androidRegex.test(Capacitor.getPlatform()) || iosRegex.test(Capacitor.getPlatform())) {
            if (msg.ports && msg.disconnect) {
                if (msg.all) {
                    disconnectPorts()
                }
                if (msg.name) {
                    if (msg.favorite) {
                        disconnectFavoriteSite(msg.name)
                    } else {
                        disconnectPorts(msg.name)
                    }
                }
            }
        }

        indexDB.get(USER)
            .then(function (user) {
                // console.warn('IndexDB USER')
                // console.log(user)
            })

        // TODO Description
        if (msg.initial) {
            runLockTimer()
            resolve({ response: true })
        }

        // TODO Open new window from background or worker
        if (msg.window) {
            if (msg.url != undefined) {
                createPopupWindow(msg.url)
            } else {
                createPopupWindow(false)
            }
            resolve()
        }

        // TODO Popup window request user object
        if (msg.account && msg.request) {

            // If user locked
            if (userStorage.lock.checkLock()) {
                resolve({ response: false })
            }

            // If user on background or worker memory
            if (Object.keys(ENQWeb.Enq.User).length > 0) {

                console.log('Memory session')
                resolve({ response: ENQWeb.Enq.User })

                // User unlocked but not on memory, old web version
            } else {

                // We lost session
                console.warn('LOST SESSION')

                if (userStorage.user.userExist()) {

                    lockAccount()
                    eventBus.dispatch('lock', { message: true })
                    resolve({ response: false })
                }

                // let webSession = JSON.parse(sessionStorage.getItem('User'))
                // userSession = webSession ? webSession : false
                // console.warn('Session storage: ' + !!userSession)
            }
        }

        // Unlock user.account object to memory
        if (msg.account && msg.unlock && msg.password) {

            runLockTimer()


            let account
            try {
                account = decryptAccount(msg.password)
            } catch (e) {
                eventBus.dispatch('lock', { message: false })
            }

            if (account) {

                // Unlock user to memory user
                ENQWeb.Enq.User = account
                ENQWeb.Enq.setProvider(account.net)
                // Set user to storage memory (localStorage or IndexedDB)
                // userStorage.user.addUser(account)

                // Set user to sessionStorage for web
                // createWebSession(account)

                encryptAccountWithPass(account)
                resolve({ response: account })

            } else {
                resolve({ response: false })
            }
        }

        // Login by seed and simple login, set user data to app
        if (msg.account && msg.set && msg.data) {

            let account = msg.data

            // console.log(account)

            // Unlock user to memory user
            ENQWeb.Enq.User = account
            ENQWeb.Enq.setProvider(account.net)
            // Set user to storage memory (localStorage or IndexedDB)
            // userStorage.user.addUser(account)

            encryptAccountWithPass(account)
            resolve({ response: account })
        }

        // TODO
        if (msg.account && msg.encrypt) {

            // TODO Password
            if (msg.again) {
                // console.log(msg.data)
                // userStorage.user.addUser(msg.data)
                encryptAccountWithPass(msg.data)
            }

            if (msg.set) {
                encryptAccountWithPass(false, msg.set)
            }
            resolve({ response: true })
        }

        // Lock user model
        if (msg.lock) {
            lockAccount()
            resolve({ response: true })
        }

        // Logout
        if (msg.account && msg.logout) {


            ENQWeb.Enq.User = {}
            userStorage.user.removeUser()

            // disconnectPorts()
            resolve({ response: true })
        }

        if(msg.biometry && msg.update){
            if(msg.data)
                savePasswordBiometry().then(data=>{
                    resolve({response:true})
                })
            else
                deletePasswordBiometry().then(data=>{
                    resolve({response:true})
                })
        }

        if(msg.biometry && msg.changePassword){
            await deletePasswordBiometry().then(data=>{})
            await savePasswordBiometry().then(data=>{})
            resolve({response:true})
        }

        if(msg.biometry && msg.get){
            let data =  await getPasswordBiometry()
            resolve({response:data})
        }

        if (msg.update && msg.background) {

        }

        // Get PoA keys state
        if (msg.poa && msg.get) {

            if (androidRegex.test(Capacitor.getPlatform()) || iosRegex.test(Capacitor.getPlatform())) {
                // let answer = await getMobileMiners()
                let answer = await test.getMiners()
                    .then(data => {
                        // console.log(data)
                        if (data.status === undefined) {
                            let buf = Object.keys(data)
                            for (let i = 0; i < buf.length; i++) {
                                for (let j = 0; j < handlerMiners.length; j++) {
                                    if (handlerMiners[j].publicKey === buf[i]) {
                                        handlerMiners[j].publisher = { status: data[buf[i]] }
                                    }
                                }
                            }
                        } else {
                            handlerMiners.forEach(el => {
                                if (!el.publisher) {
                                    el.publisher = {}
                                }
                                el.publisher.status = 'Disconnected'
                            })
                        }
                    })
                resolve({ response: handlerMiners })
            } else {
                if (handlerMiners.length === 0) {
                    handlerMiners = await initPoa(ENQWeb.Enq.User)
                    console.log(handlerMiners)
                    resolve({ response: handlerMiners })
                } else {
                    let answer = await getMiners()

                    handlerMiners = answer ? answer : handlerMiners
                    if (!answer) {
                        handlerMiners.forEach(el => {
                            if (!el.publisher) {
                                el.publisher = {}
                            }
                            el.publisher.status = 'Disconnected'
                        })
                    }
                    resolve({ response: handlerMiners })
                }
            }
            // console.log(handlerMiners)
            // console.log(miningStatus)

        }

        //TODO pls no pull name
        //update mining pull
        if (msg.poa && msg.update && msg.pull) {
            console.log('Mining pull updated')
            handlerMiners = await initPoa(ENQWeb.Enq.User)
            resolve({ response: handlerMiners })
        }

        //update balances
        if (msg.poa && msg.update && msg.balance) {
            if (handlerMiners.length === 0) {
                handlerMiners = await initPoa(ENQWeb.Enq.User)
            }
            for (let i = 0; i < handlerMiners.length; i++) {
                handlerMiners[i].token = await apiController.getBalance(handlerMiners[i].publicKey, handlerMiners[i].token.token)
            }
            resolve({ response: handlerMiners })
        }

        // Start all PoA
        if (msg.poa && msg.status) {
            if (androidRegex.test(Capacitor.getPlatform())) {
                test.getServiceStatus()
                    .then(async data => {
                        if (handlerMiners.length == 0) {
                            handlerMiners = await initPoa(ENQWeb.Enq.User)
                        }
                        miningStatus.miningProcess = data.status
                        resolve({ response: miningStatus })
                    })
                return
            }
            resolve({ response: miningStatus })
        }

        // Start all PoA
        if (msg.poa && msg.start) {
            let miners = {}
            let accounts = []
            if (msg.account) {
                miners = await startPoa(msg.account, handlerMiners)
                miningStatus.miningProcess = true
                resolve({ response: miners })
            } else {
                for (let i = 0; i < ENQWeb.Enq.User.seedAccountsArray.length; i++) {
                    console.log(handlerMiners[i])
                    let privateKey = getMnemonicPrivateKeyHex(ENQWeb.Enq.User.seed, i)
                    accounts.push({
                        publicKey: ENQWeb.Utils.Sign.getPublicKey(privateKey, true),
                        privateKey: privateKey
                    })
                }

                for (let i = 0; i < ENQWeb.Enq.User.privateKeys.length; i++) {
                    console.log(handlerMiners[i])
                    let privateKey = ENQWeb.Enq.User.privateKeys[i]
                    accounts.push({
                        publicKey: ENQWeb.Utils.Sign.getPublicKey(privateKey, true),
                        privateKey: privateKey
                    })
                }

                // TODO ?
                let pulseIP = '95.216.68.221'
                let bitIP = '95.216.246.116'
                let f3IP = '95.216.207.173'

                let network = JSON.parse((await bootNodeGetIP()).data)
                console.log(network)

                if (androidRegex.test(Capacitor.getPlatform()) || iosRegex.test(Capacitor.getPlatform())) {

                    let refCode = localStorage.getItem(REFERRAL)
                    let netList = {
                        'https://bit.enecuum.com': bitIP,
                        'https://pulse.enecuum.com': pulseIP
                    }

                    try {
                        for (let i = 0; i < handlerMiners.length; i++) {
                            accounts[i].token = handlerMiners[i].token.token
                            accounts[i].status = handlerMiners[i].mining
                            accounts[i].referrer = refCode || 'false'
                        }
                    } catch (e) {
                        console.error('Error in handle miners!')
                    }

                    // console.log(accounts)

                    test.start({
                        data: JSON.stringify(accounts),
                        net: network.data.ip,
                        port: network.data.port
                    })
                        .then(res => {
                        })
                    // let miners = startBackgroundMining()
                    miningStatus.miningProcess = true
                    // resolve({ response: miners })
                    resolve({ response: true })

                } else {
                    miners = await startPoa(ENQWeb.Enq.User, handlerMiners, accounts)
                    console.log(miners)
                    // handlerMiners = miners
                    miningStatus.miningProcess = true
                    resolve({ response: miners })
                }
            }
        }

        if (msg.poa && msg.stop) {
            console.log(handlerMiners)
            if (androidRegex.test(Capacitor.platform) || iosRegex.test(Capacitor.getPlatform())) {
                test.stop()
                    .then(res => {
                    })
                let miners = stopMobileMiners()
                miningStatus.miningProcess = false
                resolve({ response: miners })
            } else {
                for (let i = 0; i < handlerMiners.length; i++) {
                    handlerMiners[i].publisher.restart = false
                }
                let miners = await stopPoa(handlerMiners)
                console.log(miners)
                // handlerMiners = miners
                miningStatus.miningProcess = false
                resolve({ response: miners })
            }
        }

        if (msg.poa && msg.account && msg.token) {
            console.log(handlerMiners)
            handlerMiners.find(element => element.publicKey === msg.account.publicKey).token = msg.token
            if ((androidRegex.test(Capacitor.platform) || iosRegex.test(Capacitor.getPlatform())) && miningStatus.miningProcess) {
                test.updateMiner({
                    data: JSON.stringify({
                        publicKey: msg.account.publicKey,
                        token: msg.token.token
                    })
                })
                    .then(res => {
                    })
            } else {
                updateToken(msg.account.publicKey, msg.token)
                    .then()
            }

            resolve({ response: handlerMiners })
        }

        if (msg.poa && msg.account && msg.mining) {
            console.log(handlerMiners)
            try {
                handlerMiners.find(element => element.publicKey === msg.account.publicKey).publisher.restart = msg.set
            } catch (e) {
            }
            handlerMiners.find(element => element.publicKey === msg.account.publicKey).mining = msg.set
            if (miningStatus.miningProcess && (androidRegex.test(Capacitor.platform) || iosRegex.test(Capacitor.getPlatform()))) {
                test.minerSwitch({
                    data: JSON.stringify({
                        publicKey: msg.account.publicKey,
                        status: msg.set
                    })
                })
                    .then()
            } else {
                swithMiner(msg.account.publicKey, msg.set)
                    .then()
            }
            resolve({ response: handlerMiners })
        }

        // // Disconnect PoA by id
        // if (msg.poa && msg.disconnect) {
        //     let index = handlerMiners.findIndex(el => el.id === msg.disconnect)
        //     handlerMiners[index].close()
        //     delete handlerMiners[index]
        //     handlerMiners = handlerMiners.filter(el => el.id ? el : false)
        // }

        // // Start all PoA by id
        // if (msg.poa && msg.account) {
        //
        //     // We have ENQWeb.Enq.User here, not msg.account
        //
        //     let index = handlerMiners.findIndex(el => el.id === msg.account.publicKey)
        //     if (index !== -1) {
        //         if (handlerMiners[index].ws.readyState === 1) {
        //             resolve({response: false})
        //         } else {
        //             delete handlerMiners[index]
        //             startPoa(msg.account, ENQWeb.Enq.User.token, ENQWeb.Enq.User.net)
        //                 .forEach(el => handlerMiners.push(el))
        //         }
        //
        //     } else {
        //         startPoa(msg.account, ENQWeb.Enq.User.token, ENQWeb.Enq.User.net)
        //             .forEach(el => handlerMiners.push(el))
        //     }
        //     if (msg.log) {
        //         console.log(handlerMiners)
        //     }
        // }

        // if (msg.poa && msg.get) {
        //     resolve({response: miners})
        // }

        // if (msg.poa && msg.account) {
        //     if (miners.find(element => element.id === msg.account.publicKey) !== undefined) {
        //         resolve({response: false})
        //     } else {
        //         // startPoa(msg.account, ENQWeb.Enq.ticker, 'test').forEach(element => miners.push(element))
        //     }
        // }

        resolve({ response: false })
    })
}

//TODO add rule for add to storage
const webBackground = (msg, net) => {
    let popupOpenMethods = {
        'enable': true,
        'tx': true,
        'sign': true,
        'reconnect': false
    }
    if (msg.cb.taskId) {
        if (!popupOpenMethods[msg.type]) {
            return true
        }
        console.log(msg)
        if (msg.type === 'tx') {
            userStorage.task.setTask(msg.cb.taskId, {
                tx: msg.tx,
                type: msg.type,
                cb: msg.cb,
                data: msg.data,
            })
            if (msg.data.net.length > 0) {
                if (msg.data.net !== net) {
                    console.log('bad net work')
                    rejectTaskHandler(msg.cb.taskId, `Network mismatch. Set ${msg.data.net}`)
                    return `Network mismatch. Set ${msg.data.net}`
                }
            }
        } else {
            userStorage.task.setTask(msg.cb.taskId, {
                data: msg.data,
                type: msg.type,
                cb: msg.cb
            })
        }
        return true
    } else {
        // console.log(msg)
        return false
    }

}

function rejectTaskHandler(taskId, reason = 'rejected') {
    userStorage.task.removeTask(taskId)
    return true
}

// TODO TEMP
let createWebSession = (account) => {
    const webAccount = JSON.parse(JSON.stringify(account))
    webAccount.privateKey = true
    webAccount.seed = account.seed ? true : ''
    sessionStorage.setItem('User', JSON.stringify(webAccount))
}


let bootNodeGetIP = () => {
    return new Promise(resolve => {
        let bootNodeIP = '95.217.17.178'
        let bitPort = '4000'
        let pulsePort = '4001'
        let portList = {
            'https://bit.enecuum.com': bitPort,
            'https://pulse.enecuum.com': pulsePort
        }
        let answer
        let ws = new WebSocket(`ws://${bootNodeIP}:${portList[ENQWeb.Net.provider] !== undefined ? portList[ENQWeb.Net.provider] : '4000'}`)
        ws.onmessage = message => {
            answer = message
        }
        ws.onclose = () => {
            resolve(answer)
        }
    })

}

let lockTimer

export function Timer(ms) {
    lockTime = ms
    return true
}

export function runLockTimer() {
    console.log('Run lock timer')
    if (lockTimer !== undefined) {
        clearTimeout(lockTimer)
    }
    if (userStorage.name === 'background') {
        lockTimer = setTimeout(() => lockAccount(true), lockTime)
    } else {
        lockTimer = setTimeout(() => {
            eventBus.dispatch('lock', { message: true })
            userStorage.promise.sendPromise({ lock: true })
        }, lockTime)
    }
}

export async function messagePopupHandler(msg) {
    if (msg.allow && msg.taskId) {
        return await taskHandler(msg.taskId)
            .then(data => {
                return {
                    asyncAnswer: true,
                    data: data
                }
            })
            .catch(err => {
                console.warn(err)
                return {
                    asyncAnswer: true,
                    data: { status: 'reject' }
                }
            })

    } else if (msg.disallow && msg.taskId) {
        rejectTaskHandler(msg.taskId)
        return {
            reject: true,
            data: {
                data: JSON.stringify({
                    reject: true,
                    data: 'rejected'
                })
            }
        }
    }
    if (msg.connectionList) {
        return {
            asyncAnswer: true,
            data: msg,
            ports: enabledPorts()
        }
    }
    if (msg.favoriteList) {
        return {
            asyncAnswer: true,
            data: msg,
            ports: favoriteSites()
        }
    }
}

let ledgerTransport

const taskHandler = async (taskId) => {
    let task = userStorage.task.getTask(taskId)
    let buf
    let account = await userStorage.user.loadUser()
    let data = ''

    let wallet = {
        pubkey: account.publicKey,
        prvkey: account.privateKey
    }
    switch (task.type) {
        // TODO Description
    case 'enable':
        data = {
            pubkey: account.publicKey,
            net: account.net,
        }
        if (androidRegex.test(Capacitor.getPlatform()) || iosRegex.test(Capacitor.getPlatform())) {
            ports[task.cb.url] = {}
            ports[task.cb.url].enabled = true
        }
        console.log('enable. returned: ', data)
        userStorage.task.removeTask(taskId)
        return {
            data: JSON.stringify(data),
            taskId: taskId,
            cb: task.cb
        }
        // TODO Description
    case 'tx':
        data = task.tx
        console.log(data)
        buf = ENQWeb.Net.provider
        ENQWeb.Net.provider = account.net
        if (account.ledger !== undefined && account.type === 2) {
            data.from = wallet.pubkey
            data.amount = data.value ? Number(data.value) : Number(data.amount)
            data.tokenHash = data.ticker ? data.ticker : data.tokenHash
            data.value = ''
            data.nonce ? data.nonce : Math.floor(Math.random() * 1e10)
            data.hash = ENQWeb.Utils.Sign.hash_tx_fields(data)
            let Transport = ledgerTransport ? ledgerTransport : await TransportWebHID.create()
            if (!ledgerTransport) {
                ledgerTransport = Transport
            }
            data.sign = await signHash(ENQWeb.Utils.crypto.sha256(data.hash), wallet.prvkey, Transport)
                .catch(() => {
                    return false
                })
            if (data.sign) {
                data = await apiController.sendTransaction(data)
                    .then(data => {
                        if (data.hash) {
                            return data
                        }
                        console.warn(data)
                    })
                    .catch(er => {
                        console.error(er)
                    })
            } else {
                console.warn('Transaction rejected')
                throw new Error('reject')
            }

        } else {
            data.from = wallet
            data.amount = data.value ? Number(data.value) : Number(data.amount)
            data.tokenHash = data.ticker ? data.ticker : data.tokenHash
            data.value = ''
            data = await apiController.postTransaction(data)
                .catch(err => {
                    console.log(err)
                    return false
                })
        }
        ENQWeb.Net.provider = buf
        userStorage.task.removeTask(taskId)
        return {
            data: JSON.stringify({ hash: data.hash ? data.hash : 'Error' }),
            taskId: taskId,
            cb: task.cb
        }
        break
        // TODO Description
    case 'balanceOf':
        data = task.data
        buf = ENQWeb.Net.provider
        console.log(account)
        if (data.to) {
            wallet.pubkey = data.to
        }
        ENQWeb.Net.provider = data.net || account.net
        console.log(task.data, ENQWeb.Net.provider)
        data = await apiController.getBalance(wallet.pubkey, data.tokenHash || ENQWeb.Enq.token[ENQWeb.Net.provider])
            .catch(err => {
                console.log(err)
                return false
            })
        userStorage.task.removeTask(taskId)
        ENQWeb.Net.provider = buf
        return {
            data: JSON.stringify(data),
            taskId: taskId,
            cb: task.cb
        }
        // TODO Description
    case 'getProvider':
        ENQWeb.Net.provider = account.net
        if (task.cb.fullUrl) {
            data = { net: ENQWeb.Net.provider }
        } else {
            data = { net: ENQWeb.Net.currentProvider }
        }
        userStorage.task.removeTask(taskId)
        return {
            data: JSON.stringify(data),
            taskId: taskId,
            cb: task.cb
        }
        // TODO Description
    case 'getVersion':
        console.log('version: ', extensionApi.app.getDetails().version)
        userStorage.task.removeTask(taskId)
        return {
            data: JSON.stringify(extensionApi.app.getDetails().version),
            taskId: taskId,
            cb: task.cb
        }
        // TODO Description
    case 'sign':
        userStorage.task.removeTask(taskId)
        return {
            data: JSON.stringify(task.result),
            taskId: taskId,
            cb: task.cb
        }
        // TODO Description
    case 'reconnect':
        console.log('reconnect')
        userStorage.task.removeTask(taskId)
        let sites = await userStorage.sites.getSites()
        return {
            data: JSON.stringify(ports[task.cb.url] ? { stutus: ports[task.cb.url].enabled || false } : sites[task.cb.url] ? { status: true } : { status: false }),
            taskId: taskId,
            cb: task.cb
        }
    default:
        break
    }
    return true
}

//TODO
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
        url: url ? url : 'index.html',
        width: WinReg.test(navigator.platform) ? os_width.Win : os_width.Mac,
        height: LinuxReg.test(navigator.platform) ? os_height.Linux : os_height.Mac,
        type: 'popup'
    })
}

function createTabWindow(params = '') {
    // chrome.windows.create({
    //     url: window.location.href + params,
    // })
    window.open(window.location.href.split('?')[0] + params, '_blank')
        .focus()
}

let ports = {}
function favoriteSites() {
    let sites = userStorage.sites.getSites()
    let list = []
    for (let i in sites) {
        if (sites[i] === true) {
            list.push(i)
        }
    }
    return list
}
function enabledPorts() {
    let list = {}
    for (let i in ports) {
        if (ports[i].enabled) {
            list[i] = ports[i]
        }
    }
    return list
}

function disconnectPorts(name) {
    if (!name) {
        for (let key in ports) {
            // console.log(key,ports[key]);
            if (ports[key].name !== 'popup') {
                ports[key].enabled = false
            }
        }
    } else {
        ports[name].enabled = false
    }
    return true
}
function disconnectFavoriteSite(name) {
    let sites = userStorage.sites.getSites()
    if (sites[name] === true) {
        sites[name] = false
        userStorage.sites.setSites(sites)
    }
}

function checkConnection() {
    // console.log("check live")
    if (Object.keys(ports).length > 0) {
        for (let i in ports) {
            // if (i === 'popup') {
            //     continue
            // }
            for (let j in ports[i]) {
                if (j === 'enabled') {
                    continue
                }
                try {
                    ports[i][j].postMessage({ check: 'are u live?' })
                } catch (e) {
                    // console.log("deleted")
                    delete ports[i][j]
                }
            }
        }
    }
}

export {
    createPopupWindow, createTabWindow, webBackground, taskHandler, ports, favoriteSites, enabledPorts, disconnectPorts, disconnectFavoriteSite, checkConnection
}
