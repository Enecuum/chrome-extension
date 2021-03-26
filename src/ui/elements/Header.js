import React, {useState} from "react";
import styles from "../css/elements.module.css";

export default function Header(props) {

    let net = 'BIT'
    let network = {}

    return (
        <div className={styles.header}>

            <img className={styles.logo_small} src='./images/logo_white.png'/>

            {/*<div onClick={() => network.setNetwork(true)}*/}
            {/*     className={styles.field + ' ' + styles.button + ' ' + styles.button_icon}>Network: {net.toUpperCase()}*/}
            {/*</div>*/}

            <div className={styles.network_status}>
                Network: {net.toUpperCase()}
            </div>

            <img className={styles.account_logo_small} src='./icons/5.png'/>

        </div>
    )
}