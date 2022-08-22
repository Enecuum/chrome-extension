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
}

let save_active = false
let time = 200

let globalStateVersion = 1

export { globalState, globalStateVersion }
