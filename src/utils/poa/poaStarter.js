// const argv = require('yargs').argv;
// const fs = require('fs');
import { Publisher } from './publisher'
import {getMnemonicPrivateKeyHex} from "../../ui/Utils";
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
            mining: false,
            list: true,
            tokens,
            token: tokens[0] ? tokens[0] : {token: '', decimals: 10},
            // publisher: tokens[0] ? new Publisher({publicKey, privateKey}, tokens[0].token) : {}
        })
    }

    return miners
}

let startPoa = async (account, miners) => {

    // let privateKey = getMnemonicPrivateKeyHex(account.seed, account.seedAccountsArray[i])

    // console.log(account)

    // miners = await initPoa(account)

    for (let i = 0; i < miners.length; i++) {
        miners[i].publisher = miners[i].mining && miners[i].tokens[0] ? new Publisher({publicKey: account.publicKey, privateKey: account.privateKey}, miners.token.token) : {}
    }

    // return localAccounts
}

let stopPoa = async (account, miners) => {

    // let privateKey = getMnemonicPrivateKeyHex(account.seed, account.seedAccountsArray[i])

    // console.log(account)

    // miners = await initPoa(account)

    for (let i = 0; i < miners.length; i++) {
        miners[i].publisher.ws.close()
    }

    // return localAccounts
}

export { startPoa, initPoa }
