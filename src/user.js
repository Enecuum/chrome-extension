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
    seedAccountsArray: [0],
    // Do we have to remember selected private keys from seed?

    // Ledger ID
    ledger: '',
    ledgerAccountsArray: [], // index
}

let getSeedAccounts = (password) => {

}

let changeAccount = (type, index) => {
    let array = []
    account.mainPrivateKey = array[index]
    account.accountIndex = index
    account.type = type
}