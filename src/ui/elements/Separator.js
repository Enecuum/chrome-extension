import React, {useState} from 'react'
import styles from '../css/elements.module.css'

export default function Separator(props) {

    if (props.line)
        return <div className={styles.separatorLine}/>
    else
        return <div className={styles.separatorBig}/>
}