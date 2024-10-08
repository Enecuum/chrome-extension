const bip39 = require("bip39");
const bip32 = require("bip32");

const {Clipboard} = require("@capacitor/clipboard");
const {LocalNotifications} = require("@capacitor/local-notifications");
const trustedTokens = require("../utils/tokenList");
const {apiController} = require("../utils/apiController");

let regexData = /^[0-9a-zA-Z _\-/.]{0,512}$/
let regexAddress = /^(02|03)[0-9a-fA-F]{64}$/
let regexToken = /^[0-9a-fA-F]{64}$/

let regexOldPrivate = /^00[0-9a-fA-F]{64}$/
let regexReferral = /^(ref_)[0-9a-fA-F]{66}$/
// TODO
// let regexSeed = /^[a-f, ]+$/
let regexSeed = /^(\w+\s){11,}\w+$/

// TODO is Enecuum address
let mnemonicPath = "m/44'/2045'/0'/0"

// TODO is Ethereum address
let ethMnemonicPath = "m/44'/2045'/0'/0"

let ledgerPath = "44'/60'/0'/0/"

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

const explorerPos = (hash) => {
    openTab('pos-contract', hash)
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

let getIcons = (tokens = trustedTokens) => {
    let icons = {
        '0000000000000000000000000000000000000000000000000000000000000000': './images/enq.png',
        '0000000000000000000000000000000000000000000000000000000000000001': './images/bit.png',
        '824e7b171c01e971337c1b25a055023dd53c003d4aa5aa8b58a503d7c622651e': './images/enex.png',
    }

    // console.log(trustedTokens)

    tokens.map((tokenObject) => {
        icons[tokenObject.address] = tokenObject.logoURI
    })

    return icons
}

let icons = getIcons()

apiController.getServerTokenList().then(tokens => {
    icons = getIcons(tokens)
    // console.warn(icons)
})

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
        document.documentElement.requestFullscreen({navigationUI: "hide"}).then()
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen().then();
        }
    }
}

const copyToClipboard = (text) => {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(r => {})
    } else {
        console.error('navigator.clipboard: ' + false)
    }
    Clipboard.write({string: text}).then(r => {})
}

const createInternalTx = (tx)=>{
    let sendObj = {
        tx:tx,
        type:"tx",
        cb:{
            taskId:ENQWeb.Net.provider+"/tx/"+Math.floor(Math.random()*1e10),
            url:ENQWeb.Net.provider
        },
        data:{
            fee_use:false,
            fee_value:"",
            net:ENQWeb.Net.provider,
            date:Date.now(),
            internal:true
        }
    }
    return sendObj
}


let id = 0

const showNotification = (title, text) => {

    if (LocalNotifications)
        LocalNotifications.schedule({
            notifications: [{
                title: title,
                body: text,
                id: id++,
                // schedule: {at: new Date(Date.now())},
                sound: null,
                attachments: null,
                actionTypeId: "",
                extra: null
            }]
        });

    // if (chrome.notifications)
    //     try {
    //         chrome.notifications.create(id, {
    //             type: 'basic',
    //             iconUrl: 'images/enq.png',
    //             title: title,
    //             message: text,
    //             priority: 2
    //         })
    //     } catch (e) {
    //         console.warn(e)
    //     }

}

const DEFAULT_REFERRAL = 'ref_7690e00108860ff3daf4d860a19f2b8e2a03d88c5d433fe440dd530cbd0552e437'
const REF_PREFIX = 'ref_'
const XOR_STRING = "750D7F2B34CA3DF1D6B7878DEBC8CF9A56BCB51A58435B5BCFB7E82EE09FA8BE75"

function xor(hex1, hex2) {
    const buf1 = Buffer.from(hex1, 'hex');
    const buf2 = Buffer.from(hex2, 'hex');
    const bufResult = buf1.map((b, i) => b ^ buf2[i]);
    return bufResult.toString('hex');
}

module.exports = {
    shortHash,
    shortHashLong,
    explorerTX,
    explorerAddress,
    explorerPos,
    toggleFullScreen,
    generateIcon,
    copyToClipboard,
    regexData,
    regexAddress,
    regexToken,
    regexOldPrivate,
    regexSeed,
    regexReferral,
    mnemonicPath,
    ledgerPath,
    getMnemonicFirstPrivateKey,
    getMnemonicPrivateKeyHex,
    getMnemonicHex,
    showNotification,
    xor,
    DEFAULT_REFERRAL,
    REF_PREFIX,
    XOR_STRING,
    createInternalTx
}
