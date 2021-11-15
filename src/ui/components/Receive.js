import React from "react";
import styles from "../css/index.module.css";
import TransactionSend from "./TransactionSend";

export default function Receive(props) {

    let copyPublicKey = () => {
        navigator.clipboard.writeText(props.user.mainPublicKey)
    }

    return (

        <div className={styles.main}>

            <div className={styles.content}>

                <div className={styles.field}>Public key</div>

                <div className={styles.field + ' ' + styles.address}>{props.user.mainPublicKey}</div>

                <div className={styles.field + ' ' + styles.copy} onClick={() => copyPublicKey()}>COPY</div>

                <div className={styles.field}>Private key</div>

                <div className={styles.field + ' ' + styles.private}>{props.user.mainPrivateKey}</div>

            </div>

            <div className={styles.form}>

                <div onClick={props.logout}
                     className={styles.field + ' ' + styles.button + ' ' + styles.red}>Logout
                </div>

                <div onClick={() => props.setReceive(false)}
                     className={styles.field + ' ' + styles.button + ' ' + styles.back}>Back
                </div>

            </div>
        </div>
    )
}