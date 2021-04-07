import React, {useState, useEffect} from "react";
import elements from "../css/elements.module.css";

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
        checkConnect(props.connections).then()
    })

    const showConnections = async () => {
        console.log((await asyncRequest({connectionList: true})).ports)
    }

    const copyPublicKey = () => {
        navigator.clipboard.writeText(props.publicKey)
    }

    return (
        <div className={elements.address_row}>

            <div className={elements.connect} onClick={showConnections}>·&nbsp; {status}</div>

            <div>
                <div className={elements.account_name}>Account 1</div>
                <div className={elements.address_string} onClick={copyPublicKey} title={props.publicKey + '\n\nCopy address to clipboard'}>{shortAddress(props.publicKey)}</div>
            </div>

            <div></div>

        </div>
    )
}

const shortAddress = (address) => {
    return address.substring(0, 5) + '...' + address.substring(address.length - 3, address.length - 1)
}