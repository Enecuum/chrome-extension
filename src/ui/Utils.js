const shortHash = (address) => {
    return address.substring(0, 5) + '...' + address.substring(address.length - 3, address.length)
}

const shortHashLong = (address) => {
    return address.substring(0, 15) + '...' + address.substring(address.length - 10, address.length)
}

const explorerTX = (hash) => {
    // console.log('open explorer')
    chrome.tabs.create({url: 'https://' + ENQWeb.Net.currentProvider + '.enecuum.com/#!/tx/' + hash})
}

const explorerAddress = (hash) => {
    // console.log('open explorer')
    chrome.tabs.create({url: 'https://' + ENQWeb.Net.currentProvider + '.enecuum.com/#!/account/' + hash})
}
const explorerLink = (hash) => {
    // console.log('open explorer')
    return 'https://' + ENQWeb.Net.currentProvider + '.enecuum.com/#!/tx/' + hash
}

const generateIcon = (token) => {
    console.log(token)
    let canvas = document.createElement("canvas")
    canvas.width = 20
    canvas.height = 20
    let ctx = canvas.getContext('2d')
    generateSegment(ctx, hashStringToColor(token.substring(token.length*2/3, token.length)), 20)
    generateSegment(ctx, hashStringToColor(token.substring(token.length/3, token.length*2/3)), 10)
    generateSegment(ctx, hashStringToColor(token.substring(0, token.length/3)), 5)
    let url = canvas.toDataURL()
    return url;
}

const generateSegment = (ctx, color, move) => {
    console.log(color)
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

module.exports = {
    shortHash,
    shortHashLong,
    explorerTX,
    explorerAddress,
    explorerLink,
    generateIcon
}
