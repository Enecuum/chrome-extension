let trustedTokens = [{
    "chainId": 1,
    "address": "0000000000000000000000000000000000000000000000000000000000000001",
    "name": "BIT",
    "symbol": "BIT",
    "decimals": 10,
    "logoURI": "https://bit.enecuum.com/info/token/logo/bit/bit-black.png"
}, {
    "chainId": 0,
    "address": "0000000000000000000000000000000000000000000000000000000000000000",
    "name": "ENQ",
    "symbol": "ENQ",
    "decimals": 10,
    "logoURI": "https://pulse.enecuum.com/info/token/logo/enq/enq-color.png"
}, {
    "chainId": 1,
    "address": "824e7b171c01e971337c1b25a055023dd53c003d4aa5aa8b58a503d7c622651e",
    "name": "ENX",
    "symbol": "ENX",
    "decimals": 10,
    "logoURI": "https://bit.enecuum.com/info/token/logo/bit/ENEX-orange.svg"
}]

let tokenList = {
    "name": "Enecuum Default",
    "timestamp": "2022-12-21T13:29:14.043Z",
    "version": {
        "major": 1,
        "minor": 0,
        "patch": 0
    },
    "keywords": [
        "enecuum",
        "default"
    ],
    tokens: trustedTokens,
}

console.log(tokenList)

// trustedTokens = []

module.exports = trustedTokens