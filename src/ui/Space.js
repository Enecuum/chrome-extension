let timeout = 5000
let spaceSize = 100

const createSpace = () => {

    console.log('Create space background')
    let windowWidth = window.innerWidth
    let windowHeight = window.innerHeight
    const spaceDiv = document.getElementById('space') ? document.getElementById('space') : document.createElement('div')
    spaceDiv.innerHTML = ''
    spaceDiv.id = 'space'
    document.body.append(spaceDiv)

    let starWidth = Math.floor(Math.random() * 2 + 1)
    // let strHeight = starWidth

    for (let i = 0; i < spaceSize; i++) {

        let left = Math.floor(Math.random() * windowWidth)
        let top = Math.floor(Math.random() * windowHeight)

        const starDiv = document.createElement('div')
        starDiv.className = 'star'
        starDiv.style.left = left + 'px'
        starDiv.style.top = top + 'px'
        starDiv.style.width = starWidth + 'px'
        starDiv.style.height =  starWidth + 'px'
        starDiv.style.opacity = 0.5
        spaceDiv.append(starDiv)
    }

    setInterval(() => {
        let starDiv = spaceDiv.children[Math.floor(Math.random() * spaceSize)]
        let starWidth = Math.floor(Math.random() * 3 + 1)
        starDiv.style.opacity = 1
        starDiv.style.width = starWidth + 'px'
        starDiv.style.height =  starWidth + 'px'

        let left = Math.floor(Math.random() * windowWidth)
        let top = Math.floor(Math.random() * windowHeight)
        starDiv.style.left = left + 'px'
        starDiv.style.top = top + 'px'
    }, timeout);
}

const createDisclaimer = () => {

    const linksDiv = document.createElement('div')
    linksDiv.id = 'leftLinks'
    linksDiv.innerHTML = ''
    linksDiv.innerHTML += '<div id="leftLinksTitle">DISCLAIMER</div>'
    linksDiv.innerHTML += '<div id="leftLinksText">This is a test web wallet and is NOT intended for production usage. Please do not use mainnet private info (keys, seed phrases) with this version. Please, use the following apps.</div>'
    linksDiv.innerHTML += '<div><a href="https://chrome.google.com/webstore/detail/enecuum/oendodccclbjedifljnlkapjejklgekf?hl=en" target="_blank">Chrome Extension</div>'
    linksDiv.innerHTML += '<div><a href="https://testflight.apple.com/join/EhGhg78t" target="_blank">iOS</a> / <a href="https://play.google.com/store/apps/details?id=com.enecuum.wallet" target="_blank">Android</a> / <a href="/android" target="_blank">Android APK</a></div>'
    linksDiv.innerHTML += '<div><a href="/mac" target="_blank">macOS</a> / <a href="/win" target="_blank">Win</a> / <a href="/linux" target="_blank">Linux</a></div>'
    linksDiv.innerHTML += '<div id="leftLinksTextBottom">' + chrome.runtime.getManifest().version + ' ' + VERSION + '</div>'
    // linksDiv.innerHTML += '<div><a href="/electron" target="_blank">Electron Desktop Application</div>'
    // linksDiv.innerHTML += '<div><a href="/pwa" target="_blank">Progressive Web Mobile Application</a></div>'
    // linksDiv.innerHTML += '<div><a href="/pwa" target="_blank">Progressive Web Desktop Application</a></div>'
    linksDiv.onclick = () => {
        linksDiv.style.opacity = 0.3
    }
    document.body.append(linksDiv)
}

let resizeTimeout
const createResizeWatcher = () => {
    // Update stars after resize
    window.onresize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(createSpace, 1000);
    }
}

module.exports = {
    createSpace,
    createDisclaimer,
    createResizeWatcher
}
