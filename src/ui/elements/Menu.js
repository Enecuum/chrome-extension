import React, {useEffect, useState} from 'react'
import styles from '../css/elements.module.css'
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import Eth from "@ledgerhq/hw-app-eth";

TransportWebUSB.isSupported().then((result) => {
    console.log('WebUSB Supported: ' + result)
})

// global.WebUSB = TransportWebUSB
// global.transportWebUSB = {}

export default function Menu(props) {
    const [amount, setAmount] = useState(0)

    const [ledger, setLedger] = useState()
    const [ethAddress, setEthAddress] = useState()

    // let enablePopup = (await disk.config.getConfig).openEnablePopup
    const [openEnable, setOpenEnable] = useState(false)
    // const [openTx, setOpenTx] = useState((disk.config.getConfig).openTxPopup)
    const expand = () => chrome.tabs.create({url: 'popup.html'})
    const os = {
        'Win': 370,
        'Mac': 350,
        'Linux': 350
    }

    const WinReg = /Win/

    const window = () => {
        if (WinReg.test(navigator.platform)) {
            chrome.windows.create({
                url: `popup.html`,
                width: os.Win,
                height: 630,
                type: 'popup'
            })
        } else {
            chrome.windows.create({
                url: `popup.html`,
                width: 350,
                height: 630,
                type: 'popup'
            })
        }
    }

    useEffect(() => {
        let config = disk.config.getConfig()
        setOpenEnable(config.openEnablePopup)
        // connectLedger()
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
        config.openSignPopup = openPopup

        setOpenEnable(openPopup)

        await disk.config.setConfig(config)
    }

    // const checkConnectLedger = () => {
    //     TransportWebUSB.list().then(devices => {
    //         // console.log('dievs: ', devices);
    //         if (devices.length > 0) {
    //             // setLedger(true)
    //         } else {
    //             // setLedger(false)
    //         }
    //     })
    // }

    const connectLedger = () => {

        console.log(global.transportWebUSB)

        TransportWebUSB.create().then(transport => {

            console.log(transport)

            const eth = new Eth(transport)
            console.log(eth)

            eth.getAddress("44'/60'/0'/0/0").then(o => {

                setLedger(transport)
                setEthAddress(o.address)

                global.transportWebUSB = transport
                console.log(o.address)
            })

        })
    }

    const openConnectLedger = () => {
        if (WinReg.test(navigator.platform)) {
            chrome.windows.create({
                url: 'popup.html?type=connectLedger',
                width: os.Win,
                height: 630,
                type: 'popup'
            })
        } else {
            chrome.windows.create({
                url: 'popup.html?type=connectLedger',
                width: 350,
                height: 630,
                type: 'popup'
            })
        }
    }

    const version = chrome.runtime.getManifest().version

    return (
        <div className={styles.menu}>

            <div className={styles.lock} onClick={locked}><img src="./images/lock.png"/></div>
            <div className={styles.title}>My accounts</div>
            <div className={styles.button_link + ' ' + styles.button_link_active}>Account 1</div>
            {ethAddress ? <div className={styles.button_link}
                               onClick={openConnectLedger}>Ledger {ledger ? '(connected)' : '(unlock your device)'}</div> :
                <div className={styles.button_link} onClick={openConnectLedger}>Connect ledger</div>}

            <div className={styles.separator}/>

            <div className={styles.button_link} onClick={props.setPassword}>Set password</div>
            {/*<div className={styles.button_link} onClick={expand}>Expand</div>*/}
            <div className={styles.button_link} onClick={window}>Window</div>
            <div className={styles.button_link} onClick={explorer}>Show in blockchain explorer</div>
            <div className={styles.row}>
                <div className={styles.button_link} onClick={() => setNet('pulse')}>PULSE</div>
                &nbsp;/&nbsp;
                <div className={styles.button_link} onClick={() => setNet('bit')}>BIT</div>
                &nbsp;/&nbsp;
                <div className={styles.button_link} onClick={() => setNet('bit-dev')}>BIT-DEV</div>
            </div>
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
