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

function toggleFullScreen() {
    console.log('toggleFullScreen')
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().then();
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
    explorerLink,
    toggleFullScreen
}
