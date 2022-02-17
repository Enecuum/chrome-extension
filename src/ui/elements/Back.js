import styles from "../css/index.module.css";
import elements from "../css/elements.module.css";
import React, {useState} from 'react';
import {versions} from "../../utils/names";

// We need normal client routing TODO
let isWeb = false

export default function Back(props) {

    return (
        <div className={styles.field + ' ' + styles.pointer} onClick={() => {
            window.history.pushState({}, document.title,  isWeb ? '' : '/index.html')
            props.setFalse()
        }}>
            ❮ Back
        </div>
    )
}
