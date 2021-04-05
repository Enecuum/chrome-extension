import React, {useState} from "react";
import elements from "../css/elements.module.css";

export default function Address(props) {

    return (
        <div className={elements.address_row}>

            <div className={elements.connect}>·&nbsp;Not connected</div>

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