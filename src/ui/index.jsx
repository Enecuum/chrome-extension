import React from 'react'
import {createRoot} from 'react-dom/client'
import App from "./App";
import Analytics from "./elements/Analytics";

import styles from './css/stars.css'
import {createDisclaimer, createResizeWatcher, createSpace} from "./Space";
import {versions} from "../utils/names";

export async function initApp(background) {

    const root = createRoot(document.getElementById('app'))
    root.render(
        <div>
            <App background={background}/>
            <Analytics/>
        </div>,
    )

    // Web desktop init
    if (chrome.runtime.getManifest().version.includes(versions.WEB)) {
        createSpace()
        createDisclaimer()
        createResizeWatcher()
    }
}
