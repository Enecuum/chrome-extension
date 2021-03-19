import React, {useState} from "react";
import styles from "../index.module.css";

export default function Header(props) {

    return (
        <div className={styles.header}>

            <img id={'logo'} src='./128.png'/>

        </div>
    )
}