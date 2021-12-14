import React, {useEffect, useState} from 'react'
import styles from '../../css/index.module.css'
import {getMnemonicHex, regexToken} from "../../Utils";
import Input from "../../elements/Input";
import Separator from "../../elements/Separator";
import {account} from "../../../user";

export default function ImportKey(props) {

    const [keyString, setKeyString] = useState('')

    useEffect(() => {
    })

    let loginKey = async () => {
        let account = await userStorage.user.loadUser()

        if (!account.privateKeys.includes(keyString)) {
            account.privateKeys.push(keyString)
        }

        let data = {
            ...account,
            publicKey: ENQWeb.Utils.Sign.getPublicKey(keyString, true),
            privateKey: keyString,
            accountIndex: 1,
        }
        userStorage.promise.sendPromise({
            account: true,
            set: true,
            data: data
        }).then(r => {
            // props.login(data)
        })
    }


    return (

        <div className={styles.main}>

            <div className={styles.content}>

                <Input
                    type="text"
                    spellCheck={false}
                    autoComplete={false}
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
                    if (regexToken.test(keyString)) {
                        console.log(regexToken.test(keyString))
                        console.log(keyString)
                        loginKey(keyString).then()
                        // props.setImportKey(false)
                    }
                }} className={styles.field + ' ' + styles.button + ' ' + (regexToken.test(keyString) ? styles.button_blue : '')}>Import Key
                </div>

                <div onClick={() => {props.setImportKey(false)}} className={styles.field + ' ' + styles.button}>Back</div>

                <Separator/>

            </div>
        </div>
    )
}