import React, {useEffect, useState} from 'react'
import styles from "../css/index.module.css"
import Separator from "../elements/Separator"
import Header from "../elements/Header"
import {regexSeed} from "../Utils";
import Input from "../elements/Input";
import { taskHandler, webBackground } from '../../handler'

// let defaultUrl = 'http://localhost:1234/#!action=swap'
let defaultUrl = 'https://devapp.enex.space/#!action=swap'
// let defaultUrl = 'http://95.216.207.173:9990/testing1'

export default function WebView(props) {

    let iframe = document.getElementById('iframe')
    let account = props.user

    let [url, setUrl] = useState(iframe.getAttribute('src') || defaultUrl)

    let [connect, setConnect] = useState('')

    // let [iframe, setIframe] = useState('')

    let confirm = () => {
    }

    let handleChangeUrl = (e) => {
        setUrl(e.target.value)
    }


    const waitingFunction = () => {
        let time = 200
        // props.setBufferMsg(false)
        global.bufferForMsg = false
        return new Promise((resolve, reject) => {
            let a = setInterval(() => {
                if (bufferForMsg !== false) {
                    console.log(bufferForMsg)
                    clearInterval(a)
                    resolve()
                }
            }, time)
        })
    }

    let updateIframeZIndexLock = false

    let connected = {}
    global.connected = connected

    let onMessage = async (event) => {
        setIframeWork(true)
        let sites = await userStorage.sites.getSites()
        let net = account.net
        let data = event.data
        console.warn(event.data)
        if (data.checkConnect !== undefined) {
            event.source.postMessage({'iframe': true}, event.origin)
            updateIframeZIndexLock = false
            setIframeWork(false)
        }

        if (data.type !== undefined) {
            let response = ''
            let check = webBackground(data, net)
            if(check !== true) {
                updateIframeZIndexLock = false
                setIframeWork(false)
                response = {"reject":true,"data":check}
                event.source.postMessage({answer: {taskId: data.cb.taskId, data: response}}, event.origin)
                return false
            }
            updateIframeZIndexLock = true
            switch (data.type) {
                case 'enable':
                    if(global.connected[data.cb.url]){
                        response = JSON.parse((await taskHandler(data.cb.taskId)).data)
                        console.log(response)
                        event.source.postMessage({answer: {taskId: data.cb.taskId, data: response}}, event.origin)
                        updateIframeZIndexLock = false
                        setIframeWork(false)
                    }else{
                        iframe.style.zIndex = "-1"
                        props.setPublicKeyRequest(data)
                        await waitingFunction().then(() => {
                            console.log(bufferForMsg)
                            global.connected[data.cb.url] = true
                            response = JSON.parse(bufferForMsg)
                            event.source.postMessage({answer: {taskId: data.cb.taskId, data: response}}, event.origin)
                            updateIframeZIndexLock = false
                            setIframeWork(false)
                        })
                    }
                    break
                case 'tx':
                    iframe.style.zIndex = "-1"
                    props.setTransactionRequest(data)
                    await waitingFunction().then(() => {
                        console.log(bufferForMsg)
                        response = JSON.parse(bufferForMsg)
                        event.source.postMessage({answer: {taskId: data.cb.taskId, data: response}}, event.origin)
                        updateIframeZIndexLock = false
                        setIframeWork(false)
                    })
                    break
                case 'getProvider':
                    ENQWeb.Net.provider = account.net
                    if (task.cb.fullUrl) {
                        response = {net: ENQWeb.Net.provider}
                    } else {
                        response = {net: ENQWeb.Net.currentProvider}
                    }
                    event.source.postMessage({answer: {taskId: data.cb.taskId, data: response}}, event.origin)
                    updateIframeZIndexLock = false
                    setIframeWork(false)
                    break
                case 'getVersion':
                    response = extensionApi.app.getDetails().version
                    event.source.postMessage({answer: {taskId: data.cb.taskId, data: response}}, event.origin)
                    updateIframeZIndexLock = false
                    setIframeWork(false)
                    break
                case 'balanceOf':
                    response = balance
                    event.source.postMessage({answer: {taskId: data.cb.taskId, data: response}}, event.origin)
                    updateIframeZIndexLock = false
                    setIframeWork(false)
                    break
                case 'reconnect':
                    response = {status: sites[data.cb.url] ? true : global.connected[data.cb.url] ? true : false}
                    event.source.postMessage({answer: {taskId: data.cb.taskId, data: response}}, event.origin)
                    updateIframeZIndexLock = false
                    setIframeWork(false)
                    break
                case 'sign':
                    response = {status: "in progress"}
                    event.source.postMessage({answer: {taskId: data.cb.taskId, data: response}}, event.origin)
                    updateIframeZIndexLock = false
                    setIframeWork(false)
                    break
                default:
                    updateIframeZIndexLock = false
                    setIframeWork(false)
                    break
            }
        }
    }

    const iframeActivation = () => {
        iframe.hidden = false
        if (!updateIframeZIndexLock)
            iframe.style.zIndex = "2"
        if ((iframe.getAttribute('src') === null) || (iframe.getAttribute('src') !== url)) {
            console.log(url)
            iframe.setAttribute('src', url)
        }
    }

    const iframeDeactivation = () => {
        let iframe = document.getElementById('iframe')
        iframe.hidden = true
        iframe.style.zIndex = "-1"
    }

    massageListenerSetup(onMessage)


    return (
        <div className={styles.main}>

            <div className={styles.header}>
                <div className={styles.field} onClick={() => {
                    setIframeWork(false)
                    iframeDeactivation()
                    props.setWebView(false)
                }}>❮ Back
                </div>

                <Input
                    type="text"
                    spellCheck={false}
                    onChange={handleChangeUrl}
                    value={url}
                    className={styles.field}
                    label={'URL'}
                    placeholder={'Place url of DEX here'}
                />
            </div>

            {/*<Header clickMenu={() => props.setWebView(false)} user={{}}/>*/}

            {/*<Separator/>*/}


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
