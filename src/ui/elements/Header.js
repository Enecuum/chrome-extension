import React, {useState} from "react";
import styles from "./elements.module.css";

export default function Header(props) {

    return (
        <div className={styles.header}>

            <img className={styles.logo_small} src='./images/logo_white.png'/>

        </div>
    )
}