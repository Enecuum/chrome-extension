import React, {useState, useEffect} from "react";
import elements from "../css/elements.module.css";
import {shortAddress} from "../Utils";

const copyText = ('\n\nCopy address to clipboard').toUpperCase()

export default function Address(props) {

    let [status, setStatus] = useState('')

    async function checkConnect(count) {
        // console.log(count)
        let tasks = disk.list.listOfTask()
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

            let tasks = await disk.list.listOfTask()

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
        navigator.clipboard.writeText(props.publicKey)
    }

    return (
        <div className={elements.address_row}>

            <div className={elements.connect} onClick={showConnections}>·&nbsp;&nbsp;{status}</div>

            <div>
                <div className={elements.account_name}>Account 1</div>
                <div className={elements.address_string} onClick={copyPublicKey}
                     title={props.publicKey + copyText}>{shortAddress(props.publicKey)}</div>
            </div>

            <div></div>

        </div>
    )
}