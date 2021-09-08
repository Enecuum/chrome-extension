import React, {useState} from "react";
import styles from "../../css/index.module.css";
import Separator from "../../elements/Separator";
import {regexAddress, shortHash, shortHashLong} from "../../Utils";

export default function Network(props) {

    let [name, setName] = useState('')
    let [host, setHost] = useState('')
    let [hostCorrect, setHostCorrect] = useState(false)
    let [token, setToken] = useState('')

    let [networks, setNetworks] = useState(Object.entries(ENQWeb.Enq.urls))

    let checkHost = (host) => {

        setHostCorrect(false)

        let url
        try {
            url = new URL(host);
            console.log(url)
        } catch (_) {
            console.log(false)
            setToken('')
            return false;
        }

        fetch(host + '/api/v1/native_token')
            .then(response => response.json())
            .then(data => {

                console.log(data)

                if (data.hash && data.hash.length > 0) {
                    console.log(true)
                    setName(data.caption)
                    setToken(data.hash)
                    setHostCorrect(true)
                }
            })
            .catch(e => {
                setHostCorrect(false)
                setToken('')
            })
    }

    let setNet = async (value = this.state.host) => {

        // let value = this.state.host
        // console.log(value)

        localStorage.setItem('net', value)
        ENQWeb.Net.provider = value


        await disk.user.loadUser()
            .then(async account => {
                account.net = value
                account.token = ENQWeb.Enq.ticker
                await disk.promise.sendPromise({
                    account: true,
                    set: true,
                    data: account
                })
            })

        cacheTokens().then(() => {
            location.reload(false)
        })
    }

    let testHost = (host) => {
        return true
    }

    let checkURL = () => {
        // console.log(this.state.url)
        // ENQWeb.Net.provider = this.state.url
        // disk.user.setNet(ENQWeb.Net.currentProvider)

        // let connect = false
        // if (connect) {
        //     console.log('')
        // }
    }

    let getCards = () => {

        let cards = []

        for (let i = 0; i < networks.length; i++) {

            let current = ENQWeb.Enq.provider === networks[i][1]

            cards.push(
                <div key={i} className={styles.card + ' ' + (current ? '' : styles.card_select)} onClick={(current ? () => {} : () => setNet(networks[i][1]))}>
                    <div className={styles.card_title}>{networks[i][1].replace('https://', '').replace('.enecuum.com', '').toUpperCase()}</div>
                    <div className={styles.card_field}>{networks[i][1]}</div>
                    <div className={styles.card_field}>{shortHash(ENQWeb.Enq.token[networks[i][1]])}</div>
                    <div className={styles.card_field_select}>{current ? 'CURRENT' : 'SELECT'}</div>
                </div>
            )
        }

        return cards
    }

    return (
        <div className={styles.main}>

            <div className={styles.content}>

                <input type="text"
                       spellCheck={false}
                       onChange={(e) => setName(e.target.value)}
                       value={name}
                       className={styles.field + ' ' + (name.length > 0 ? styles.field_correct : '')}
                       placeholder={'Network short name'}
                />

                <input type="text"
                       spellCheck={false}
                       onChange={async (e) => {
                           setHost(e.target.value)
                           await checkHost(e.target.value)
                       }}
                       value={host}
                       className={styles.field + ' ' + (hostCorrect ? styles.field_correct : '')}
                       placeholder={'Host name, start with https://'}
                />

                <input type="text"
                       spellCheck={false}
                       onChange={(e) => setToken((e.target.value))}
                       value={token}
                       disabled={hostCorrect}
                       className={styles.field + ' ' + (hostCorrect ? styles.field_correct : '')}
                       placeholder={'Token, something like 00000...'}
                />

            </div>

            <div className={styles.cards_container}>
                <div className={styles.cards}>
                    {getCards()}
                </div>
            </div>

            <div className={styles.form}>

                <div onClick={setNet}
                     className={styles.field + ' ' + styles.button + ' ' + (hostCorrect ? styles.button_blue : '')}>Set
                </div>

                <div onClick={() => {props.setNetwork(false)}}
                     className={styles.field + ' ' + styles.button + ' ' + styles.button_blue}>Back
                </div>

                <Separator/>

            </div>

        </div>
    )
}
