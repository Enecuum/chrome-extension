import React from 'react'
import {render} from 'react-dom'
import App from "./App";
import Analytics from "./elements/Analytics";

import styles from './css/stars.css'

export async function initApp(background) {

    const createSpace = () => {

        let spaceSize = 100

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
        }, 5000);
    }

    render(
        <div>
            <App background={background}/>
            <Analytics/>
        </div>,
        document.getElementById('app')
    );

    if (chrome.runtime.getManifest().version.endsWith('web'))
        createSpace()

    let resizeTimeout
    window.onresize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(createSpace, 1000);
    }
}
