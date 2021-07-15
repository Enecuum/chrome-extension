import React, {useState, useEffect} from 'react'
import styles from '../../css/index.module.css'
import Separator from '../../elements/Separator'
import elements from '../../css/elements.module.css'
import {shortAddress} from '../../Utils'

import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import Eth from "@ledgerhq/hw-app-eth";

TransportWebUSB.isSupported().then((result) => {
    console.log('WebUSB Supported: ' + result)
})

global.WebUSB = TransportWebUSB

export default function ConnectLedger(props) {

    //TODO
    // const [taskId, setTaskId] = useState(props.request.cb.taskId)
    const [ledger, setLedger] = useState(false)
    const [ethAddress, setEthAddress] = useState('')


    const closeModalWindow = () => {
        let params = getUrlVars()
        if (params.type === 'connectLedger') {
            window.close()
        }
    }

    const checkConnectLedger = () =>{
        TransportWebUSB.list().then(devices=>{
            // console.log('dievs: ', devices);
            if(devices.length > 0){
                setLedger(true)
            }else{
                setLedger(false)
            }
        })
    }

    const connectLedger = () => {
        TransportWebUSB.create().then(transport => {

            console.log(transport)

            const eth = new Eth(transport)
            console.log(eth)

            eth.getAddress("44'/60'/0'/0/0").then(o => {
                setLedger(transport)
                setEthAddress(o.address)
                console.log(o.address)
            })

        })
    }


    useEffect(() => {
        checkConnectLedger()
    }, [])


    return (
        <div className={styles.main}>
            
            <div className={styles.field}>Please connect your device and unlock him</div>

            <div className={styles.field }>Status: {ledger ? 'Connected':'Try connecting'} </div>
            
            <div className={styles.field }>{ethAddress ? 'eth Address: \n' + ethAddress : ''}</div>

            <div className={styles.field + ' ' + styles.button + ' ' + styles.button_blue} onClick={connectLedger}>Connect</div>

            <div onClick={closeModalWindow}
                     className={styles.field + ' ' + styles.button + ' ' + styles.button_blue}>Close
            </div>

        </div>
    )
}
