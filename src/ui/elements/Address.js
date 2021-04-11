import React, {useState, useEffect} from "react";
import elements from "../css/elements.module.css";

const copyText = ('\n\nCopy address to clipboard').toUpperCase()

export default function Address(props) {

    let [status, setStatus] = useState('')

    async function checkConnect(count) {
        console.log(count)
        let tasks = disk.list.listOfTask()
        let found = false
        tasks.forEach(key=>{
            if(key.type === 'enable'){
                setStatus('Await connect');
                found = true;
            }
        })
        if (count === 0 && !found)
            return setStatus(`Not connected`)
        else
            if(count > 0 && !found)
                return setStatus(`Connected ${count}`);
    }

    useEffect(() => {
        checkConnect(props.connectionsCounter).then()
    })

    const showConnections = async () => {
        const ports = (await asyncRequest({connectionList: true})).ports
        console.log(ports)
        console.log(status)
        if(status === 'Await connect'){
            console.log('yep')
            let task = (await disk.list.listOfTask())
            task.forEach((key, request)=>{
                if(key.type === 'enable' && !request){
                    request = true;
                    props.setPublicKeyRequest(key);
                }
            })
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
                <div className={elements.address_string} onClick={copyPublicKey} title={props.publicKey + copyText}>{shortAddress(props.publicKey)}</div>
            </div>

            <div></div>

        </div>
    )
}

const shortAddress = (address) => {
    return address.substring(0, 5) + '...' + address.substring(address.length - 3, address.length - 1)
}