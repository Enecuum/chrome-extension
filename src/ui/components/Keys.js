import React, {useState} from 'react'
import styles from '../css/index.module.css'
import Separator from '../elements/Separator'
import {explorerAddress, getMnemonicPrivateKeyHex, shortHash, shortHashLong} from '../Utils'


const copyText = ('\n\nCopy address to clipboard').toUpperCase()

export default function Keys(props) {

    let [publicKey, setPublicKey] = useState(props.user.publicKey)

    let [privateKey, setPrivateKey] = useState(props.user.privateKey)

    disk.user.loadUser().then(async account => {
        let hex = account.seed
        let account2 = getMnemonicPrivateKeyHex(hex, 1)
        // setPrivateKey(account2)
    })

    return (

        <div className={styles.main}>

            <div className={styles.content}>

                <Separator/>

                <div className={styles.field}>{shortHashLong(publicKey)}</div>

                <div className={styles.field + ' ' + styles.button} onClick={() => {
                    navigator.clipboard.writeText(publicKey)}}>Copy public key</div>

                <Separator/>

                <div className={styles.field}>{shortHashLong(privateKey)}</div>

                <div className={styles.field + ' ' + styles.button} onClick={() => {
                    navigator.clipboard.writeText(privateKey)}}>Copy private key
                </div>

                <Separator/>

                <div className={styles.field}>Open new tab</div>

                <div className={styles.field + ' ' + styles.button}
                     onClick={() => explorerAddress(publicKey)}>
                    Show in blockchain explorer
                </div>

            </div>

            <div className={styles.form}>

                <div onClick={() => props.setKeys(false)}
                     className={styles.field + ' ' + styles.button}>Back
                </div>

                <Separator/>

            </div>
        </div>
    )
}
