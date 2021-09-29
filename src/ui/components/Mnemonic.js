import React, {useState} from 'react'
import styles from '../css/index.module.css'
import Separator from '../elements/Separator'
import {explorerAddress, shortHash, shortHashLong} from '../Utils'

export default function Mnemonic(props) {

    const [mnemonicString, setMnemonicString] = useState('seed sock milk update focus rotate barely fade car face mechanic mercy')
    const [state, setState] = useState(0)
    const [number, setNumber] = useState(0)
    //props.setMnemonic(false)

    const renderMnemonic = () => {
        let wordsArray = []
        let words = mnemonicString.split(' ')
        let wordsList = state === 0 ? words : words.splice(0, words.length / 2).sort( () => .5 - Math.random())
        console.log(wordsList)
        for (let i = 0; i < wordsList.length; i++) {
            wordsArray.push(
                <div key={words[i]}>
                    <div className={styles.mnemonicIndex}>
                        {state === 0 ? i : ' '}
                    </div>
                    <div>
                        {wordsList[i]}
                    </div>
                </div>
            )
        }
        return wordsArray
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

                <div onClick={() => {navigator.clipboard.writeText(mnemonicString)}}
                     className={styles.field + ' ' + styles.button}>Copy
                </div>

                <div onClick={() => {
                    if (state === 0)
                        setState(1)
                    if (state === 1)
                        setState(2)
                    if (state === 2)
                        props.setMnemonic(false)
                }}
                     className={styles.field + ' ' + styles.button}>Next
                </div>

                <Separator/>

            </div>
        </div>
    )
}
