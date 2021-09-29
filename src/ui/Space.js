let timeout = 5000
let spaceSize = 100

const createSpace = () => {

    console.log('Create space')
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

const createLinks = () => {

    const linksDiv = document.createElement('div')
    linksDiv.id = 'leftLinks'
    linksDiv.innerHTML = ''
    linksDiv.innerHTML += '<div id="leftLinksTitle">DISCLAIMER</div>'
    linksDiv.innerHTML += '<div id="leftLinksText">This is a test web wallet and is NOT intended for productions useage. Please do not use mainnet private info (keys, seed phrases) with this verstion. Transaction signature is disabled for security reasons. Please, use the following apps.</div>'
    linksDiv.innerHTML += '<div>1. <a href="https://chrome.google.com/webstore/detail/enecuum/oendodccclbjedifljnlkapjejklgekf?hl=en" target="_blank">Chrome Extension</div>'
    linksDiv.innerHTML += '<div>2. <a href="/electron" target="_blank">Electron Application for desktop</div>'
    linksDiv.innerHTML += '<div>3. <a href="/android" target="_blank">Android Application</a></div>'
    linksDiv.innerHTML += '<div>4. <a href="/pwa" target="_blank">Progressive Web Application Mobile</a></div>'
    linksDiv.innerHTML += '<div>5. <a href="/pwa" target="_blank">Progressive Web Application Desktop</a></div>'
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
    createLinks,
    createResizeWatcher
}
