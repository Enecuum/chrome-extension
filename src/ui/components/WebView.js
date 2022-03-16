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

            {/*<div onClick={() => props.setWebView(false)}*/}
            {/*     className={styles.field + ' ' + styles.button}>Back</div>*/}

            <Header clickMenu={() => props.setWebView(false)} user={{}}/>

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

            <iframe src={url}/>

        </div>
    )
}
