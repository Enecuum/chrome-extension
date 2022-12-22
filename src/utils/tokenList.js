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
}, {
    "chainId": 0,
    "address": "74c994dcf17ff31ad840299cf2cfb69eb3a1035334a929bd955a8f193b19d510",
    "name": "FB",
    "symbol": "FB",
    "decimals": 10,
    "logoURI": ""
}, {
    "chainId": 0,
    "address": "dcc4c5b656f476930cb00de7ceaa6f3b7f819f9e0f84d63b5eeb1d8940de3ebb",
    "name": "BGF",
    "symbol": "BGF",
    "decimals": 10,
    "logoURI": "https://pulse.enecuum.com/info/token/logo/enq/BGF.jpg"
}, {
    "chainId": 0,
    "address": "5e2e20ac96fd2ec76bf31dd16f40a7c24016ed3d1b0ff9eb0685498f810778ec",
    "name": "BANT",
    "symbol": "BANT",
    "decimals": 10,
    "logoURI": ""
}, {
    "chainId": 0,
    "address": "9c01bb29c859aa01708674dd06be16dd7be6d5855b969d0e575cd884a0fd3816",
    "name": "SMT",
    "symbol": "SMT",
    "decimals": 10,
    "logoURI": ""
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