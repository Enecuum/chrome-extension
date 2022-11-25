import trustedTokens from "./tokenList";

let cacheTokenInfo = {}
let cacheTransactions = {}
let cacheAccountTransactions = {}

const sendAPI = async (api, fields) => {
    return await ENQWeb.Enq.sendAPI(api, fields)
}

const sendTransaction = async (transactionString) => {
    return await ENQWeb.Enq.sendTx(transactionString)
}

const sendRequest = async (url, method, fields) => {
    return await ENQWeb.Enq.sendRequest(url, method, fields)
}

const postTransaction = async (transactionObject) => {
    return await ENQWeb.Net.post.tx_fee_off(transactionObject)
        .catch(e => {
            console.warn(e)
        })
}

const getBalanceAll = async (publicKey) => {
    return await ENQWeb.Net.get.balance_all_unfiltered(publicKey)
}

const getMainTokenBalance = async (publicKey) => {
    return await getBalance(publicKey, ENQWeb.Enq.token[ENQWeb.Enq.provider])
}

const getRewards = async (publicKey) => {
    // let response = await fetch(ENQWeb.Net.provider + '/api/v1/account_rewards?id=' + publicKey + '&page=0', {})
    return await ENQWeb.Net.get.account_rewards(publicKey)
}

// Need caching here with balance
const getCurrentBlock = async () => {
    let height = (await ENQWeb.Net.get.height()).height
    let macroBlock = await ENQWeb.Net.get.macroblockByHeight(height)
    return {
        n: macroBlock.kblock.n,
        time: macroBlock.kblock.time
    }
}

const getTokenInfo = async (tokenHash) => {
    if (!cacheTokenInfo[ENQWeb.Enq.provider]) {
        cacheTokenInfo[ENQWeb.Enq.provider] = {}
    }
    if (!cacheTokenInfo[ENQWeb.Enq.provider][tokenHash]) {
        cacheTokenInfo[ENQWeb.Enq.provider][tokenHash] = await ENQWeb.Net.get.token_info(tokenHash)
    }
    return cacheTokenInfo[ENQWeb.Enq.provider][tokenHash]
}

const getAccountTransactions = async (publicKey, page, fromCache = false) => {
    if (!fromCache) {
        return await ENQWeb.Net.get.accountTransactions(publicKey, page)
    }
    if (!cacheAccountTransactions[ENQWeb.Enq.provider]) {
        cacheAccountTransactions[ENQWeb.Enq.provider] = {}
    }
    if (!cacheAccountTransactions[ENQWeb.Enq.provider][publicKey]) {
        cacheAccountTransactions[ENQWeb.Enq.provider][publicKey] = {}
    }
    if (!cacheAccountTransactions[ENQWeb.Enq.provider][publicKey][page]) {
        cacheAccountTransactions[ENQWeb.Enq.provider][publicKey][page] = await ENQWeb.Net.get.accountTransactions(publicKey, page)
    }
    return cacheAccountTransactions[ENQWeb.Enq.provider][publicKey][page]
}

const getBalance = async (publicKey, tokenHash) => {
    return await ENQWeb.Net.get.getBalance(publicKey, tokenHash)
}

const getTransaction = async (transactionHash) => {
    if (!cacheTransactions[ENQWeb.Enq.provider]) {
        cacheTransactions[ENQWeb.Enq.provider] = {}
    }
    if (!cacheTransactions[ENQWeb.Enq.provider][transactionHash]) {
        cacheTransactions[ENQWeb.Enq.provider][transactionHash] = await ENQWeb.Net.get.tx(transactionHash)
    }
    return cacheTransactions[ENQWeb.Enq.provider][transactionHash]
}

const getTokenList = () => {

    // let serverTokens = await ENQWeb.Net.get.tokenList()

    return trustedTokens
}

const getCoinGeckoPrice = async () => {
    return apiController.sendRequest('https://api.coingecko.com/api/v3/simple/price?ids=enq-enecuum&vs_currencies=USD')
        .then((answer) => {
            if (answer['enq-enecuum'] !== undefined) {

                return answer['enq-enecuum'].usd
            }
        })
}

const getAllTokens = async () => {
    // console.log(ENQWeb.Enq.token)
    // let response = await fetch(ENQWeb.Enq.provider + '/api/v1/get_tickers_all', {})
    return await ENQWeb.Net.get.get_tickers_all_unfiltered()
}

const apiController = {
    getBalance,
    getBalanceAll,
    getMainTokenBalance,
    getRewards,
    getCurrentBlock,
    getTokenInfo,
    getAccountTransactions,
    getTransaction,
    getTokenList,
    sendTransaction,
    sendAPI,
    sendRequest,
    postTransaction,
    getAllTokens,
    getCoinGeckoPrice,
    cacheTransactions,
    cacheTokenInfo,
    cacheAccountTransactions
}

export { apiController }
