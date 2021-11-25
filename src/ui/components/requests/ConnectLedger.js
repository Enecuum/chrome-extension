import React, {useState, useEffect} from 'react'
import styles from '../../css/index.module.css'
import Separator from '../../elements/Separator'
import {shortHashLong} from '../../Utils'

import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import {signHash, getVersion, getPublicKey} from '../../../utils/ledgerShell'
import TransportWebHID from '@ledgerhq/hw-transport-webhid';
import eventBus from "../../../utils/eventBus";

export default function ConnectLedger(props) {

    //TODO
    // const [taskId, setTaskId] = useState(props.request.cb.taskId)
    const [usbDevice, setUsbDevice] = useState(false)
    const [ledger, setLedger] = useState(false)
    const [ethAddress, setEthAddress] = useState('')
    const [eth2Address, setEth2Address] = useState('')
    const [eth3Address, setEth3Address] = useState('')
    const [eth4Address, setEth4Address] = useState('')
    const [eth5Address, setEth5Address] = useState('')

    const closeModalWindow = () => {

        let params = getUrlVars()
        if (params.type === 'connectLedger') {
            window.close()
        }
    }

    // const checkConnectLedger = () => {
    //     TransportWebUSB.list().then(devices => {
    //         // console.log('dievs: ', devices);
    //         if (devices.length > 0) {
    //             setLedger(true)
    //
    //         } else {
    //             setLedger(false)
    //         }
    //     })
    // }

    const checkDevice = () => {
        TransportWebUSB.list().then(devices => {
            console.log(devices)
            let output = devices.length > 0 && devices.find(device => device.manufacturerName === 'Ledger')
            console.log(!!output)
            setUsbDevice(!!output)
        })
    }

    const connectLedger = async () => {

        console.log('connectLedger')

        // const transport = await TransportWebHID.create()

        // let version = await getVersion(transport)

        // TODO We will give to choose one of keys in selector later, now only 1 key
        // let publicKey = await getPublicKey(1, transport)

        // TODO This is our old user model, but for now it's ok to use it
        let data = {
            // publicKey: publicKey,
            // TODO This is fake public key because i still not install app on my ledger
            publicKey: '02c3143abeb50e4153da372868490277c14b2877f05b477e4671722152b0112473',
            privateKey: true,
            net: ENQWeb.Net.provider,
            token: ENQWeb.Enq.ticker,
            ledger: true,
        }

        // TODO :( I want some rest and money
        // I want some water and honey
        // You want to write some code?
        // Will i be at better spot

        global.disk.promise.sendPromise({
            account: true,
            set: true,
            data: data
        }).then(r => {
            // eventBus.dispatch('ledger', {})
            window.close()
        })

        // let hash = 'message'
        // let sign = await signHash(hash, 1, transport)
        //
        // console.log(
        //     {version, publicKey: publicKey, sign: sign.substr(0, 140)}
        // )





        // let transport = await props.getLedgerTransport()
        //
        // console.log(transport)
        //
        // const eth = new Eth(transport)
        // console.log(eth)
        //
        // eth.getAddress("44'/60'/0'/0/0").then(o => {
        //
        //     setLedger(transport)
        //     setEthAddress(o.address)
        //     console.log(o.address)
        //
        //     eth.getAddress("44'/60'/0'/0/1").then(o => {
        //         setEth2Address(o.address)
        //         console.log(o.address)
        //
        //         eth.getAddress("44'/60'/0'/0/2").then(o => {
        //             setEth3Address(o.address)
        //             console.log(o.address)
        //
        //             eth.getAddress("44'/60'/0'/0/3").then(o => {
        //                 setEth4Address(o.address)
        //                 console.log(o.address)
        //
        //                 eth.getAddress("44'/60'/0'/0/4").then(o => {
        //                     setEth5Address(o.address)
        //                     console.log(o.address)
        //
        //                     global.transportWebUSB = transport
        //                 })
        //             })
        //         })
        //     })
        // })
    }


    useEffect(() => {
        // checkDevice()
        // connectLedger().then(r => {})
    }, [])

    //

    return (
        <div className={styles.main}>

            <div className={styles.content}>

                <div className={styles.center_vertical}>

                    {!ledger && <div className={styles.field}>Connect and unlock device</div>}

                    <div
                        className={styles.field}>Status: {ledger ? 'connected' : (usbDevice ? 'locked' : 'not connected')} </div>

                    {ethAddress && <div className={styles.field}>{shortHashLong(ethAddress)}</div>}
                    {eth2Address && <div className={styles.field}>{shortHashLong(eth2Address)}</div>}
                    {eth3Address && <div className={styles.field}>{shortHashLong(eth3Address)}</div>}
                    {eth4Address && <div className={styles.field}>{shortHashLong(eth4Address)}</div>}
                    {eth5Address && <div className={styles.field}>{shortHashLong(eth5Address)}</div>}

                </div>

                <div className={styles.form}>

                    {!ledger && <div className={styles.field + ' ' + styles.button + ' ' + styles.button_blue}
                                     onClick={connectLedger}>Connect
                    </div>}

                    <div onClick={closeModalWindow}
                         className={styles.field + ' ' + styles.button + ' ' + styles.button_blue}>Close
                    </div>

                    <Separator/>

                </div>

            </div>

        </div>
    )
}
