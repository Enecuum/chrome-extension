import React, {useState, useEffect} from "react";
import elements from "../css/elements.module.css";
import {shortHash} from "../Utils";
import styles from "../css/index.module.css";

const copyText = ('\n\nCopy address to clipboard').toUpperCase()

export default function Address(props) {

    let [status, setStatus] = useState('')

    async function checkConnect(count) {
        // console.log(count)
        let tasks = userStorage.list.listOfTask()
        let found = false
        tasks.forEach(key => {
            if (key.type === 'enable') {
                setStatus('Await connect');
                found = true;
            }
        })
        if (count === 0 && !found)
            return setStatus(`Not connected`)
        else if (count > 0 && !found)
            return setStatus(`Connected ${count}`);
    }

    useEffect(() => {
        checkConnect(props.connectionsCounter).then()
    })

    const showConnections = async () => {

        if (status === 'Await connect') {

            let tasks = await userStorage.list.listOfTask()

            //TODO rename enable please, allow website access or something
            tasks.forEach((task, request) => {
                // console.log(request)
                // console.log(task)
                if (task.type === 'enable') {
                    // console.log(task)
                    props.setPublicKeyRequest(task);
                }
            })
        }
        if (status.startsWith('Connected')) {

            const ports = (await asyncRequest({connectionList: true})).ports
            props.setConnects(ports)
        }
    }

    const copyPublicKey = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(props.publicKey)
            props.setCopied(true)
        } else
            console.error('navigator.clipboard: ' + false)
    }

    return (
        <div className={elements.address_row}>

            {!props.isMainToken ? <div onClick={props.setMainToken}>❮ Back</div> : <div className={elements.connect} onClick={showConnections}>·&nbsp;&nbsp;{status}</div>}

            {/*{console.log(props.isMainToken)}*/}

            <div>
                <div className={elements.account_name}>Account 1</div>
                <div className={elements.address_string + ' ' + (props.isCopied ? elements.copied : '')} onClick={copyPublicKey}
                     title={props.publicKey + copyText}>{shortHash(props.publicKey)}</div>
            </div>

            <div className={elements.block}>
                <div>13:31</div>
                <div>22 10 2022</div>
                <div>301033</div>
            </div>

        </div>
    )
}
