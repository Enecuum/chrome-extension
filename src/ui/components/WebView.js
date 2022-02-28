import React from "react";
import styles from "../css/index.module.css";
import Separator from "../elements/Separator";
import Header from "../elements/Header";


export default function WebView(props) {

    let account = props.user

    let confirm = () => {

    }

    let onMessage = (event)=>{
        let data = event.data
        console.warn(event.data)
        if(data.checkConnect !== undefined){
            event.source.postMessage({'iframe':true}, event.origin)
        }
        if(data.type !== undefined){
            let response = ''
            switch (data.type){
            case 'enable':
                response = {
                    pubkey: account.publicKey,
                    net: account.net,
                }
                break
            case 'getProvider':
                break
            case 'getVersion':
                break
            case 'balanceOf':
                break
            case 'reconnect':
                break
            case 'sign':
                break
            default:
                break
            }
            event.source.postMessage({answer:{taskId:data.cb.taskId, data:response}}, event.origin)
        }
    }

    window.addEventListener('message', onMessage, false)

    return (
        <div className={styles.main}>

            {/*<div onClick={() => props.setWebView(false)}*/}
            {/*     className={styles.field + ' ' + styles.button}>Back</div>*/}

            <Header clickMenu={() => props.setWebView(false)} user={{}}/>

            {/*<Separator/>*/}

            <iframe id="iframe" src="http://localhost:1234"/>

        </div>
    )
}
