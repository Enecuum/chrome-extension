import React, {useState} from "react";
import elements from "../css/elements.module.css";

export default function Address(props) {

    return (
        <div className={elements.address_row}>

            <div>· Not connected</div>

            <div>
                <div className={elements.account_name}>Account 1</div>
                <div className={elements.address_string}>02c3...2473</div>
            </div>

            <div></div>

        </div>
    )
}