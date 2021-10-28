const bip39 = require("bip39");
const bip32 = require("bip32");
let regexData = /^[0-9a-zA-Z _\-/.]{0,512}$/
let regexAddress = /^(02|03)[0-9a-fA-F]{64}$/
let regexToken = /^[0-9a-fA-F]{64}$/
// TODO
// let regexSeed = /^[a-f, ]+$/
let regexSeed = /^(\w+\s){11,}\w+$/

let mnemonicPath = "m/44'/2045'/0'/0"

let getMnemonicFirstPrivateKey = (mnemonicString, i = 0) => {
    let hex = bip39.mnemonicToSeedSync(mnemonicString)
    let node = bip32.fromSeed(hex, null)
    let child = node.derivePath(mnemonicPath)
    return child.derive(i).privateKey.toString('hex')
}

let getMnemonicPrivateKeyHex = (seed, i) => {
    let node = bip32.fromSeed(Buffer.from(seed), null)
    let child = node.derivePath(mnemonicPath)
    return child.derive(i).privateKey.toString('hex')
}

let getMnemonicHex = (mnemonicString) => {
    return bip39.mnemonicToSeedSync(mnemonicString)
}

const shortHash = (address) => {
    return address.substring(0, 5) + '...' + address.substring(address.length - 3, address.length)
}

const shortHashLong = (address) => {
    return address.substring(0, 15) + '...' + address.substring(address.length - 10, address.length)
}

const explorerTX = (hash) => {
    openTab('tx', hash)
}

const explorerAddress = (hash) => {
    openTab('account', hash)
}

const openTab = (path, hash) => {
    if (ENQWeb.Net.currentProvider.includes('http'))
        chrome.tabs.create({url: ENQWeb.Net.currentProvider + '/#!/' + path + '/' + hash})
    else
        chrome.tabs.create({url: 'https://' + ENQWeb.Net.currentProvider + '.enecuum.com/#!/' + path + '/' + hash})
}

let test = () => {
    // localNetworks.find(element => element.host === ENQWeb.Net.currentProvider) ?
    //     localNetworks.find(element => element.host === ENQWeb.Net.currentProvider).name :
    //     net.replace('https://', '').replace('http://', '').toUpperCase()
}

//TODO
let icons = {}
const generateIcon = (token) => {
    if (icons[token])
        return icons[token]

    let canvas = document.createElement("canvas")
    canvas.width = 20
    canvas.height = 20
    let ctx = canvas.getContext('2d')
    generateSegment(ctx, hashStringToColor(token.substring(token.length * 2 / 3, token.length)), 20)
    generateSegment(ctx, hashStringToColor(token.substring(token.length / 3, token.length * 2 / 3)), 10)
    generateSegment(ctx, hashStringToColor(token.substring(0, token.length / 3)), 5)
    let url = canvas.toDataURL()
    icons[token] = url
    return url;
}

const generateSegment = (ctx, color, move) => {
    // console.log(color)
    ctx.beginPath()
    ctx.rect(0, 0, move, 20)
    ctx.fillStyle = color
    ctx.fill()
}

function djb2(str) {
    let hash = 5381
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) + hash) + str.charCodeAt(i); /* hash * 33 + c */
    }
    return hash
}

function hashStringToColor(token) {
    let hash = djb2(token)
    let r = (hash & 0xFF0000) >> 16
    let g = (hash & 0x00FF00) >> 8
    let b = hash & 0x0000FF;
    return "#" + ("0" + r.toString(16)).substr(-2) + ("0" + g.toString(16)).substr(-2) + ("0" + b.toString(16)).substr(-2);
}

function toggleFullScreen() {
    console.log('toggleFullScreen')
    if (!document.fullscreenElement) {
        // document.documentElement.requestFullscreen().then()
        document.documentElement.requestFullscreen({navigationUI: "hide"}).then()
        // document.getElementById('app').requestFullscreen({navigationUI: "hide"}).then()
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen().then();
        }
    }
}


module.exports = {
    shortHash,
    shortHashLong,
    explorerTX,
    explorerAddress,
    toggleFullScreen,
    generateIcon,
    regexData,
    regexAddress,
    regexToken,
    regexSeed,
    mnemonicPath,
    getMnemonicFirstPrivateKey,
    getMnemonicPrivateKeyHex,
    getMnemonicHex
}
