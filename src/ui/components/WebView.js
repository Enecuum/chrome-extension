import React, {useState} from "react"
import styles from "../css/index.module.css"
import Separator from "../elements/Separator"
import Header from "../elements/Header"
import {regexSeed} from "../Utils";
import Input from "../elements/Input";

// let defaultUrl = 'http://localhost:1234/#!action=swap'
let defaultUrl = 'https://devapp.enex.space/#!action=swap'

export default function WebView(props) {

    let [url, setUrl] = useState(defaultUrl)

    let confirm = () => {}

    let handleChangeUrl = (e) => {
        setUrl(e.target.value)
    }

    return (
        <div className={styles.main}>

            <div>
                <div className={styles.field} onClick={() => props.setWebView(false)}>❮ Back</div>
            </div>

            {/*<Header clickMenu={() => props.setWebView(false)} user={{}}/>*/}

            {/*<Separator/>*/}

            <Input
                type="text"
                spellCheck={false}
                onChange={handleChangeUrl}
                value={url}
                className={styles.field}
                label={'URL'}
                placeholder={'Place url of DEX here'}
            />

            <div className={styles.dapps}>
                <div onClick={() => setUrl('https://app.enex.space')}>ENEX</div>
                <div onClick={() => setUrl('https://bit-wallet.enecuum.com')}>WALLET</div>
                <div onClick={() => setUrl('https://faucet-bit.enecuum.com')}>FAUCET</div>
                <div onClick={() => {}}>SAVE</div>

            </div>

            <iframe src={url}/>

        </div>
    )
}
