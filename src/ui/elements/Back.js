import styles from "../css/index.module.css";
import elements from "../css/elements.module.css";
import React, {useState} from 'react';
import {versions} from "../../utils/names";

// We need normal client routing
let isWeb = chrome.runtime.getManifest().version.includes(versions.WEB)

export default function Back(props) {

    return (
        <div className={styles.field} onClick={() => {
            window.history.pushState({}, document.title,  isWeb ? '' : '/index.html')
            props.setFalse()
        }}>
            ❮ Back
        </div>
    )
}
