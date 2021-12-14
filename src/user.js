import indexDB from "./utils/indexDB";

// let user = {
//     accounts: []
// }

const account = {

    net: '',
    token: '',

    // Imported private keys
    publicKeys: [], // In case we have to show them on the list
    // TODO Always encrypted
    privateKeys: [],

    // This key is selected now
    publicKey: '',
    // Session decrypted, have not to be on popup memory
    privateKey: '',
    type: 0, // 0 - private, 1 - seed, 2 - ledger
    accountIndex: 0, //

    // TODO Always encrypted
    seed: '',
    seedAccountsArray: [],

    // Ledger ID
    ledger: '',
    ledgerAccountsArray: [], // index

    names: {}, // The list of names taken by public keys
}

let generateAccountData = (privateKey, hex) => {
    let data = {
        ...account,
        publicKey: ENQWeb.Utils.Sign.getPublicKey(privateKey, true),
        privateKey: privateKey,
        net: ENQWeb.Net.provider,
        token: ENQWeb.Enq.ticker,
        seed: hex
    }
    return data
}

let getSeedAccounts = () => {

    // We have to export our public key from seed here
    let seedArray = []
    // And select only this keys > seedAccountsArray
    return account.seedAccountsArray;
}

let changeAccount = (type, index) => {
    let array;
    if (type === 0)
        array = account.privateKeys[index]
    if (type === 1)
        // array = account.seedAccountsArray[index]
    if (type === 2) {

    }
}

let addAccountOldFormat = (data)=>{

}
let updateAccount = (data) => {

}

export {account, generateAccountData}