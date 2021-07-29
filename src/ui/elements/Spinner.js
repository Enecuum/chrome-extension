import React from 'react'
import styles from '../css/index.module.css'

export default function Spinner() {
    return (
        <img className={styles.loading_logo} src="./images/loader.gif"/>
    )
}
