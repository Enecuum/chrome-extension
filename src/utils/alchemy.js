import { Alchemy, Network } from 'alchemy-sdk'

let publicKey = '0x86E3d1727E5Ef1b5751De64999861B7239C3cDa6'
let API_KEY = 'wJ9urj6M19ohOtxIX8yfBPl5KFW5WTgf'



const settings = {
    apiKey: API_KEY, // Replace with your Alchemy API key.
    network: Network.ETH_GOERLI // Replace with your network.
}

const alchemy = new Alchemy(settings)

const latestBlock = alchemy.core.getBlockNumber()
latestBlock.then(block => {
    console.log('Ethereum block number')
    console.log(block)
})


export const getBalanceAllAlchemy = () => {
    alchemy.core.getTokenBalances(publicKey).then(console.log)
    alchemy.core.getTokensForOwner(publicKey).then(console.log)
    alchemy.core.getBalance(publicKey).then(value => {
        console.log(value.toString())
    })
}