import React, {useEffect, useState} from 'react'
import styles from '../css/elements.module.css'
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import Eth from "@ledgerhq/hw-app-eth";
import {explorerAddress} from "../Utils";
import {createPopupWindow} from "../../handler";

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

    const [clickIterator, setClickIterator] = useState(0)

    const window = () => {
        disk.promise.sendPromise({window: true})
    }

    // console.log(enablePopup)

    useEffect(() => {
        let config = disk.config.getConfig()
        setOpenEnable(config.openEnablePopup)
        // connectLedger()
    }, []);

    const setNet = async (value) => {

        localStorage.setItem('net', value)
        ENQWeb.Net.provider = value
        await disk.user.loadUser()
            .then(async account => {
                account.net = value
                account.token = ENQWeb.Enq.ticker
                await disk.promise.sendPromise({
                    account: true,
                    set: true,
                    data: account
                })
            })
        cacheTokens().then(() => {
            location.reload(false)
        })
    }

    const locked = async () => {
        console.log('LOCK')
        if (disk.lock.getHashPassword()) {
            props.setLock(true)
            await disk.promise.sendPromise({lock: true})
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

    const version = chrome.runtime.getManifest().version
    // const version = 'VERSION DEBUG'

    let clickVersion = () => {
        setClickIterator(clickIterator + 1)
        if (clickIterator === 20) {
            console.log("development mode")
        }
    }

    return (
        <div className={styles.menu}>

            <div className={styles.lock} onClick={locked}><img src="./images/lock.png"/></div>
            <div className={styles.title}>My accounts</div>
            <div className={styles.button_link + ' ' + styles.button_link_active}>Account 1</div>
            {ethAddress ? <div className={styles.button_link}
                               onClick={() => createPopupWindow('index.html?type=connectLedger')}>Ledger {ledger ? '(connected)' : '(unlock your device)'}</div> :
                <div className={styles.button_link}
                     onClick={() => createPopupWindow('index.html?type=connectLedger')}>Connect ledger</div>}

            <div className={styles.separator}/>

            <div className={styles.button_link} onClick={props.setPassword}>Set password</div>
            {/*<div className={styles.button_link} onClick={expand}>Expand</div>*/}
            {chrome.runtime.web ? '' : <div className={styles.button_link} onClick={window}>Window</div>}
            <div className={styles.button_link} onClick={() => explorerAddress(props.publicKey)}>Show in blockchain
                explorer
            </div>
            <div className={styles.row}>
                <div className={styles.button_link} onClick={() => setNet('bit')}>BIT</div>
                {clickIterator > 20 && <div className={styles.row + ' ' + styles.button_hide}>
                    <div className={styles.button_link} onClick={() => setNet('bit-dev')}>BIT-DEV</div>
                    <div className={styles.button_link} onClick={() => setNet('pulse')}>PULSE</div>
                </div>}
            </div>
            {chrome.runtime.web ? '' : <div className={styles.button_link} onClick={() => changeOpenPopup()}>Popup
                window: {openEnable ? 'ON' : 'OFF'}</div>}
            {/*<div className={styles.button_link} onClick={() => changeOpenPopup('tx')}>Open popup on TX {openTx}</div>*/}
            <div className={styles.button_link_logout}>
                <div className={styles.button_link} onClick={() => props.setConfirm(true)}>Logout</div>
                <div className={styles.version} onClick={clickVersion}>{version}</div>
            </div>

        </div>
    )
}
