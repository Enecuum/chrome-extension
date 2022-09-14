import React, { useEffect, useState } from 'react'
import styles from '../css/index.module.css'
import Separator from '../elements/Separator'
import {
    copyToClipboard,
    explorerAddress,
    getMnemonicPrivateKeyHex, regexReferral,
    regexToken,
    shortHash,
    shortHashLong
} from '../Utils'
import Back from "../elements/Back";
import Input from "../elements/Input";

export default function Referral(props) {

    const [referralCode, setReferralCode] = useState('')

    useEffect(() => {

    }, [])

    let copyReferral = () => {

    }

    let handleChangeReferralCode = () => {

    }

    return (

        <div className={styles.main}>

            <Back setFalse={() => props.setReferral(false)}/>

            <div className={styles.content}>

                {/*<Separator/>*/}

                <div className={styles.field}>{'You\'ve unlocked your personal agent'}</div>

                <div className={styles.field}>{'referral code!'}</div>

                <div className={styles.field}>{'ref_77ce6b118a7f33b0856db0a5838...'}</div>

                <div className={styles.field}>{'QR'}</div>

                <div className={styles.field}>{'SHARE'}</div>

                <Input
                    type="text"
                    spellCheck={false}
                    onChange={handleChangeReferralCode}
                    value={referralCode}
                    className={styles.field + ' ' + (regexReferral.test(referralCode) ? styles.field_correct : '')}
                    placeholder="Referral code"
                />

            </div>

        </div>
    )
}
