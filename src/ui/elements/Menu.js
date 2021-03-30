import React, { useState } from 'react'
import styles from '../css/elements.module.css'

export default function Menu(props) {
    const [amount, setAmount] = useState(0)

    const expand = () => chrome.tabs.create({ url: 'popup.html' })
    const window = () => chrome.windows.create({ url: 'popup.html', width: 350 })

    const explorer = () => chrome.tabs.create({ url: 'https://bit.enecuum.com/#!/account/' + props.publickKey})

    return (
        <div className={styles.menu}>

            <div className={styles.lock}><img src="./images/lock.png" /></div>
            <div className={styles.title}>My accounts</div>
            <div className={styles.button_link + ' ' + styles.button_link_active}>Account 1</div>
            <div className={styles.button_link}>Account 2</div>

            <div className={styles.separator}></div>

            <div className={styles.button_link} onClick={expand}>Expand</div>
            <div className={styles.button_link} onClick={window}>Window</div>
            <div className={styles.button_link} onClick={explorer}>Show in blockchain explorer</div>
            <div>Network: PULSE</div>
            <div>Network: BIT</div>
            <div className={styles.button_link} onClick={props.logout}>Logout</div>

        </div>
    )
}
