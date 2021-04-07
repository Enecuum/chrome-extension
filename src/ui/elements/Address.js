import React, {useState , useEffect} from "react";
import elements from "../css/elements.module.css";

export default function Address(props) {

    let [status, setStatus] = useState('')

    async function checkConnect(count){
        console.log(count)
        if(count === 0)
            return setStatus(`Not connected`)
        else
            return setStatus('Connected')
    }

    useEffect(()=>{
        checkConnect(props.connections).then()
    })

    return (
        <div className={elements.address_row}>

            <div className={elements.connect}>·&nbsp; {status}</div>

            <div>
                <div className={elements.account_name}>Account 1</div>
                <div className={elements.address_string}>{shortAddress(props.publickKey)}</div>
            </div>

            <div></div>

        </div>
    )
}

const shortAddress = (address) => {
    return address.substring(0, 5) + '...' + address.substring(address.length - 3, address.length - 1)
}