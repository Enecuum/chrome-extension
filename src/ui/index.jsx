import {render} from 'react-dom'
// import App from './App'
import React from "react";

function App(){
    return(
        <div>
            <h1>hello, react</h1>
        </div>
    )
}

export async function initApp(background){
    render(
        <App/>,
        document.getElementById('app-content')
    );
}


