import React from 'react'
import styles from '../css/index.module.css'
import Separator from '../elements/Separator'
import {explorerAddress, shortHash, shortHashLong} from '../Utils'


const copyText = ('\n\nCopy address to clipboard').toUpperCase()

export default function Keys(props) {

    return (

        <div className={styles.main}>

            <div className={styles.content}>

                <Separator/>

                <div className={styles.field}>{shortHashLong(props.user.publicKey)}</div>

                <div className={styles.field + ' ' + styles.button} onClick={() => {
                    navigator.clipboard.writeText(props.user.publicKey)
                }}>Copy public key</div>

                <Separator/>

                <div className={styles.field}>{shortHashLong(props.user.privateKey)}</div>

                <div className={styles.field + ' ' + styles.button} onClick={() => {
                    navigator.clipboard.writeText(props.user.privateKey)
                }}>Copy private key</div>

                <Separator/>

                <div className={styles.field}>Open new tab</div>

                <div className={styles.field + ' ' + styles.button} onClick={() => explorerAddress(props.user.publicKey)}>
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
