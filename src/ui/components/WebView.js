import React, {useState} from "react"
import styles from "../css/index.module.css"
import Separator from "../elements/Separator"
import Header from "../elements/Header"
import {regexSeed} from "../Utils";
import Input from "../elements/Input";

// let defaultUrl = 'http://localhost:1234/#!action=swap'
let defaultUrl = 'https://devapp.enex.space/#!action=swap'
// let defaultUrl = 'http://95.216.207.173:9990/testing1'

export default function WebView(props) {

    let account = props.user

    let [url, setUrl] = useState(defaultUrl)

    let [connect, setConnect] = useState('')

    // let [iframe, setIframe] = useState('')

    let confirm = () => {
    }

    let handleChangeUrl = (e) => {
        setUrl(e.target.value)
    }

    let onMessage = (event) => {
        let data = event.data
        console.warn(event.data)
        if (data.checkConnect !== undefined) {
            event.source.postMessage({'iframe': true}, event.origin)
        }
        if (data.type !== undefined) {
            let response = ''
            switch (data.type) {
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
                    response = {net: ENQWeb.Net.provider}
                } else {
                    response = {net: ENQWeb.Net.currentProvider}
                }
                break
            case 'getVersion':
                response = extensionApi.app.getDetails().version
                break
            case 'balanceOf':
                response = balance
                break
            case 'reconnect':
                response = {status: connect}
                break
            case 'sign':
                break
            default:
                break
            }
            event.source.postMessage({answer: {taskId: data.cb.taskId, data: response}}, event.origin)
        }
    }

    const iframeActivation = ()=>{
        let iframe = document.getElementById('iframe')
        iframe.hidden = false
        iframe.style.zIndex = "2"
        iframe.setAttribute('src', url)
    }

    const iframeDeactivation = ()=>{
        let iframe = document.getElementById('iframe')
        iframe.hidden = true
        iframe.style.zIndex = "-1"
        iframe.setAttribute('src', '')
    }

    // window.addEventListener('message', onMessage, false)

    massageListenerSetup(onMessage)

    return (
        <div className={styles.main}>

            <div>
                <div className={styles.field} onClick={() => {
                    props.setWebView(false)
                    iframeDeactivation()
                }}>❮ Back</div>
            </div>

            {/*<Header clickMenu={() => props.setWebView(false)} user={{}}/>*/}

            {/*<Separator/>*/}

            <Input
                type="text"
                spellCheck={false}
                onChange={handleChangeUrl}
                value={url}
                className={styles.field}
                label={'URL'}
                placeholder={'Place url of DEX here'}
            />

            <div className={styles.dapps}>
                <div onClick={() => setUrl('https://app.enex.space')}>ENEX</div>
                <div onClick={() => setUrl('https://bit-wallet.enecuum.com')}>WALLET</div>
                <div onClick={() => setUrl('https://faucet-bit.enecuum.com')}>FAUCET</div>
                <div onClick={() => {
                }}>SAVE
                </div>

            </div>

            {/*<iframe src={url}/>*/}
            {iframeActivation()}

        </div>
    )
}
