import React, {useState} from "react";
import styles from "../index.module.css";

export default function Header(props) {

    return (
        <div className={styles.header}>

            <img className={styles.logo} src='./128.png'/>

            <div className={styles.welcome1}>Welcome </div>
            <div className={styles.welcome1}>to Enecuum</div>

            <div className={styles.welcome2}>Connecting you to network and the</div>
            <div className={styles.welcome2}>Decentralized Web.</div>


        </div>
    )
}