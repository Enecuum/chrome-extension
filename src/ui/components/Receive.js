import React from "react";
import styles from "../index.module.css";
import TransactionSend from "./TransactionSend";

export default function Receive(props) {

    let copyPublicKey = () => {
        navigator.clipboard.writeText(props.user.publicKey)
    }

    return (

        <div className={styles.main}>

            <div className={styles.content}>

                <div className={styles.field}>Public key</div>

                <div className={styles.field + ' ' + styles.address}>{props.user.publicKey}</div>

                <div className={styles.field + ' ' + styles.copy} onClick={() => copyPublicKey()}>COPY</div>

                <div className={styles.field}>Private key</div>

                <div className={styles.field + ' ' + styles.private}>{props.user.privateKey}</div>

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