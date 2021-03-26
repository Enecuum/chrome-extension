import React from 'react'
import {render} from 'react-dom'
import Main from "./Main";

function App(background) {
    return <Main background={background}/>
}

export async function initApp(background) {
    render(
        <App background={background}/>,
        document.getElementById('app')
    );
}