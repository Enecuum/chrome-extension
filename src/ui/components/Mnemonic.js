import React, {useEffect, useState} from 'react'
import styles from '../css/index.module.css'
import Separator from '../elements/Separator'
import * as bip39 from 'bip39';
import * as bip32 from 'bip32';

let seedLength = 12

export default function Mnemonic(props) {

    const [mnemonicString, setMnemonicString] = useState(bip39.generateMnemonic())
    const [state, setState] = useState(0)
    const [number, setNumber] = useState(0)

    useEffect(() => {
        console.log(mnemonicString)
    })

    const showKeys = () => {
        let hex = bip39.mnemonicToSeedSync(mnemonicString)
        let node = bip32.fromSeed(hex, null)
        let child = node.derivePath("m/44'/2045'/0'/0");

        // console.log(child.derive(0).privateKey.toString('hex'))

        disk.user.loadUser().then(async account => {
            account.seed = hex
            await disk.promise.sendPromise({
                account: true,
                set: true,
                data: account
            })
        })
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
                } : () => setState(0)))
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
                    showKeys()
                    props.setMnemonic(false)
                } : () => setState(0)))
            }
        }


        return wordsArray
    }

    const renderWord = (i, word, onClick) => {
        return (<div key={word} onClick={onClick}>
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

                <Separator/>

                {state === 0 && <div className={styles.field}>
                    <div>Please backup your mnemonic</div>
                    <div>before start using wallet</div>
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

                <div onClick={() => {
                    if (state === 0)
                        props.setMnemonic(false)
                    if (state === 1)
                        setState(0)
                    if (state === 2)
                        setState(0)
                }} className={styles.field + ' ' + styles.button}>Back
                </div>

                <Separator/>

            </div>
        </div>
    )
}
