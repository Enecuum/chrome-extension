import React, { useEffect, useState } from 'react'
import styles from '../../css/index.module.css'
import Separator from '../../elements/Separator'
import { explorerAddress, getMnemonicPrivateKeyHex, shortHash, shortHashLong } from '../../Utils'
import Back from '../../elements/Back'


const copyText = ('\n\nCopy address to clipboard').toUpperCase()

export default function Keys(props) {

    let [publicKey, setPublicKey] = useState('')
    let [privateKey, setPrivateKey] = useState('')
    let [type, setType] = useState('')
    let [poa, setPoa] = useState(false)
    useEffect(() => {
        loadUser()
            .then()
        userStorage.promise.sendPromise({
            poa: true,
            get: true
        })
            .then(poas => {
                poas.find(el => {
                    if (el.id === publicKey && el.readyState === 1) {
                        setPoa(true)
                    }
                })
            })
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

    let poaSubmit = () => {
        userStorage.promise.sendPromise({
            poa: true,
            account: {
                publicKey,
                privateKey
            }
        })
            .then(() => {
                setPoa(true)
            })
    }

    let disablePoa = () => {
        console.log('disconnect: ' + publicKey)
        userStorage.promise.sendPromise({
            poa: true,
            disconnect: publicKey
        })
            .then(() => {
                setPoa(false)
            })
    }


    return (

        <div className={styles.main}>

            <Back setFalse={() => props.setKeys(false)}/>

            <div className={styles.content}>

                <Separator/>

                <div className={styles.field}>{shortHashLong(publicKey)}</div>

                <div className={styles.field + ' ' + styles.button} onClick={() => {
                    navigator.clipboard.writeText(publicKey)
                }}>Copy public key
                </div>

                <Separator/>

                <div className={styles.field}>{type === 0 || type === 1 ? shortHashLong(privateKey) : privateKey}</div>

                <div className={styles.field + ' ' + styles.button} onClick={() => {
                    navigator.clipboard.writeText(privateKey)
                }}>Copy private key
                </div>

                <Separator/>

                <div className={styles.field}>Open new tab</div>

                <div className={styles.field + ' ' + styles.button}
                     onClick={() => explorerAddress(publicKey)}>
                    Show in blockchain explorer
                </div>

                {privateKey.length === 64 ? <div className={styles.field + ' ' + styles.button}
                                                 onClick={() => {
                                                     if (!poa) {
                                                         poaSubmit()
                                                     } else {
                                                         disablePoa()
                                                     }
                                                 }}>
                    {poa ? 'in work!' : 'PoA validator'}
                </div> : ''}

            </div>

            <div className={styles.form}>


                <Separator/>

            </div>
        </div>
    )
}
