import indexDB from "./utils/indexDB";

let account = {

    net: '',
    token: '',

    privateKeys: [], // keys

    privateKey: '',
    publicKey: '',
    type: 0, // 0 - private, 1 - seed, 2 - ledger
    accountIndex: 0,

    // Always encrypted
    seed: '',
    seedAccountsArray: [0],
    // Do we have to remember selected private keys from seed?

    // Ledger ID
    ledger: '',
    ledgerAccountsArray: [], // index
}

let getSeedAccounts = (password) => {
    return account.seedAccountsArray;
}

let changeAccount = (type, index) => {
    let array;
    if (type === 0)
        array = account.privateKeys[index]
    if (type === 1)
        array = account.seedAccountsArray[index]
    if (type === 2) {
        //TODO set public key
        // array = account.ledgerAccountsArray[index]
    }
    account.mainPrivateKey = array[index];
    account.accountIndex = index
    account.type = type
}

let addAccountOldFormat = (data)=>{
    indexDB.get('user').then(account=>{
        account.mainPublicKey = data.publicKey
        account.mainPrivateKey = data.privateKey
        account.token = data.token
        account.net = data.net
        account.type = 0
        account.privateKeys.push(data.privateKey)
        indexDB.set('user', account).then()
    })
}
let updateAccount = (data)=>{
    indexDB.get('user').then(account=>{
        account.net = data.net
        account.token = data.token
        indexDB.set('user', account).then()
    })
}

export {account, changeAccount, getSeedAccounts, addAccountOldFormat, updateAccount}