import React, { useState } from 'react'
import styles from '../css/elements.module.css'

export default function Menu(props) {
    const [amount, setAmount] = useState(0)

    const expand = () => chrome.tabs.create({ url: 'popup.html' })
    const window = () => chrome.windows.create({ url: 'popup.html', width: 350 })

    return (
        <div className={styles.menu}>

            <div className={styles.lock}><img src="./icons/9.png" /></div>
            <div className={styles.title}>My accounts</div>
            <div>Account 1</div>
            <div>Account 2</div>

            <div className={styles.title}>Settings</div>
            <div onClick={expand}>Expand</div>
            <div onClick={window}>Window</div>
            <div>Show in blockchain explorer</div>
            <div>Network: PULSE</div>
            <div>Network: BIT</div>
            <div onClick={props.logout}>Logout</div>

        </div>
    )
}
