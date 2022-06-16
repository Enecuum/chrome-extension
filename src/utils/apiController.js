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
    return await ENQWeb.Net.get.getBalanceAll(publicKey)
}

const getMainTokenBalance = async (publicKey) => {
    return await getBalance(publicKey, ENQWeb.Enq.token[ENQWeb.Enq.provider])
}

const getRewards = async (publicKey) => {
    let response = await fetch('https://bit.enecuum.com/api/v1/account_rewards?id=' + publicKey + '&page=0', {})
    return response.json()
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

const apiController = {
    getBalance,
    getBalanceAll,
    getMainTokenBalance,
    getRewards,
    getCurrentBlock,
    getTokenInfo,
    getAccountTransactions,
    getTransaction,
    sendTransaction,
    sendAPI,
    sendRequest,
    postTransaction,
    cacheTransactions,
    cacheTokenInfo,
    cacheAccountTransactions
}

export { apiController }
