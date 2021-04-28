import React, { useState } from 'react'
import styles from '../css/elements.module.css'

export default function Menu(props) {
    const [amount, setAmount] = useState(0)

    const [openEnable, setOpenEnable] = useState((disk.config.getConfig).openEnablePopup)
    const [openTx, setOpenTx] = useState((disk.config.getConfig).openTxPopup)
    const expand = () => chrome.tabs.create({ url: 'popup.html' })
    const window = () => chrome.windows.create({
        url: 'popup.html',
        width: 350,
        height: 630,
        type: 'popup'
    })

    const explorer = () => {
        // console.log('open explorer')
        chrome.tabs.create({ url: 'https://' + ENQWeb.Net.currentProvider + '.enecuum.com/#!/account/' + props.publickKey })
    }

    const setNet = async (value) => {

        localStorage.setItem('net', value)
        ENQWeb.Net.provider = value
        await disk.user.loadUser()
            .then(async account => {
                account.net = value
                await disk.promise.sendPromise({
                    account: true,
                    set: true,
                    data: account
                })
            })
        location.reload(false)
    }

    const locked = async () => {
        console.log('LOCK')
        if (disk.lock.getHashPassword()) {
            props.setLock(true)
            await asyncRequest({ lock: true })
        }
        //TODO close popup
    }

    const changeOpenPopup = async (parameter) => {
        let config = disk.config.getConfig()
        if (parameter === 'tx') {
            config.openTxPopup = !config.openTxPopup
            setOpenTx(config.openTxPopup)
            // console.log('tx ',config.openTxPopup)
        }
        if (parameter === 'enable') {
            config.openEnablePopup = !config.openEnablePopup
            setOpenEnable(config.openEnablePopup)
            // console.log('enable ',config.openEnablePopup )
        }
        await disk.config.setConfig(config)
    }

    const version = chrome.runtime.getManifest().version

    return (
        <div className={styles.menu}>

            <div className={styles.lock} onClick={locked}><img src="./images/lock.png"/></div>
            <div className={styles.title}>My accounts</div>
            <div className={styles.button_link + ' ' + styles.button_link_active}>Account 1</div>
            {/*<div className={styles.button_link}>Account 2</div>*/}

            <div className={styles.separator}/>

            <div className={styles.button_link} onClick={props.setPassword}>Set password</div>
            {/*<div className={styles.button_link} onClick={expand}>Expand</div>*/}
            <div className={styles.button_link} onClick={window}>Window</div>
            <div className={styles.button_link} onClick={explorer}>Show in blockchain explorer</div>
            {/*<div className={styles.button_link} onClick={() => setNet('pulse')}>Network: PULSE</div>*/}
            <div className={styles.button_link} onClick={() => setNet('bit')}>Network: BIT</div>
            {/*<div className={styles.button_link} onClick={() => setNet('bit-dev')}>Network: BIT-DEV</div>*/}
            <div className={styles.button_link} onClick={() => changeOpenPopup('enable')}>Open popup on
                Enable {openEnable}</div>
            <div className={styles.button_link} onClick={() => changeOpenPopup('tx')}>Open popup on TX {openTx}</div>
            <div className={styles.button_link_logout}>
                <div className={styles.button_link} onClick={props.logout}>Logout</div>
                <div className={styles.version}>{version}</div>
            </div>

        </div>
    )
}
