import React from "react";
import styles from "../css/index.module.css";
import Separator from "../elements/Separator";


export default function WebView(props) {

    let confirm = () => {

    }

    return (
        <div className={styles.main}>

            <div onClick={() => props.setWebView(false)}
                 className={styles.field + ' ' + styles.button}>Back</div>

            <Separator/>

            <iframe src="https://app.enex.space"/>

        </div>
    )
}
