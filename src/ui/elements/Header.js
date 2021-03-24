import React, {useState} from "react";
import elements from "../css/elements.module.css";
import styles from "../css/index.module.css";

export default function Header(props) {

    let net = 'BIT'
    let network = {}

    return (
        <div className={elements.header}>

            <img className={elements.logo_small} src='./images/logo_white.png'/>

            <div onClick={() => network.setNetwork(true)}
                 className={styles.field + ' ' + styles.button + ' ' + styles.button_icon}>Network: {net.toUpperCase()}
            </div>

            <img className={elements.logo_small} src='./icons/10.png'/>

        </div>
    )
}