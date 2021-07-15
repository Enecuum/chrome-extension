import React, {useState, useEffect} from 'react'
import styles from '../../css/index.module.css'
import Separator from '../../elements/Separator'
import {shortAddress2} from '../../Utils'

import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import Eth from "@ledgerhq/hw-app-eth";

// TransportWebUSB.isSupported().then((result) => {
//     console.log('WebUSB Supported: ' + result)
// })

global.WebUSB = TransportWebUSB

export default function ConnectLedger() {

    //TODO
    // const [taskId, setTaskId] = useState(props.request.cb.taskId)
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

    const connectLedger = () => {
        TransportWebUSB.create().then(transport => {

            console.log(transport)


            const eth = new Eth(transport)
            console.log(eth)

            eth.getAddress("44'/60'/0'/0/0").then(o => {

                setLedger(transport)
                setEthAddress(o.address)
                console.log(o.address)

                eth.getAddress("44'/60'/0'/0/1").then(o => {
                    setEth2Address(o.address)
                    console.log(o.address)

                    eth.getAddress("44'/60'/0'/0/2").then(o => {
                        setEth3Address(o.address)
                        console.log(o.address)

                        eth.getAddress("44'/60'/0'/0/3").then(o => {
                            setEth4Address(o.address)
                            console.log(o.address)

                            eth.getAddress("44'/60'/0'/0/4").then(o => {
                                setEth5Address(o.address)
                                console.log(o.address)
                            })
                        })
                    })
                })
            })
            // eth.getAddress("44'/60'/0'/0/1").then(o => {
            //     // setEthAddress(shortAddress(o.address))
            //     console.log(o.address)
            // })

        })
    }


    useEffect(() => {
        connectLedger()
    }, [])


    return (
        <div className={styles.main}>

            <div className={styles.content}>

                <div className={styles.center_vertical}>

                    {!ledger && <div className={styles.field}>Connect and unlock device</div>}

                    <div className={styles.field}>Status: {ledger ? 'connected' : 'not connected'} </div>

                    {ethAddress && <div className={styles.field}>{shortAddress2(ethAddress)}</div>}
                    {eth2Address && <div className={styles.field}>{shortAddress2(eth2Address)}</div>}
                    {eth3Address && <div className={styles.field}>{shortAddress2(eth3Address)}</div>}
                    {eth4Address && <div className={styles.field}>{shortAddress2(eth4Address)}</div>}
                    {eth5Address && <div className={styles.field}>{shortAddress2(eth5Address)}</div>}

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
