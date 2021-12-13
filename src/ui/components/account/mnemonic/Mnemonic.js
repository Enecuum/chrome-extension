import React, {useEffect, useState} from 'react'
import styles from '../../../css/index.module.css'
import Separator from '../../../elements/Separator'
import * as bip39 from 'bip39';
import * as bip32 from 'bip32';
import Input from "../../../elements/Input";
import {getMnemonicFirstPrivateKey, getMnemonicHex, mnemonicPath, regexSeed} from "../../../Utils";
import {account as userAccount} from "../../../../user";

let seedLength = 12

export default function Mnemonic(props) {

    const [mnemonicString, setMnemonicString] = useState(bip39.generateMnemonic())
    const [state, setState] = useState(0)
    const [number, setNumber] = useState(0)

    useEffect(() => {
        // console.log(mnemonicString)
    })

    // const addSeed = (mnemonicString) => {
    //     let hex = bip39.mnemonicToSeedSync(mnemonicString)
    //     let node = bip32.fromSeed(hex, null)
    //     let child = node.derivePath("m/44'/2045'/0'/0");
    //
    //     // console.log(child.derive(0).privateKey.toString('hex'))
    //
    //     userStorage.user.loadUser().then(async account => {
    //         account.seed = hex
    //         console.log(account)
    //         await userStorage.promise.sendPromise({
    //             account: true,
    //             set: true,
    //             data: account
    //         })
    //     })
    // }

    const loginSeed = (mnemonicString) => {
        let privateKey0 = getMnemonicFirstPrivateKey(mnemonicString)
        // loginAccount(privateKey0, account.seed, account)
        let account = userStorage.user.loadUser()
        // console.log(account)
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
                // console.log(data)
                props.login(data)
            })
        }
    }

    const renderMnemonic = () => {

        let wordsArray = []
        let words = mnemonicString.split(' ')
        if (state === 0) {
            for (let i = 0; i < words.length; i++) {
                wordsArray.push(renderWord(i + 1, words[i]))
            }
        }
        if (state === 1) {
            let wordsList = mnemonicString.split(' ')
            wordsList.splice(number - 1, 1)
            wordsList.splice(0, words.length / 2)
            wordsList.push(words[number - 1])
            wordsList.sort(() => .5 - Math.random())
            for (let i = 0; i < wordsList.length; i++) {
                wordsArray.push(renderWord('', wordsList[i], wordsList[i] === words[number - 1] ? () => {
                    // wordsList[i] === words[number - 1] ? '!' :
                    let generatedNumber = Math.floor(Math.random() * seedLength) + 1
                    setNumber(generatedNumber === number ? seedLength - number : generatedNumber)
                    setState(2)
                } : () => setState(0), i))
            }
        }
        if (state === 2) {
            let wordsList = mnemonicString.split(' ')
            wordsList.splice(number - 1, 1)
            wordsList.splice(0, words.length / 2)
            wordsList.push(words[number - 1])
            wordsList.sort(() => .5 - Math.random())
            for (let i = 0; i < wordsList.length; i++) {
                wordsArray.push(renderWord('', wordsList[i], wordsList[i] === words[number - 1] ? () => {
                    loginSeed(mnemonicString)
                    props.setMnemonic(false)
                } : () => setState(0), i))
            }
        }


        return wordsArray
    }

    const renderWord = (i, word, onClick, key = i) => {
        return (<div key={key} onClick={onClick}>
            <div className={styles.mnemonicIndex}>
                {i}
            </div>
            <div>
                {word}
            </div>
        </div>)
    }

    return (

        <div className={styles.main}>

            <div className={styles.content}>

                {state === 0 && <div className={styles.field}>
                    <div>Please backup your mnemonic</div>
                    <div>before using the wallet</div>
                </div>}

                {state > 0 && <div className={styles.field}>
                    <div>Select the word with the</div>
                    <div>corresponding number</div>
                </div>}

                {state > 0 && <div className={styles.field + ' ' + styles.text_big}>#{number}</div>}

                <div className={styles.mnemonicGrid}>
                    {renderMnemonic(state)}
                </div>

            </div>

            <div className={styles.form}>

                {state === 0 && <div onClick={() => {
                    navigator.clipboard.writeText(mnemonicString)
                }}
                                     className={styles.field + ' ' + styles.button}>Copy
                </div>}

                <div className={`${styles.buttons_field}`}>

                    <div onClick={() => {
                        // if (state === -1)

                        if (state === 0) {
                            // setState(-1)
                            // setMnemonicString('')
                            props.setMnemonic(false)
                        }
                        if (state === 1)
                            setState(0)
                        if (state === 2)
                            setState(0)
                    }} className={styles.field + ' ' + styles.button}>Back
                    </div>

                    {/*{state === -1 && <div onClick={() => {*/}
                    {/*    setMnemonicString(bip39.generateMnemonic())*/}
                    {/*    setState(0)*/}
                    {/*}} className={styles.field + ' ' + styles.button}>Generate*/}
                    {/*</div>}*/}

                    {(state === 1 || state === 2) && <div onClick={() => {}} className={styles.field + ' ' + styles.button + ' ' + styles.button_disabled}>&nbsp;</div>}

                    {state === 0 && <div onClick={() => {
                        if (state === 0) {
                            // TODO seedLength
                            setNumber(Math.floor(Math.random() * seedLength) + 1)
                            setState(1)
                        }
                        if (state === 1) {
                            setState(2)
                        }
                        if (state === 2)
                            props.setMnemonic(false)

                    }} className={styles.field + ' ' + styles.button}>Next
                    </div>}

                </div>

                <Separator/>

            </div>
        </div>
    )
}
