import React, {useEffect, useState} from 'react'
import styles from '../css/elements.module.css'

export default function Menu(props) {
    const [amount, setAmount] = useState(0)

    // let enablePopup = (await disk.config.getConfig).openEnablePopup
    const [openEnable, setOpenEnable] = useState(false)
    // const [openTx, setOpenTx] = useState((disk.config.getConfig).openTxPopup)
    const expand = () => chrome.tabs.create({url: 'popup.html'})
    const window = () => chrome.windows.create({
        url: 'popup.html',
        width: 350,
        height: 630,
        type: 'popup'
    })

    // console.log(enablePopup)


    useEffect(() => {
        let config = disk.config.getConfig()
        setOpenEnable(config.openEnablePopup)
    }, []);

    const explorer = () => {
        // console.log('open explorer')
        chrome.tabs.create({url: 'https://' + ENQWeb.Net.currentProvider + '.enecuum.com/#!/account/' + props.publickKey})
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
            await asyncRequest({lock: true})
        }
        //TODO close popup
    }

    const changeOpenPopup = async () => {

        let config = await disk.config.getConfig()

        // console.log(config)

        let openPopup = !config.openEnablePopup

        config.openEnablePopup = openPopup
        config.openTxPopup = openPopup

        setOpenEnable(openPopup)

        await disk.config.setConfig(config)
    }

    const version = chrome.runtime.getManifest().version

    return (
        <div className={styles.menu}>

            <div className={styles.lock} onClick={locked}><img src="./images/lock.png"/></div>
            <div className={styles.title}>My accounts</div>
            <div className={styles.button_link + ' ' + styles.button_link_active}>Account 1</div>
            <div className={styles.button_link}>Connect Ledger</div>
            {/*<div className={styles.button_link}>Account 2</div>*/}

            <div className={styles.separator}/>

            <div className={styles.button_link} onClick={props.setPassword}>Set password</div>
            {/*<div className={styles.button_link} onClick={expand}>Expand</div>*/}
            <div className={styles.button_link} onClick={window}>Window</div>
            <div className={styles.button_link} onClick={explorer}>Show in blockchain explorer</div>
            <div className={styles.button_link} onClick={() => setNet('bit')}>Network: BIT</div>
            <div className={styles.button_link} onClick={() => changeOpenPopup()}>Popup
                window: {openEnable ? 'ON' : 'OFF'}</div>
            {/*<div className={styles.button_link} onClick={() => changeOpenPopup('tx')}>Open popup on TX {openTx}</div>*/}
            <div className={styles.button_link_logout}>
                <div className={styles.button_link} onClick={() => props.setConfirm(true)}>Logout</div>
                <div className={styles.version}>{version}</div>
            </div>

        </div>
    )
}
