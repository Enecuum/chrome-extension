import styles from "../css/index.module.css";
import elements from "../css/elements.module.css";
import React, {useState} from 'react';

export default function Back(props) {

    return (
        <div className={styles.field} onClick={() => {
            window.history.pushState({}, document.title, '/index.html')
            props.setFalse()
        }}>
            ❮ Back
        </div>
    )
}
