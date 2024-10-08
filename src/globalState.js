import {apiController} from './utils/apiController'

let baseNetwork = {
    balances: {},
    tokens: {},
    tickers: {},
    history: {},
    posList:{},
    pos:{}
}

let globalState = {

    state: {},

    save: () => {
        return new Promise(resolve => {
            if (!saveActive) {
                saveActive = true
                userStorage.state.setState(globalState.state)
                saveActive = false
                resolve()
            } else {
                let interval = setInterval(() => {
                    if (!saveActive) {
                        saveActive = true
                        userStorage.state.setState(globalState.state)
                        saveActive = false
                        clearInterval(interval)
                        resolve()
                    }
                }, time)
            }
        })
    },

    init: () => {
        globalState.state = userStorage.state.getState()
    },

    setBalanceData: (network, publicKey, tokens) => {
        globalState.state[network] = globalState.state[network] ? globalState.state[network] : {
            balances: {},
            tokens: {},
            tickers: {},
            history: {},
            posList:{},
            pos:{}
        }
        globalState.state[network].tokens[publicKey] = tokens

        globalState.state[network].balances[publicKey] = globalState.state[network].balances[publicKey] ? globalState.state[network].balances[publicKey] : {}
        for (let i = 0; i < tokens.length; i++) {
            globalState.state[network].balances[publicKey][tokens[i].token] = tokens[i].amount.toString()
        }
    },

    setHistory: (network, publicKey, history) => {
        globalState.state[network].history[publicKey] = history
    },

    updateBalances: (network) => {
        return new Promise(resolve => {
            Object.keys(globalState.state[network].balances)
                .map(el => {
                    apiController.getBalanceAll(el)
                        .then(data => {
                            globalState.setBalanceData(network, el, data)
                        })
                })
            resolve()
        })
    },

    updateBalance: (network, publicKey) => {

        return new Promise(resolve => {

            globalState.state[network] = globalState.state[network] ? globalState.state[network] : {
                balances: {},
                tokens: {},
                tickers: {},
                history: {},
                posList:{},
                pos:{}
            }
            globalState.state[network].tokens[publicKey] = globalState.state[network].tokens[publicKey] ? globalState.state[network].tokens[publicKey] : {}

            globalState.state[network].balances[publicKey] = globalState.state[network].balances[publicKey] ? globalState.state[network].balances[publicKey] : {}

            apiController.getBalanceAll(publicKey)
                .then(data => {
                    globalState.setBalanceData(network, publicKey, data)
                    resolve()
                })
        })


    },

    setPublicKey: (network, publicKey, all = false) => {


        return new Promise(resolve => {

            globalState.state[network] = globalState.state[network] ? globalState.state[network] : {
                balances: {},
                tokens: {},
                tickers: {},
                history: {},
                posList:{},
                pos:{}
            }
            globalState.state[network].tokens[publicKey] = globalState.state[network].tokens[publicKey] ? globalState.state[network].tokens[publicKey] : {}

            globalState.state[network].balances[publicKey] = globalState.state[network].balances[publicKey] ? globalState.state[network].balances[publicKey] : {}

            all ? globalState.updateBalances(network)
                .then(() => resolve()) : globalState.updateBalance(network, publicKey)
                .then(() => resolve())
        })
    },

    setPosList: (network, posList) => {
        return new Promise((resolve, reject)=>{
            globalState.state[network] = globalState.state[network] ? globalState.state[network] : {
                balances: {},
                tokens: {},
                tickers: {},
                history: {},
                posList:{},
                pos:{}
            }
            if(globalState.state[network].posList === undefined){
                globalState.state[network].posList = []
            }
            globalState.state[network].posList = posList

            resolve()
        });
    },

    setPosAccount: (network, publicKey, pos) => {
        return new Promise((resolve, reject)=>{
            globalState.state[network] = globalState.state[network] ? globalState.state[network] : {
                balances: {},
                tokens: {},
                tickers: {},
                history: {},
                posList:{},
                pos:{}
            }
            if(globalState.state[network].pos === undefined){
                globalState.state[network].pos = {}
            }
            globalState.state[network].pos[publicKey] = pos

            resolve()
        });
    },

    updatePosList: (network)=>{
        return new Promise((resolve, reject)=>{
            apiController.getPosListAll()
                .then(list => {
                    globalState.setPosList(network, list).then(()=>{
                        resolve()
                    }).catch(err=>{
                        console.error(err)
                        reject()
                    })
                })
                .catch(err=>{
                    console.error(err)
                    reject(err)
                })
        })
    },
    updatePosAccount: (network, publicKey)=>{
        return new Promise((resolve, reject)=>{
            apiController.getAccountDelegates(publicKey)
                .then(accountPos => {
                    globalState.setPosAccount(network, publicKey, accountPos)
                        .then(()=>{
                            resolve();
                        })
                        .catch(err=>{
                            console.error(err)
                            reject()
                        })
                })
                .catch(err=>{
                    console.error(err)
                    reject(err)
                })
        })
    },


    // GET STATE

    getNetworkState: (network) => {
        // console.log(globalState.state[network])
        let networkState
        if (globalState.state[network] && globalState.state[network].balances) {
            networkState = globalState.state[network]
        } else {
            networkState = {...baseNetwork}
            console.log(globalState)
            console.log(baseNetwork)
            globalState.state[network] = networkState
        }
        // console.log(networkState)
        return networkState
    },

    getTokenBalance: (network, publicKey, tokenHash) => {
        let tokens = []
        let stateTokens = globalState.getNetworkState(network).tokens
        // console.log(stateTokens)
        if (stateTokens[publicKey]) {
            tokens = stateTokens[publicKey]
        }

        let globalStateTokenBalance = tokens.find(token => token.token === tokenHash) || {amount: 0, ticker: '', decimal: 10}
        // console.log(globalStateTokenBalance)
        let globalStateTokenObject = {
            amount: globalStateTokenBalance.amount,
            ticker: globalStateTokenBalance.ticker,
            decimal: globalStateTokenBalance.decimals,
            // usd: globalStateTokenBalance.usd,
        }

        // console.log(globalStateBalancesObject)

        return globalStateTokenObject
    },

    getPosList: (network) => {
        let posList = globalState.state[network].posList !== undefined ? globalState.state[network].posList : []
        return posList
    },
    getPosAccount: (network, publicKey) => {
        let pos = globalState.state[network].pos !== undefined ? globalState.state[network].pos : {}
        let globalStatePos = pos[publicKey] !== undefined ? pos[publicKey] : []

        return globalStatePos
    },
}

let saveActive = false
let time = 200

let globalStateVersion = 1

export {globalState, globalStateVersion}
