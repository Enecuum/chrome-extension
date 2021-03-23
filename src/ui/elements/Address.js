import React, {useState} from "react";
import styles from "../css/elements.module.css";

export default function Address(props) {

    return (
        <div className={styles.address_row}>

            <div>· Not connected</div>

            <div>
                <div>Account 1</div>
                <div>02c3...2473</div>
            </div>

            <div></div>

        </div>
    )
}