let account = {

    net: '',
    token: '',

    // Old type, may be null
    privateKey: '',
    publicKey: '',

    mainPrivateKey: '',
    mainPublicKey: '',
    accountIndex: 0,

    // Always encrypted
    seed: '',
    seedAccountsArray: [0],
    // Do we have to remember selected private keys from seed?

    // Ledger ID
    ledger: '',
    ledgerAccountsArray: [],
}

let getSeedAccounts = (password) => {

}

let changeAccount = (index) => {
    account.mainPrivateKey = [index]
    account.accountIndex = index
}