import React, {useEffect, useState} from "react";
import styles from "../css/index.module.css";
import Separator from "../elements/Separator";
import {regexToken, shortHash} from "../Utils";
import Input from "../elements/Input";
import {NET, NETWORKS} from "../../utils/names";
// import {startPoa} from "../../utils/poa";
import {Publisher} from "../../utils/poa/Publisher";

let status = {
    0: 'CONNECTING',
    1: 'MINING',
    2: 'CLOSING',
    3: 'CLOSED',
    10: 'DUPLICATE KEY',
}

export default function Mining(props) {

    let [readyState, setReadyState] = useState(global.publisher.ws.readyState)

    // let [mining, setMining] = useState(false)

    let [accounts, setAccounts] = useState([])
    let [tokens, setTokens] = useState([])

    let [keys, setKeys] = useState([])

    // userStorage.promise.sendPromise({poa: true, account: {publicKey, privateKey}}).then()

    // let [connect, setConnect] = useState(false)

    // let [host, setHost] = useState('')
    // let [hostCorrect, setHostCorrect] = useState(false)
    // let [token, setToken] = useState('')
    // let [tokenCorrect, setTokenCorrect] = useState(false)

    // let [networks, setNetworks] = useState()
    // let [libNetworks, setLibNetworks] = useState([...Object.entries(ENQWeb.Enq.urls)])
    // let [localNetworks, setLocalNetworks] = useState(JSON.parse(localStorage.getItem('networks')) || [])

    // let [showAdd, setShowAdd] = useState(false)

    let startMining = () => {

        userStorage.user.loadUser().then(account => {

            global.publisher = new Publisher(account, account.token)

            console.log(global.publisher.ws)

            global.publisher.ws.addEventListener('open', function (event) {
                setReadyState(publisher.ws.readyState)
            })

            global.publisher.ws.addEventListener('close', function (event) {
                setReadyState(publisher.ws.readyState)
            })

            global.publisher.ws.addEventListener('error', function (event) {
                setReadyState(publisher.ws.readyState)

            })
        })
    }

    let stopMining = () => {
        global.publisher.ws.close()

        // for (let i = 0; i < accounts.length; i++) {
        //     // accounts[i].pause = true
        //     // accounts[i].mining = false
        // }

        setAccounts([...accounts])

    }

    useEffect(() => {

        userStorage.user.loadUser().then(account => {

            setKeys(account.seedAccountsArray)

            let localAccounts = []
            for (let i = 0; i < account.seedAccountsArray.length; i++) {
                localAccounts.push({
                    i: i + 1,
                    key: '',
                    mining: false,
                    list: true
                })
            }

            setAccounts(localAccounts)
        })

        setTokens(userStorage.tokens.getTokens())
        console.log()

    }, [])



    let renderCards = () => {

        let cards = []

        for (let i = 0; i < accounts.length; i++) {

            let card =
                <div key={i + 'card'} className={styles.card + ' ' + styles.mining_card + ' ' + (accounts[i].mining && readyState === 1 ? styles.mining_card_mine : '')}>
                    <div className={styles.row}>
                        <div>Account M{keys[i] + 1}</div>
                        <div onClick={() => {
                            accounts[i].mining = !accounts[i].mining
                            setAccounts([...accounts])
                        }}>{accounts[i].mining && readyState === 1 ? 'STOP' : 'START'}</div>
                    </div>

                    <div className={styles.card_field}>
                        <div>{shortHash('02e8a2510b0dcc431feae460c5a8c0ac2720484db07c3f014044deefbae3574124')}</div>
                    </div>

                    {accounts[i].list && <div className={styles.card_field}>
                        <div>{(Math.floor(Math.random() * 100)) + ' BIT'}</div>
                    </div>}

                    {!accounts[i].list && <div className={styles.card_field}>
                        <div>{(Math.floor(Math.random() * 100)) + ' BIT'}</div>
                        <div>{(Math.floor(Math.random() * 100)) + ' TEST'}</div>
                        <div>{(Math.floor(Math.random() * 100)) + ' DAR'}</div>
                        <div>{(Math.floor(Math.random() * 100)) + ' RED'}</div>
                        <div>{(Math.floor(Math.random() * 100)) + ' BLUE'}</div>
                        <div>{(Math.floor(Math.random() * 100)) + ' IT'}</div>
                    </div>}

                    <div className={styles.card_field_select} onClick={(() => {
                        accounts[i].list = !accounts[i].list
                        setAccounts([...accounts])
                    })}>{accounts[i].list ? '↓' : '↑'}</div>
                </div>

            cards.push(card)
        }

        return cards
    }

    return (
        <div className={styles.main}>

            <div className={styles.field + ' ' + styles.pointer} onClick={() => {
                props.setMining(false)
            }}>❮ Back
            </div>

            {/*<Separator/>*/}

            <div onClick={readyState === 1 ? stopMining : startMining}
                 className={styles.button_round + ' ' + (readyState === 1 ? styles.mining : '')}>{readyState === 1 ? 'STOP' : 'START'}
            </div>

            <div className={styles.mining_status}>{status[readyState]}</div>

            <Separator/>

            <div className={styles.cards}>
                {renderCards()}
            </div>

            <Separator/>

        </div>
    )
}
