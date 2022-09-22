import React, { useEffect, useState } from 'react'
import styles from '../../css/index.module.css'
import Separator from '../../elements/Separator'
import {
    copyToClipboard,
    explorerAddress,
    getMnemonicPrivateKeyHex,
    REF_PREFIX,
    shortHash,
    shortHashLong, xor, XOR_STRING
} from '../../Utils'
import Back from "../../elements/Back";


const copyText = ('\n\nCopy address to clipboard').toUpperCase()

export default function Keys(props) {

    let [publicKey, setPublicKey] = useState('')
    let [privateKey, setPrivateKey] = useState('')
    let [type, setType] = useState('')
    useEffect(() => {
        loadUser().then()
    })

    let loadUser = async () => {

        let account

        console.log(props)

        if (props.isKeys.publicKey) {
            account = props.isKeys
        } else {
            account = await userStorage.user.loadUser()
        }

        setPublicKey(account.publicKey)
        setPrivateKey(account.type === 2 ? '...' : account.privateKey)
        setType(account.type)
    }

    let copyReferral = () => {
        userStorage.user.loadUser().then(account => {
            let userReferral = REF_PREFIX + xor(account.publicKey, XOR_STRING)
            copyToClipboard(userReferral)
        })
    }

    return (

        <div className={styles.main}>

            <Back setFalse={() => props.setKeys(false)}/>

            <div className={styles.content}>

                {/*<Separator/>*/}

                <div className={styles.field}>{shortHashLong(publicKey)}</div>

                <div className={styles.field + ' ' + styles.button} onClick={() => {
                    // navigator.clipboard.writeText(publicKey)
                    copyToClipboard(publicKey)
                }}>Copy public key
                </div>

                {/*<Separator/>*/}

                <div className={styles.field}>{type === 0 ||  type === 1 ? shortHashLong(privateKey) : privateKey}</div>

                <div className={styles.field + ' ' + styles.button} onClick={() => {
                    navigator.clipboard.writeText(privateKey)
                }}>Copy private key
                </div>

                {/*<Separator/>*/}

                <div className={styles.field}>Open new tab</div>

                <div className={styles.field + ' ' + styles.button}
                     onClick={() => explorerAddress(publicKey)}>
                    Show in blockchain explorer
                </div>

                <div className={styles.field}>Referral</div>

                <div className={styles.field + ' ' + styles.button}
                     onClick={() => copyReferral()}>
                    Copy mining referral code
                </div>

            </div>

            <div className={styles.form}>

                <Separator/>

            </div>
        </div>
    )
}
