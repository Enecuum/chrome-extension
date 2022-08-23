import {apiController} from './utils/apiController'

let globalState = {

    state: {
        network1: {
            balances: {},
            tokens: {},
            tickers: {},
            history: {}
        }
    },

    save: () => {
        return new Promise(resolve => {
            if (!save_active) {
                save_active = true
                userStorage.state.setState(globalState.state)
                save_active = false
                resolve()
            } else {
                let interval = setInterval(() => {
                    if (!save_active) {
                        save_active = true
                        userStorage.state.setState(globalState.state)
                        save_active = false
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
            history: {}
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

    getTokenBalance: (network, publicKey, tokenHash) => {
        console.log(globalState.state[network].tokens[publicKey])
        let globalStateTokenBalance = globalState.state[network].tokens[publicKey].find(token => token.token === tokenHash)
        let globalStateBalancesObject = {
            amount: globalStateTokenBalance.amount + '.0000',
            ticker: globalStateTokenBalance.ticker,
            decimal: globalStateTokenBalance.decimals,
        }

        console.log(globalStateBalancesObject)

        return globalStateBalancesObject
    },

    updateBalance: (network, publicKey) => {

        return new Promise(resolve => {

            globalState.state[network] = globalState.state[network] ? globalState.state[network] : {
                balances: {},
                tokens: {},
                tickers: {},
                history: {}
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
                history: {}
            }
            globalState.state[network].tokens[publicKey] = globalState.state[network].tokens[publicKey] ? globalState.state[network].tokens[publicKey] : {}

            globalState.state[network].balances[publicKey] = globalState.state[network].balances[publicKey] ? globalState.state[network].balances[publicKey] : {}

            all ? globalState.updateBalances(network)
                .then(() => resolve()) : globalState.updateBalance(network, publicKey)
                .then(() => resolve())
        })
    }
}

let save_active = false
let time = 200

let globalStateVersion = 1

export {globalState, globalStateVersion}
