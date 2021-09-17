import React, {useState} from "react";
import styles from "../css/elements.module.css";
import {toggleFullScreen} from "../Utils";

export default function Header(props) {

    let net = ENQWeb.Net.currentProvider
    let [localNetworks, setLocalNetworks] = useState(JSON.parse(localStorage.getItem('networks')) || [])

    return (

        <div className={styles.header}>

            <img className={styles.logo_small} src='./images/logo_white.png' onClick={toggleFullScreen}/>

            {/*<div onClick={() => network.setNetwork(true)}*/}
            {/*     className={styles.field + ' ' + styles.button + ' ' + styles.button_icon}>Network: {net.toUpperCase()}*/}
            {/*</div>*/}

            <div className={styles.network_status} onClick={props.clickMenu}>
                Network: <div className={styles.network_name}>{
                localNetworks.find(element => element.host === ENQWeb.Net.currentProvider) ?
                    localNetworks.find(element => element.host === ENQWeb.Net.currentProvider).name :
                    net.replace('https://', '').replace('http://', '').toUpperCase()
                }</div>
            </div>

            <div className={styles.menu_icon_div} onClick={props.clickMenu}><img src='./images/icons/5.png'/></div>

        </div>
    )
}
