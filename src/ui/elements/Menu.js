import React, {useEffect, useState} from 'react'
import styles from '../css/elements.module.css'
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import Eth from "@ledgerhq/hw-app-eth";
import {createPopupWindow} from "../../handler";
import * as bip32 from 'bip32';
import {versions} from "../../utils/names";
import {useUserContext} from "../context/useUserContext";

// global.WebUSB = TransportWebUSB
// global.transportWebUSB = {}

export default function Menu(props) {

    const [activeAccount, setActiveAccount] = useState(1)

    // TODO
    // const [accountName, setAccountName] = useState('Account 1 ')

    const [seed, setSeed] = useState(true)

    const [ledger, setLedger] = useState()
    const [ethAddress, setEthAddress] = useState()

    // let enablePopup = (await userStorage.config.getConfig).openEnablePopup
    const [openEnable, setOpenEnable] = useState(false)
    // const [openTx, setOpenTx] = useState((userStorage.config.getConfig).openTxPopup)

    const [clickIterator, setClickIterator] = useState(0)

    const [userDataLoaded, setPrivateDataLoaded] = useState(Object.keys(ENQWeb.Enq.User).length > 0)

    const [account2Amount, setAccount2Amount] = useState(BigInt(0))

    const window = () => {
        createPopupWindow()
    }

    const {user} = useUserContext()

    // console.log(enablePopup)

    useEffect(() => {
        let config = userStorage.config.getConfig()
        setOpenEnable(config.openEnablePopup)

        // userStorage.user.loadUser().then(async account => {
        //     if (account.privateKey) {
        //         setPrivateDataLoaded(true)
        //     } else {
        //         setPrivateDataLoaded(false)
        //     }
        // })

    }, []);

    // const loginAccount2 = () => {
    //     userStorage.user.loadUser().then(async account => {
    //         let node = bip32.fromSeed(Buffer.from(account.seed), null)
    //         let child = node.derivePath("m/44'/2045'/0'/0")
    //         let privateKey0 = child.derive(0).privateKey.toString('hex')
    //         loginAccount(privateKey0, account.seed, account)
    //     })
    // }

    // const loginAccount1 = () => {
    //     userStorage.user.loadUser().then(async account => {
    //         loginAccount(account.account1, account.seed, {})
    //     })
    // }

    // const loginAccount = (privateKey0, seed, mainAccount) => {
    //     const publicKey0 = ENQWeb.Utils.Sign.getPublicKey(privateKey0, true)
    //     if (publicKey0) {
    //         let data = {
    //             publicKey: publicKey0,
    //             privateKey: privateKey0,
    //             net: ENQWeb.Net.provider,
    //             token: ENQWeb.Enq.ticker,
    //             seed: seed,
    //             account1: mainAccount.privateKey
    //         }
    //         userStorage.promise.sendPromise({
    //             account: true,
    //             set: true,
    //             data: data
    //         }).then(r => {
    //             location.reload()
    //         })
    //     }
    // }

    // const setNet = async (value) => {
    //
    //     localStorage.setItem(NET', value)
    //     ENQWeb.Net.provider = value
    //     await userStorage.user.loadUser()
    //         .then(async account => {
    //             account.net = value
    //             account.token = ENQWeb.Enq.ticker
    //             await userStorage.promise.sendPromise({
    //                 account: true,
    //                 set: true,
    //                 data: account
    //             })
    //         })
    //     cacheTokens().then(() => {
    //         location.reload(false)
    //     })
    // }

    const locked = async () => {
        console.log('LOCK')
        if (userStorage.lock.getHashPassword()) {
            props.setLock(true)
            await userStorage.promise.sendPromise({lock: true})
        }
        //TODO close popup
    }

    const changeOpenPopup = async () => {

        let config = await userStorage.config.getConfig()

        // console.log(config)

        let openPopup = !config.openEnablePopup

        config.openEnablePopup = openPopup
        config.openTxPopup = openPopup
        config.openSignPopup = openPopup

        setOpenEnable(openPopup)

        userStorage.config.setConfig(config)
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

    // const connectLedger = () => {
    //
    //     // console.log(global.transportWebUSB)
    //
    //     TransportWebUSB.create().then(transport => {
    //
    //         // console.log(transport)
    //
    //         const eth = new Eth(transport)
    //         // console.log(eth)
    //
    //         eth.getAddress("44'/60'/0'/0/0").then(o => {
    //
    //             setLedger(transport)
    //             setEthAddress(o.address)
    //
    //             global.transportWebUSB = transport
    //             // console.log(o.address)
    //         })
    //
    //     })
    // }

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

            <div className={styles.lock} onClick={locked}><img src='./images/lock.png'
                                                               className={(!userDataLoaded ? styles.loaded : '')}
                                                               title={'Lock application'} alt={'Lock'}/></div>

            <div className={styles.title}>
                <div className={styles.button_link} onClick={() => props.setAccountSelector(true)}>Accounts</div>
            </div>

            {/*<div className={styles.row}>*/}

                {/*<div className={styles.row}>*/}
                {/*    <div className={styles.button_link + (activeAccount === 1 ? ' ' + styles.button_link_active : '')} onClick={() => {}}>{accountName}</div>*/}
                {/*</div>*/}

                {/*<div className={styles.button_link + ' ' + styles.keys_arrow} onClick={() => props.setKeys(true)}>+</div>*/}
            {/*</div>*/}


            <div className={styles.separator}/>

            {/*{seed && <div className={styles.row}>*/}
            {/*    <div className={styles.button_link + (activeAccount === 2 ? ' ' + styles.button_link_active : '')} onClick={(activeAccount === 1 ? loginAccount2 : null)}>Account 2{account2Amount > 0 ? ': ' + (Number(account2Amount) / 1e10).toFixed(4) : ''}</div>*/}
            {/*    <div className={styles.button_link} onClick={props.setMnemonic}>Seed</div>*/}
            {/*</div>}*/}

            <div className={styles.title}>
                <div className={styles.button_link} onClick={props.setNetwork}>Networks</div>
            </div>

            <div className={styles.separator}/>

            <div className={styles.title}>
                <div className={styles.button_link} onClick={() => props.setWebView({url: 'app.enex.space'})}>DApps</div>
            </div>

            <div className={styles.separator}/>

            <div className={styles.title}>
                <div className={styles.button_link} onClick={props.setMining}>PoA</div>
            </div>

            <div className={styles.separator}/>

            {/*{version.endsWith(versions.MOBILE) ? <div className={styles.button_link} onClick={props.installPWA}>Install</div> : ''}*/}

            <div className={styles.button_link} onClick={props.setPassword}>Set password</div>
            {/*<div className={styles.button_link} onClick={expand}>Expand</div>*/}
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
                     onClick={clickVersion}>{version.replace('web', Capacitor.platform) + ' ' + (clickIterator >= 2 ? VERSION : '')}</div>
            </div>

        </div>
    )
}
