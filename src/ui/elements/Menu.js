import React, {useEffect, useState} from 'react'
import styles from '../css/elements.module.css'
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import Eth from "@ledgerhq/hw-app-eth";
import {createPopupWindow} from "../../handler";
import * as bip32 from 'bip32';

TransportWebUSB.isSupported().then((result) => {
    console.log('WebUSB Supported: ' + result)
})

// global.WebUSB = TransportWebUSB
// global.transportWebUSB = {}

export default function Menu(props) {

    const [activeAccount, setActiveAccount] = useState(1)

    const [seed, setSeed] = useState(false)

    const [ledger, setLedger] = useState()
    const [ethAddress, setEthAddress] = useState()

    // let enablePopup = (await disk.config.getConfig).openEnablePopup
    const [openEnable, setOpenEnable] = useState(false)
    // const [openTx, setOpenTx] = useState((disk.config.getConfig).openTxPopup)

    const [clickIterator, setClickIterator] = useState(0)

    const [privateDataLoaded, setPrivateDataLoaded] = useState(Object.keys(ENQWeb.Enq.User).length > 0)

    const [account2Amount, setAccount2Amount] = useState(BigInt(0))

    const window = () => {
        disk.promise.sendPromise({window: true})
    }

    // console.log(enablePopup)

    useEffect(() => {
        let config = disk.config.getConfig()
        setOpenEnable(config.openEnablePopup)

        // disk.user.loadUser().then(async account => {
        //     if (account.privateKey) {
        //         setPrivateDataLoaded(true)
        //     } else {
        //         setPrivateDataLoaded(false)
        //     }
        // })

    }, []);

    const loginAccount2 = () => {
        disk.user.loadUser().then(async account => {
            let node = bip32.fromSeed(Buffer.from(account.seed), null)
            let child = node.derivePath("m/44'/2045'/0'/0")
            let privateKey0 = child.derive(0).privateKey.toString('hex')
            loginAccount(privateKey0, account.seed, account)
        })
    }

    const loginAccount1 = () => {
        disk.user.loadUser().then(async account => {
            loginAccount(account.account1, account.seed, {})
        })
    }

    const loginAccount = (privateKey0, seed, mainAccount) => {
        const publicKey0 = ENQWeb.Utils.Sign.getPublicKey(privateKey0, true)
        if (publicKey0) {
            let data = {
                publicKey: publicKey0,
                privateKey: privateKey0,
                net: ENQWeb.Net.provider,
                token: ENQWeb.Enq.ticker,
                seed: seed,
                account1: mainAccount.privateKey
            }
            global.disk.promise.sendPromise({
                account: true,
                set: true,
                data: data
            }).then(r => {
                location.reload()
            })
        }
    }

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

        // console.log(global.transportWebUSB)

        TransportWebUSB.create().then(transport => {

            // console.log(transport)

            const eth = new Eth(transport)
            // console.log(eth)

            eth.getAddress("44'/60'/0'/0/0").then(o => {

                setLedger(transport)
                setEthAddress(o.address)

                global.transportWebUSB = transport
                // console.log(o.address)
            })

        })
    }

    const version = chrome.runtime.getManifest().version
    // const version = 'VERSION DEBUG'

    let clickIteratorLimit = 7

    let clickVersion = () => {
        setClickIterator(clickIterator + 1)
        if (clickIterator === clickIteratorLimit) {
            console.log('Development mode')
        }
    }

    return (
        <div className={styles.menu}>

            <div className={styles.lock} onClick={locked}><img src='./images/lock.png' className={(!privateDataLoaded ? styles.loaded : '')}/></div>
            <div className={styles.title}>My accounts</div>

            <div className={styles.row}>
                <div className={styles.button_link + (activeAccount === 1 ? ' ' + styles.button_link_active : '')} onClick={(activeAccount === 2 ? loginAccount1 : null)}>Account 1 </div>
                <div className={styles.button_link} onClick={() => props.setKeys(true)}>❯</div>
            </div>

            {seed && <div className={styles.row}>
                <div className={styles.button_link + (activeAccount === 2 ? ' ' + styles.button_link_active : '')} onClick={(activeAccount === 1 ? loginAccount2 : null)}>Account 2{account2Amount > 0 ? ': ' + (Number(account2Amount) / 1e10).toFixed(4) : ''}</div>
                <div className={styles.button_link} onClick={props.setMnemonic}>Seed</div>
            </div>}

            {ethAddress ? <div className={styles.button_link}
                               onClick={() => createPopupWindow('index.html?type=connectLedger')}>Ledger {ledger ? '(connected)' : '(unlock your device)'}</div> :
                <div className={styles.button_link}
                     onClick={() => createPopupWindow('index.html?type=connectLedger')}>Connect Ledger</div>}

            <div className={styles.separator}/>

            {!seed && <div className={styles.button_link} onClick={props.setMnemonic}>Mnemonic</div>}

            <div className={styles.button_link} onClick={props.setPassword}>Set password</div>
            {/*<div className={styles.button_link} onClick={expand}>Expand</div>*/}
            <div className={styles.button_link} onClick={props.setNetwork}>Networks</div>
            {/*<div className={styles.row}>*/}
            {/*    <div className={styles.button_link} onClick={() => setNet('bit')}>BIT</div>*/}
            {/*    {clickIterator >= clickIteratorLimit && <div className={styles.row + ' ' + styles.button_hide}>*/}
            {/*        <div className={styles.button_link} onClick={() => setNet('bit-dev')}>BIT-DEV</div>*/}
            {/*        <div className={styles.button_link} onClick={() => props.setNetwork(true)}>CUSTOM</div>*/}
            {/*    </div>}*/}
            {/*</div>*/}
            {chrome.runtime.web ? '' : <div className={styles.button_link} onClick={window}>Window</div>}
            {chrome.runtime.web ? '' : <div className={styles.button_link} onClick={() => changeOpenPopup()}>Popup
                window: {openEnable ? 'ON' : 'OFF'}</div>}
            <div className={styles.button_link_logout}>
                <div className={styles.button_link} onClick={() => props.setConfirm(true)}>Logout</div>
                <div className={styles.version + ' ' + (clickIterator >= clickIteratorLimit ? styles.blue : '')}
                     onClick={clickVersion}>{version + ' ' + (clickIterator >= 2 ? VERSION : '')}</div>
            </div>

        </div>
    )
}
