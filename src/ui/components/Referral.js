import React, {useEffect, useState} from 'react'
import styles from '../css/index.module.css'
import Separator from '../elements/Separator'
import {
    copyToClipboard,
    pasteFromClipboard, REF_PREFIX,
    regexReferral, xor, XOR_STRING,
} from '../Utils'
import Back from "../elements/Back";
import Input from "../elements/Input";
import QRCode from "qrcode";
import {Share} from '@capacitor/share';
import {REFERRAL} from "../../utils/names";

export default function Referral(props) {

    const [userReferralCode, setUserReferralCode] = useState('')
    const [referralCode, setReferralCode] = useState(localStorage.getItem(REFERRAL) || '')
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
        userStorage.user.loadUser().then(account => {
            let userReferral = REF_PREFIX + xor(account.publicKey, XOR_STRING)
            setUserReferralCode(userReferral)
            generateQR(userReferral).then()
        })
    }, [])

    let copyReferral = () => {

    }

    let handleChangeReferralCode = (e) => {
        localStorage.setItem(REFERRAL, e.target.value)
        setReferralCode(e.target.value)
    }

    let shareReferral = () => {
        Share.share({
            title: 'Referral code',
            text: 'Share your referral code',
            url: userReferralCode,
            dialogTitle: 'Share with friends',
        }).then(r => {
        });
    }

    // let activate = () => {
    //     console.log(referralCode)
    //     localStorage.setItem(REFERRAL, referralCode)
    // }

    let scan = () => {
        props.setCamera(true)
    }

    return (

        <div className={styles.main}>

            <Back setFalse={() => props.setReferral(false)}/>

            <div className={styles.content}>

                {/*<Separator/>*/}

                {/*<div className={styles.text}>{'You\'ve unlocked your personal referral code!'}</div>*/}

                {/*<div className={styles.field}>{''}</div>*/}

                {/*<div className={styles.field}>{''}</div>*/}

                {/*<Input*/}
                {/*    type="text"*/}
                {/*    spellCheck={false}*/}
                {/*    disabled={true}*/}
                {/*    label={'Your referral code'}*/}
                {/*    onChange={() => {}}*/}
                {/*    value={userReferralCode}*/}
                {/*    className={styles.field}*/}
                {/*    placeholder={userReferralCode}*/}
                {/*/>*/}

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

                {/*<div className={styles.qr}>*/}
                {/*    <img src={imageURL}/>*/}
                {/*</div>*/}

            </div>

            <div className={styles.form}>

                <div
                    onClick={() => {
                        pasteFromClipboard().then(refCode => {
                            console.log(refCode.value)
                            setReferralCode(refCode.value)
                            localStorage.setItem(REFERRAL, refCode.value)
                        })
                    }}
                    className={`${styles.field} ${styles.button} ${styles.button_blue}`}>
                    Paste
                </div>

                {/*<div*/}
                {/*    onClick={() => {*/}
                {/*        copyToClipboard(userReferralCode)*/}
                {/*    }}*/}
                {/*    className={`${styles.field} ${styles.button} ${styles.button_blue}`}>*/}
                {/*    Copy*/}
                {/*</div>*/}

                {/*<div*/}
                {/*    onClick={() => {*/}
                {/*        shareReferral()*/}
                {/*    }}*/}
                {/*    className={`${styles.field} ${styles.button} ${styles.button_blue}`}>*/}
                {/*    Share*/}
                {/*</div>*/}

                {/*<div*/}
                {/*    onClick={() => {*/}
                {/*        activate()*/}
                {/*    }}*/}
                {/*    className={`${styles.field} ${styles.button} ${styles.button_blue}`}>*/}
                {/*    Activate*/}
                {/*</div>*/}

                {/*<div*/}
                {/*    onClick={() => {*/}
                {/*        scan()*/}
                {/*    }}*/}
                {/*    className={`${styles.field} ${styles.button} ${styles.button_blue}`}>*/}
                {/*    Scan*/}
                {/*</div>*/}

                <Separator/>

            </div>

        </div>
    )
}
