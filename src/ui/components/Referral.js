import React, { useEffect, useState } from 'react'
import styles from '../css/index.module.css'
import Separator from '../elements/Separator'
import {
    copyToClipboard,
    pasteFromClipboard,
    regexReferral,
} from '../Utils'
import Back from "../elements/Back";
import Input from "../elements/Input";
import QRCode from "qrcode";
import { Share } from '@capacitor/share';

const DEFAULT_REFERRAL = 'ref_7690e00108860ff3daf4d860a19f2b8e2a03d88c5d433fe440dd530cbd0552e437'
const REF_PREFIX = 'ref_'
const XOR_STRING = "750D7F2B34CA3DF1D6B7878DEBC8CF9A56BCB51A58435B5BCFB7E82EE09FA8BE75"

function xorEncryption(s, key) {
    const slen = s.length, keylen = key.length;
    let result = '';
    for (let i = 0; i < slen; i++) {
        result += String.fromCharCode(s.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
}

export default function Referral(props) {

    const [userReferralCode, setUserReferralCode] = useState('')
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
        // let publicKey = '02c3143abeb50e4153da372868490277c14b2877f05b477e4671722152b0112473'
        userStorage.user.loadUser().then(account => {
            console.log(account.publicKey)
            let userReferral = REF_PREFIX + xorEncryption(account.publicKey, XOR_STRING)
            console.log(userReferral)
            setUserReferralCode(userReferral)
            generateQR(userReferral).then()
        })
    }, [])

    let copyReferral = () => {

    }

    let handleChangeReferralCode = (e) => {
        setReferralCode(e.target.value)
    }

    let shareReferral = () => {
        Share.share({
            title: 'Referral code',
            text: 'Share your referral code',
            url: userReferralCode,
            dialogTitle: 'Share with friends',
        }).then(r => {});
    }

    let activate = () => {
        console.log(referralCode)
    }

    let scan = () => {

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
                    value={userReferralCode}
                    className={styles.field + ' ' + (regexReferral.test(referralCode) ? styles.field_correct : '')}
                    placeholder={userReferralCode}
                />

                {/*<Separator/>*/}

                {/*<Separator/>*/}

                {/*<div className={styles.field}>{'SHARE'}</div>*/}

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

                <div className={styles.qr}>
                    <img src={imageURL}/>
                </div>

            </div>

            <div className={styles.form}>

                <div
                    onClick={async () => {
                        setReferralCode(await pasteFromClipboard())
                    }}
                    className={`${styles.field} ${styles.button} ${styles.button_blue}`}>
                    Paste
                </div>

                <div
                    onClick={() => {copyToClipboard(userReferralCode)}}
                    className={`${styles.field} ${styles.button} ${styles.button_blue}`}>
                    Copy
                </div>

                <div
                    onClick={() => {shareReferral()}}
                    className={`${styles.field} ${styles.button} ${styles.button_blue}`}>
                    Share
                </div>

                <div
                    onClick={() => {activate()}}
                    className={`${styles.field} ${styles.button} ${styles.button_blue}`}>
                    Activate
                </div>

                <div
                    onClick={() => {scan()}}
                    className={`${styles.field} ${styles.button} ${styles.button_blue}`}>
                    Scan
                </div>

                <Separator/>

            </div>

        </div>
    )
}
