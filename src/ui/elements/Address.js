import React, {useState} from "react";
import elements from "../css/elements.module.css";

export default function Address(props) {

    return (
        <div className={elements.address_row}>

            <div className={elements.connect}>· Not connected</div>

            <div>
                <div className={elements.account_name}>Account 1</div>
                <div className={elements.address_string}>{props.publickKey.substring(0, 5) + '...' + props.publickKey.substring(props.publickKey.length - 3, props.publickKey.length - 1)}</div>
            </div>

            <div></div>

        </div>
    )
}