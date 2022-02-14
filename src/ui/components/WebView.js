import React from "react";
import styles from "../css/index.module.css";
import Separator from "../elements/Separator";


export default function WebView(props) {

    let confirm = () => {

    }

    return (
        <div className={styles.main}>

            <iframe src="https://app.enex.space"/>

        </div>
    )
}
