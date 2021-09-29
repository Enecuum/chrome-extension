import React from 'react'
import {render} from 'react-dom'
import App from "./App";
import Analytics from "./elements/Analytics";

import styles from './css/stars.css'
import {createLinks, createResizeWatcher, createSpace} from "./Space";

export async function initApp(background) {

    render(
        <div>
            <App background={background}/>
            <Analytics/>
        </div>,
        document.getElementById('app')
    );

    // Web desktop init
    if (chrome.runtime.getManifest().version.endsWith('web')) {
        createSpace()
        createLinks()
        createResizeWatcher()
    }
}
