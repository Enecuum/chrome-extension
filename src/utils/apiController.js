import trustedTokens from "./tokenList";
import {getBalanceAllAlchemy} from "./alchemy";

let cacheTokenInfo = {}
let cacheTransactions = {}
let cacheAccountTransactions = {}

const sendAPI = async (api, fields) => {
    console.log('API 1')
    return await ENQWeb.Enq.sendAPI(api, fields)
}

const sendTransaction = async (transactionString) => {
    console.log('API 2')
    return await ENQWeb.Enq.sendTx(transactionString)
}

const sendRequest = async (url, method, fields) => {
    console.log('API 3: ' + url)
    return await ENQWeb.Enq.sendRequest(url, method, fields)
}

const postTransaction = async (transactionObject) => {
    console.log('API 4')
    return await ENQWeb.Net.post.tx_fee_off(transactionObject)
        .catch(e => {
            console.warn(e)
        })
}

const getBalanceAll = async (publicKey) => {
    console.log('API 5 balance')

    getBalanceAllAlchemy(publicKey)

    return await ENQWeb.Net.get.balance_all_unfiltered(publicKey)
}

const getMainTokenBalance = async (publicKey) => {
    console.log('API 6')
    return await getBalance(publicKey, ENQWeb.Enq.token[ENQWeb.Enq.provider])
}

const getRewards = async (publicKey) => {
    console.log('API 7')
    // let response = await fetch(ENQWeb.Net.provider + '/api/v1/account_rewards?id=' + publicKey + '&page=0', {})
    return await ENQWeb.Net.get.account_rewards(publicKey)
}

// Need caching here with balance
const getCurrentBlock = async () => {
    console.log('API 8 block')
    let height = (await ENQWeb.Net.get.height()).height
    let macroBlock = await ENQWeb.Net.get.macroblockByHeight(height)
    return {
        n: macroBlock.kblock.n,
        time: macroBlock.kblock.time
    }
}

const getTokenInfo = async (tokenHash) => {
    console.log('API 9 token info')
    if (!cacheTokenInfo[ENQWeb.Enq.provider]) {
        cacheTokenInfo[ENQWeb.Enq.provider] = {}
    }
    if (!cacheTokenInfo[ENQWeb.Enq.provider][tokenHash]) {
        cacheTokenInfo[ENQWeb.Enq.provider][tokenHash] = await ENQWeb.Net.get.token_info(tokenHash)
    }
    return cacheTokenInfo[ENQWeb.Enq.provider][tokenHash]
}

const getAccountTransactions = async (publicKey, page, fromCache = false) => {
    console.log('API 10 transactions ' + page)
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
    console.log('API 11')
    return await ENQWeb.Net.get.getBalance(publicKey, tokenHash)
}

const getTransaction = async (transactionHash) => {
    console.log('API 12')
    if (!cacheTransactions[ENQWeb.Enq.provider]) {
        cacheTransactions[ENQWeb.Enq.provider] = {}
    }
    if (!cacheTransactions[ENQWeb.Enq.provider][transactionHash]) {
        cacheTransactions[ENQWeb.Enq.provider][transactionHash] = await ENQWeb.Net.get.tx(transactionHash)
    }
    return cacheTransactions[ENQWeb.Enq.provider][transactionHash]
}

const getTokenList = () => {
    // console.log('API 13')
    return trustedTokens
}

const getServerTokenList = async () => {

    console.log('API 14 server token list app.enecuum.com')

    // await apiController.sendRequest('https://devapp.enex.space/token_list')

    // console.log('getServerTokenList')

    // console.warn()

    const response = await fetch('https://app.enecuum.com/default_token_list.json', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    })

    const list = await response.json()
    return list.tokens
}

const getCoinGeckoPrice = async () => {
    console.log('API 15 coingecko.com')
    return apiController.sendRequest('https://api.coingecko.com/api/v3/simple/price?ids=enq-enecuum&vs_currencies=USD')
        .then((answer) => {
            if (answer['enq-enecuum'] !== undefined) {

                return answer['enq-enecuum'].usd
            }
        })
}

const getAllTokens = async () => {
    console.log('API 16 tickers')
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
    getServerTokenList,
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
