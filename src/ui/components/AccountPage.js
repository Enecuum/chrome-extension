import React, {useState, useEffect} from 'react'
import styles from '../css/index.module.css'
import Separator from '../elements/Separator'
import elements from '../css/elements.module.css'
import {shortHash} from '../Utils'


const copyText = ('\n\nCopy address to clipboard').toUpperCase()

export default function AccountPage(props) {



    return (
        <div className={styles.main}>

            <Separator/>
            <Separator/>
            <Separator/>

            <div className={styles.data}>

                <div className={styles.transaction_address_copy}>Public key</div>

                <div
                    className={styles.transaction_type}
                    onClick={() => {
                        navigator.clipboard.writeText(props.user.publicKey)
                    }} title={props.user.publicKey + copyText}>{shortHash(props.user.publicKey)}</div>

                <Separator/>

                <div className={styles.transaction_address_copy}>Private key</div>

                <div
                    className={styles.transaction_type}
                    onClick={() => {
                        navigator.clipboard.writeText(props.user.privateKey)
                    }} title={props.user.privateKey + copyText}>{shortHash(props.user.privateKey)}</div>


                <div className={styles.transaction_url}>{props.user.net}</div>

            </div>

            <div className={styles.form}>

                <div onClick={()=>props.setAccountPage(false)}
                     className={styles.field + ' ' + styles.button }>Back
                </div>

                <Separator/>

            </div>
        </div>
    )
}
