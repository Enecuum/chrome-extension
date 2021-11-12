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

let changeAccount = (index) => {
    account.mainPrivateKey = [index]
    account.accountIndex = index
}