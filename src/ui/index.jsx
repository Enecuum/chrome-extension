import React from 'react'
import {render} from 'react-dom'
import App from "./App";

export async function initApp(background) {
    render(
        <App background={background}/>,
        document.getElementById('app')
    );
}