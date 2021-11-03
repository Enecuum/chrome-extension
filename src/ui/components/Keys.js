import React, {useEffect, useState} from 'react'
import styles from '../css/index.module.css'
import Separator from '../elements/Separator'
import {explorerAddress, getMnemonicPrivateKeyHex, shortHash, shortHashLong} from '../Utils'


const copyText = ('\n\nCopy address to clipboard').toUpperCase()

export default function Keys(props) {

    let [publicKey, setPublicKey] = useState('')
    let [privateKey, setPrivateKey] = useState('')

    useEffect(() => {
        loadUser()
    })

    let loadUser = () => {
        disk.user.loadUser().then(async account => {
            // console.log(account)
            setPublicKey(account.publicKey)
            setPrivateKey(account.privateKey)

            let hex = account.seed
            if (hex) {
                let account2 = getMnemonicPrivateKeyHex(hex, 1)
                const publicKey2 = ENQWeb.Utils.Sign.getPublicKey(account2, true)
                // console.log(account2)
            }
        })
    }

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
