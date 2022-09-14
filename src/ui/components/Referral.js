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
import QRCode from "qrcode";

export default function Referral(props) {

    const [referralCode, setReferralCode] = useState('')
    const [imageURL, setImageURL] = useState('')

    const generateQR = async text => {
        try {
            let url = await QRCode.toDataURL(text)
            setImageURL(url)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        generateQR('ref_77ce6b118a7f33b0856db0a5838...').then()
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

                {/*<div className={styles.text}>{'You\'ve unlocked your personal referral code!'}</div>*/}

                {/*<div className={styles.field}>{''}</div>*/}

                {/*<div className={styles.field}>{''}</div>*/}

                <Input
                    type="text"
                    spellCheck={false}
                    disabled={true}
                    label={'Your referral code'}
                    onChange={handleChangeReferralCode}
                    value={referralCode}
                    className={styles.field + ' ' + (regexReferral.test(referralCode) ? styles.field_correct : '')}
                    placeholder="ref_77ce6b118a7f33b0856db0a5838..."
                />

                <Separator/>

                <Separator/>

                <div className={styles.qr}>
                    <img src={imageURL}/>
                </div>

                <div className={styles.field}>{'SHARE'}</div>

                <Input
                    type="text"
                    spellCheck={false}
                    disabled={false}
                    label={'Referral code'}
                    onChange={handleChangeReferralCode}
                    value={referralCode}
                    className={styles.field + ' ' + (regexReferral.test(referralCode) ? styles.field_correct : '')}
                    placeholder="Insert referral code here"
                />

            </div>

        </div>
    )
}
