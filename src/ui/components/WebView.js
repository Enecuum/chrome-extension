import React from "react";
import styles from "../css/index.module.css";
import Separator from "../elements/Separator";
import Header from "../elements/Header";
import { extensionApi } from '../../utils/extensionApi'
import { apiController } from '../../utils/apiController'


export default function WebView(props) {

    let account = props.user
    let connect = false

    let balance = userStorage.user.getBalance()[account.net][account.publicKey][account.token]

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
                connect = true
                break
            case 'getProvider':
                ENQWeb.Net.provider = account.net
                if (task.cb.fullUrl) {
                    response = { net: ENQWeb.Net.provider }
                } else {
                    response = { net: ENQWeb.Net.currentProvider }
                }
                break
            case 'getVersion':
                response = extensionApi.app.getDetails().version
                break
            case 'balanceOf':
                response = balance
                break
            case 'reconnect':
                response = { status: connect }
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

            <Header clickMenu={() => {
                props.setWebView(false)
            }} user={{}}/>

            {/*<Separator/>*/}

            <iframe id="iframe" src="http://95.216.207.173:9990/testing1"/>

        </div>
    )
}
