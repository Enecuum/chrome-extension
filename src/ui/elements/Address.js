import React, {useState, useEffect} from "react";
import elements from "../css/elements.module.css";

const copyText = ('\n\nCopy address to clipboard').toUpperCase()

export default function Address(props) {

    let [status, setStatus] = useState('')

    async function checkConnect(count) {
        console.log(count)
        if (count === 0)
            return setStatus(`Not connected`)
        else
            return setStatus('Connected')
    }

    useEffect(() => {
        checkConnect(props.connectionsCounter).then()
    })

    const showConnections = async () => {
        const ports = (await asyncRequest({connectionList: true})).ports
        console.log(ports)
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