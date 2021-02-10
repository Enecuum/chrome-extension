import {render} from 'react-dom'
// import App from './App'
import React from "react";

function App(){
    return (
        <div>
            <h1>hi, new react</h1>
        </div>
    )
}

export async function initApp(){
    render(
        <App/>,
        document.getElementById('app-content')
    );
}


