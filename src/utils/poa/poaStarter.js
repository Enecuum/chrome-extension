// const argv = require('yargs').argv;
// const fs = require('fs');
import { Publisher } from './publisher'
import { getMnemonicPrivateKeyHex, showNotification } from '../../ui/Utils'
import { apiController } from '../apiController'

let PoA_Worker;
let answer = ''

let initWorker = async ()=>{
    PoA_Worker = await (new Worker('./js/WebWorkerPOA.js'))
    PoA_Worker.onerror = err=>{
        console.warn(err)
    }
    PoA_Worker.onmessage = msg=>{
        console.log(msg)
        answer = msg
        let data = JSON.parse(msg.data)
        if(data.method === 'notification'){
            showNotification(data.body.title, data.body.text)
        }
    }
}

let stopWorker = ()=>{
    PoA_Worker.terminate();
}

let waitAnswer = (msg)=>{
    return new Promise((resolve, reject) => {
        answer = false
        PoA_Worker.postMessage(msg)
        let interval = setInterval(()=>{
            if(answer != false){
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
            miners[i].publisher = miners[i].mining && miners[i].tokens[0] ? {account:{
                publicKey: accounts[i].publicKey,
                privateKey: accounts[i].privateKey
            }, token:miners[i].token.token} : {}
        }

        miners = await waitAnswer({ start:true, data:miners })
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

    miners = (await waitAnswer({ stop:true, data:miners })).miners
    await stopWorker()
    return miners
}

export { startPoa, stopPoa, initPoa }
