import React from 'react'
import {render} from 'react-dom'
import App from "./App";
import Analytics from "./elements/Analytics";

export async function initApp(background) {
    render(
        <div>
            <App background={background}/>
            <Analytics/>
        </div>,
        document.getElementById('app')
    );
}
