let account = {

    net: '',
    token: '',

    privateKeys: [], // keys

    mainPrivateKey: '',
    mainPublicKey: '',
    type: 0, // 0 - private, 1 - seed, 2 - ledger
    accountIndex: 0,

    // Always encrypted
    seed: '',
    seedAccountsArray: [],
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

export {account, changeAccount, getSeedAccounts}