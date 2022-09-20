import React, {useEffect, useState} from 'react'
import styles from '../../css/index.module.css'
import {getMnemonicHex, regexToken, regexOldPrivate} from "../../Utils";
import Input from "../../elements/Input";
import Separator from "../../elements/Separator";
import {account, generateAccountData} from "../../../user";

export default function ImportKey(props) {

    const [keyString, setKeyString] = useState('')

    useEffect(() => {
    })

    let loginKey = async () => {

        if (keyString.length === 66) {
            setKeyString(keyString.substr(2))
        }
        let account = (await userStorage.user.loadUser())
        let data = generateAccountData(keyString, account)

        if (!data.privateKeys.includes(keyString))
            data.privateKeys.push(keyString)

        await userStorage.promise.sendPromise({
            account: true,
            set: true,
            data: data
        })

        props.setImportKey(false)
    }


    return (

        <div className={styles.main}>

            <div className={styles.content}>

                <Input
                    type="text"
                    spellCheck={false}
                    autoComplete={false}
                    autoFocus={false}
                    onChange={async (e) => {
                        setKeyString(e.target.value)
                        // loginSeed(e.target.value)
                    }}
                    value={keyString}
                    className={styles.field + ' ' + styles.inputSeed + ' ' + (regexToken.test(keyString) ? styles.field_correct : '')}
                    placeholder={'64 symbols long random string'}
                    label={'Private Key'}
                />

            </div>

            <div className={styles.form}>

                <div onClick={() => {
                    if (regexToken.test(keyString) || regexOldPrivate.test(keyString)) {
                        // console.log(regexToken.test(keyString))
                        // console.log(keyString)
                        loginKey(keyString).then()
                        // props.setImportKey(false)
                    }
                }}
                     className={styles.field + ' ' + styles.button + ' ' + (regexToken.test(keyString) || regexOldPrivate.test(keyString) ? styles.button_blue : '')}>Import
                    Key
                </div>

                <div onClick={() => {
                    props.setImportKey(false)
                }} className={styles.field + ' ' + styles.button}>Back
                </div>

                <Separator/>

            </div>
        </div>
    )
}
