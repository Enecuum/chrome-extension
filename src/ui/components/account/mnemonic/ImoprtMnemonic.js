import React, {useEffect, useState} from 'react'
import styles from '../../../css/index.module.css'
import Separator from '../../../elements/Separator'
import * as bip39 from 'bip39';
import * as bip32 from 'bip32';
import Input from "../../../elements/Input";
import {getMnemonicFirstPrivateKey, getMnemonicHex, mnemonicPath, regexSeed} from "../../../Utils";
import {account as userAccount} from "../../../../user";

let seedLength = 12

export default function ImportMnemonic(props) {

    const [mnemonicString, setMnemonicString] = useState('')
    const [state, setState] = useState(0)
    const [number, setNumber] = useState(0)

    useEffect(() => {
        // console.log(mnemonicString)
    })

    const loginSeed = (mnemonicString) => {
        let privateKey0 = getMnemonicFirstPrivateKey(mnemonicString)
        // loginAccount(privateKey0, account.seed, account)
        let account = userStorage.user.loadUser()
        console.log(account)
        if (!account.publickKey)
            account = userAccount

        const publicKey0 = ENQWeb.Utils.Sign.getPublicKey(privateKey0, true)
        if (publicKey0) {
            let data = {
                ...account,
                publicKey: publicKey0,
                privateKey: privateKey0,
                net: ENQWeb.Net.provider,
                token: ENQWeb.Enq.ticker,
                seed: getMnemonicHex(mnemonicString),
            }
            userStorage.promise.sendPromise({
                account: true,
                set: true,
                data: data
            }).then(r => {
                // props.login(data)
            })
        }
    }

    return (

        <div className={styles.main}>

            <div className={styles.content}>

                <Input
                    type="text"
                    spellCheck={false}
                    autoComplete={false}
                    onChange={async (e) => {
                        setMnemonicString(e.target.value)
                        // loginSeed(e.target.value)
                    }}
                    value={mnemonicString}
                    className={styles.field + ' ' + styles.inputSeed + ' ' + (regexSeed.test(mnemonicString) ? styles.field_correct : '')}
                    placeholder={'12+ words'}
                    label={'Seed Phrase'}
                />

            </div>

            <div className={styles.form}>

                <div onClick={() => {
                    if (regexSeed.test(mnemonicString)) {
                        console.log(regexSeed.test(mnemonicString))
                        console.log(mnemonicString)
                        loginSeed(mnemonicString)
                        // props.setImportMnemonic(false)
                    }
                }} className={styles.field + ' ' + styles.button + ' ' + (regexSeed.test(mnemonicString) ? styles.button_blue : '')}>Import mnemonic
                </div>

                <div onClick={() => {props.setImportMnemonic(false)}} className={styles.field + ' ' + styles.button}>Back</div>

                <Separator/>

            </div>
        </div>
    )
}
