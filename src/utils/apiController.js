const sendAPI = async (api, fields) => {
    return await ENQWeb.Enq.sendAPI(api, fields)
}
const sendTX = async (tx) => {
    return await ENQWeb.Enq.sendTx(tx)
}
const sendRequest = async (url, method, fields) => {
    return await ENQWeb.Enq.sendRequest(url, method, fields)
}


const getBalanceAll = async (publicKey) => {
    return await ENQWeb.Net.get.getBalanceAll(publicKey)
}
const getTokenInfo = async (tokenHash) => {
    return await ENQWeb.Net.get.token_info(hash)
}
const getAccountTransactions = async (publicKey, page) => {
    return await ENQWeb.Net.get.accountTransactions(publicKey, page)
}
const getBalance = async (publicKey, tokenHash) => {
    return await ENQWeb.Net.get.getBalance(publicKey, tokenHash)
}
const getTransaction = async (hash) => {
    return await ENQWeb.Net.get.tx(hash)
}

const apiController = {
    getBalance,
    getBalanceAll,
    getTokenInfo,
    getAccountTransactions,
    getTransaction,
    sendTX,
    sendAPI,
    sendRequest
}

export { apiController }
