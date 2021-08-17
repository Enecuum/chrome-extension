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
    generateSegment(ctx, hashStringToColor(token.substring(0, token.length/2)), 0)
    generateSegment(ctx, hashStringToColor(token.substring(token.length/2, token.length)), 10)
    let url = canvas.toDataURL()
    return url;
}

const generateSegment = (ctx, color, move) => {
    console.log(color)
    ctx.beginPath()
    ctx.rect(0 + move, 0, 10 + move, 20)
    ctx.fillStyle = color
    ctx.fill()
}

function djb2(str){
    var hash = 5381;
    for (var i = 0; i < str.length; i++) {
        hash = ((hash << 5) + hash) + str.charCodeAt(i); /* hash * 33 + c */
    }
    return hash;
}

function hashStringToColor(token) {
    var hash = djb2(token)
    var r = (hash & 0xFF0000) >> 16;
    var g = (hash & 0x00FF00) >> 8;
    var b = hash & 0x0000FF;
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
