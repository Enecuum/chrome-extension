import React, {useEffect, useState} from 'react'
import styles from '../../../css/index.module.css'
import Separator from '../../../elements/Separator'
import * as bip39 from 'bip39';
import * as bip32 from 'bip32';
import Input from "../../../elements/Input";
import {getMnemonicFirstPrivateKey, getMnemonicHex, mnemonicPath, regexSeed} from "../../../Utils";
import {generateAccountData, generateMnemonicAccountData} from "../../../../user";

let seedLength = 12

export default function ImportMnemonic(props) {

    const [mnemonicString, setMnemonicString] = useState('')
    const [state, setState] = useState(0)
    const [number, setNumber] = useState(0)

    useEffect(() => {
        // console.log(mnemonicString)
    })

    const loginSeed = async (mnemonicString) => {

        let privateKey = getMnemonicFirstPrivateKey(mnemonicString)
        let hex = bip39.mnemonicToSeedSync(mnemonicString)

        // loginAccount(privateKey0, account.seed, account)
        // let privateKey = child.derive(0).privateKey.toString('hex')

        if (privateKey) {

            let data = generateMnemonicAccountData(privateKey, (await userStorage.user.loadUser()), hex)
            data.seedAccountsArray = [0]
            console.log(data)

            await userStorage.promise.sendPromise({
                account: true,
                set: true,
                data: data
            })

            // console.log(data)

            props.login(data)
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
                        // console.log(regexSeed.test(mnemonicString))
                        // console.log(mnemonicString)
                        loginSeed(mnemonicString).then(r => {})
                        props.setImportMnemonic(false)
                    }
                }} className={styles.field + ' ' + styles.button + ' ' + (regexSeed.test(mnemonicString) ? styles.button_blue : '')}>Import Mnemonic
                </div>

                <div onClick={() => {props.setImportMnemonic(false)}} className={styles.field + ' ' + styles.button}>Back</div>

                <Separator/>

            </div>
        </div>
    )
}
