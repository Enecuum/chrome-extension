// const argv = require('yargs').argv;
// const fs = require('fs');
import {Publisher} from './publisher'
import {getMnemonicPrivateKeyHex, showNotification} from "../../ui/Utils";
import {apiController} from "../apiController";

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
            token: tokens[0] ? tokens[0] : {token: '', decimals: 10},
            // publisher: tokens[0] ? new Publisher({publicKey, privateKey}, tokens[0].token) : {}
        })
    }

    return miners
}

let startPoa = async (account, miners, accounts = []) => {

    // let privateKey = getMnemonicPrivateKeyHex(account.seed, account.seedAccountsArray[i])

    // console.log(account)

    // miners = await initPoa(account)

    if (accounts.length > 0) {
        for (let i = 0; i < miners.length; i++) {
            miners[i].publisher = miners[i].mining && miners[i].tokens[0] ? new Publisher({
                publicKey: accounts[i].publicKey,
                privateKey: accounts[i].privateKey
            }, miners[i].token.token) : {}
        }

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

    for (let i = 0; i < miners.length; i++) {
        miners[i].publisher.ws.restart = false
        miners[i].publisher.ws.close()
        delete miners[i].publisher
    }

    // return miners
}

export {startPoa, stopPoa, initPoa}
