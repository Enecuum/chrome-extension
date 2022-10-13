// const argv = require('yargs').argv;
// const fs = require('fs');
import {Publisher} from './publisher'
import {getMnemonicPrivateKeyHex, showNotification, xor, XOR_STRING, xorBack} from '../../ui/Utils'
import {apiController} from '../apiController'
import {REFERRAL} from "../names";

let PoA_Worker;
let answer = ''
let terminated;

let netList = {
    "https://bit.enecuum.com": "95.216.246.116",
    "https://pulse.enecuum.com": "95.216.68.221"
}

let initWorker = async () => {
    PoA_Worker = await (new Worker('./js/WebWorkerPOA.js'))
    terminated = false
    PoA_Worker.onerror = err => {
        console.warn(err)
    }
    PoA_Worker.onmessage = msg => {
        answer = msg
        let data = JSON.parse(msg.data)
        if (data.method === 'notification') {
            showNotification(data.body.title, data.body.text)
        }
    }
}

let stopWorker = () => {
    PoA_Worker.terminate();
    terminated = true
}

let waitAnswer = (msg) => {
    return new Promise((resolve, reject) => {
        answer = false
        PoA_Worker.postMessage(msg)
        let interval = setInterval(() => {
            if (answer != false) {
                clearInterval(interval)
                resolve(answer.data)
            }
        }, 200)
    })
}

// Miner
// {
//     i, - ID for name
//     publicKey, - for mining card
//     mining: false, - mining OFF or ON in UI
//     list: true, - is UI card open
//     tokens, - list of tokens from API
//     token: tokens[0] ? tokens[0] : {token: '', decimals: 10}, - object of selected token
//     publisher: tokens[0] ? new Publisher({publicKey, privateKey}, tokens[0].token) : {} -
// }

let initPoa = async (account) => {

    let miners = []
    for (let i = 0; i < account.seedAccountsArray.length; i++) {

        let privateKey = getMnemonicPrivateKeyHex(account.seed, account.seedAccountsArray[i])
        const publicKey = ENQWeb.Utils.Sign.getPublicKey(privateKey, true)

        let tokens = await apiController.getBalanceAll(publicKey)

        let refKey = localStorage.getItem(REFERRAL) || ''

        miners.push({
            i,
            publicKey,
            mining: true,
            list: true,
            tokens,
            token: tokens[0] ? tokens[0] : {
                token: '',
                decimals: 10
            },
            referrer: refKey.length === 70 ? xor(XOR_STRING, refKey.substring(4)) : null,
            net: netList[ENQWeb.Net.provider] || '95.216.246.116',
            type: "mnemonic",
            publisher: false
            // publisher: tokens[0] ? new Publisher({publicKey, privateKey}, tokens[0].token) : {}
        })
    }

    for (let i = 0; i < account.privateKeys.length; i++) {

        const publicKey = ENQWeb.Utils.Sign.getPublicKey(account.privateKeys[i], true)

        let tokens = await apiController.getBalanceAll(publicKey)

        miners.push({
            i,
            publicKey,
            mining: true,
            list: true,
            tokens,
            token: tokens[0] ? tokens[0] : {
                token: '',
                decimals: 10
            },
            net: netList[ENQWeb.Net.provider] || '95.216.246.116',
            type: "private",
            publisher: false
            // publisher: tokens[0] ? new Publisher({publicKey, privateKey}, tokens[0].token) : {}
        })
    }
    return miners
}

let startPoa = async (account, miners, accounts = []) => {

    await initWorker();
    // let privateKey = getMnemonicPrivateKeyHex(account.seed, account.seedAccountsArray[i])

    // console.log(account)

    // miners = await initPoa(account)

    if (accounts.length > 0) {
        // for (let i = 0; i < miners.length; i++) {
        //     miners[i].publisher = miners[i].mining && miners[i].tokens[0] ? new Publisher({
        //         publicKey: accounts[i].publicKey,
        //         privateKey: accounts[i].privateKey
        //     }, miners[i].token.token) : {}
        // }
        for (let i = 0; i < miners.length; i++) {
            miners[i].publisher = miners[i].mining && miners[i].tokens[0] ? {
                account: {
                    publicKey: accounts[i].publicKey,
                    privateKey: accounts[i].privateKey,
                    referrer: accounts[i].referrer
                }, token: miners[i].token.token
            } : {}
        }
        miners = await waitAnswer({start: true, data: miners})
        miners = (JSON.parse(miners)).miners
        showNotification('Mining', 'Connected ' + miners.length + ' miners')

    } else {
        for (let i = 0; i < miners.length; i++) {
            miners[i].publisher = miners[i].mining && miners[i].tokens[0] ? new Publisher({
                publicKey: account.publicKey,
                privateKey: account.privateKey
            }, miners[i].token.token) : {}
        }
    }

    return miners
}

let stopPoa = async (miners) => {

    // let privateKey = getMnemonicPrivateKeyHex(account.seed, account.seedAccountsArray[i])

    // console.log(account)

    // miners = await initPoa(account)

    // for (let i = 0; i < miners.length; i++) {
    //     try {
    //         miners[i].publisher.ws.close()
    //     } catch (e) {
    //     }
    //     delete miners[i].publisher
    // }

    miners = (await waitAnswer({stop: true, data: miners})).miners
    await stopWorker()
    return miners
}

let updateToken = async (account, token) => {
    let miners = (await waitAnswer({updateToken: true, account: account, token: token})).miners
    return miners
}

let swithMiner = async (account, set) => {
    let miners = (await waitAnswer({switch: true, account: account, set: set})).miners
    return miners
}

let getMiners = async () => {
    if (PoA_Worker && !terminated) {
        let answer = JSON.parse(await waitAnswer({get: true}))
        return answer.miners
    }
    return false
}

export {startPoa, stopPoa, initPoa, getMiners, updateToken, swithMiner}
