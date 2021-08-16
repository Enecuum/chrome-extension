import React, {useState} from "react";
import styles from "../css/elements.module.css";
import {toggleFullScreen} from "../Utils";

export default function Header(props) {

    let net = ENQWeb.Net.currentProvider

    return (
        <div className={styles.header}>

            <img className={styles.logo_small} src='./images/logo_white.png' onClick={toggleFullScreen}/>

            {/*<div onClick={() => network.setNetwork(true)}*/}
            {/*     className={styles.field + ' ' + styles.button + ' ' + styles.button_icon}>Network: {net.toUpperCase()}*/}
            {/*</div>*/}

            <div className={styles.network_status} onClick={props.clickMenu}>
                Network: {net.toUpperCase()}
            </div>

            <div className={styles.menu_icon_div} onClick={props.clickMenu}><img src='./icons/5.png'/></div>

        </div>
    )
}
