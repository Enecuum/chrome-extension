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

    let [accounts, setAccounts] = useState([])

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

    useEffect(() => {
    }, [])

    let stopMining = () => {
        global.publisher.ws.close()
    }

    useEffect(() => {

        userStorage.user.loadUser().then(account => {

            setKeys(account.seedAccountsArray)

            let localAccounts = []
            for (let i = 0; i < account.seedAccountsArray.length; i++) {
                localAccounts.push({
                    i: i + 1,
                    key: '',
                    mining: true,
                    list: true
                })
            }

            setAccounts(localAccounts)
        })

    }, [])



    let renderCards = () => {

        let cards = []

        for (let i = 0; i < accounts.length; i++) {

            cards.push(
                <div key={i + 'card'} className={styles.card + ' ' + styles.mining_card + ' ' + (accounts[i].mining ? styles.mining_card_mine : '')}>
                    <div className={styles.row}>
                        <div>Account M{keys[i] + 1}</div>
                        <div onClick={() => {
                            accounts[i].mining = !accounts[i].mining
                            setAccounts([...accounts])
                        }}>{accounts[i].mining ? 'STOP' : 'START'}</div>
                    </div>

                    <div>
                        <div className={styles.card_field}>{(Math.floor(Math.random() * 100)) + ' BIT'}</div>
                    </div>

                    <div className={styles.card_field_select} onClick={(() => {
                        accounts[i].list = !accounts[i].list
                        setAccounts([...accounts])
                    })}>{accounts[i].list ? '↓' : '↑'}</div>

                </div>
            )
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
