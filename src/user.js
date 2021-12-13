import indexDB from "./utils/indexDB";

let account = {

    net: '',
    token: '',

    // Imported private keys
    publicKeys: [], // In case we have to show them on the list
    // Always encrypted
    privateKeys: [],

    // This key is selected now
    publicKey: '',
    // Session decrypted, have not to be on popup memory
    privateKey: '',
    type: 0, // 0 - private, 1 - seed, 2 - ledger
    accountIndex: 0, //

    // Always encrypted
    seed: '',
    seedAccountsArray: [0],

    // Ledger ID
    ledger: '',
    ledgerAccountsArray: [], // index
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

export {account, changeAccount, getSeedAccounts}