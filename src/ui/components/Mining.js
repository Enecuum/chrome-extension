import React, {useEffect, useState} from "react";
import styles from "../css/index.module.css";
import Separator from "../elements/Separator";
import {generateIcon, getMnemonicPrivateKeyHex, regexToken, shortHash, showNotification} from "../Utils";
import Input from "../elements/Input";
import {NET, NETWORKS} from "../../utils/names";
// import {startPoa} from "../../utils/poa";
import {Publisher} from "../../utils/poa/publisher";
import {apiController} from "../../utils/apiController";

let status = {
    0: 'CONNECTING',
    1: 'MINING',
    2: 'CLOSING',
    3: 'CLOSED',
    10: 'DUPLICATE KEY',
}

export default function Mining(props) {

    // let [readyState, setReadyState] = useState(global.publisher.ws.readyState)

    let [mining, setMining] = useState(false)

    let [status, setStatus] = useState('LOADING')

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

        showNotification()

        userStorage.promise.sendPromise({poa: true, start: true}).then(miners => {
            console.log(miners)
            setAccounts([...miners])
        })

        setMining(true)

        setStatus('MINING')

        // userStorage.user.loadUser().then(account => {

            // console.log(account)

            // global.publisher = new Publisher(account, account.token)



            // console.log(global.publisher.ws)

            // global.publisher.ws.addEventListener('open', function (event) {
            //     setReadyState(publisher.ws.readyState)
            // })
            //
            // global.publisher.ws.addEventListener('close', function (event) {
            //     setReadyState(publisher.ws.readyState)
            // })
            //
            // global.publisher.ws.addEventListener('error', function (event) {
            //     setReadyState(publisher.ws.readyState)
            //
            // })
        // })
    }

    let stopMining = () => {

        // hideNotification()

        userStorage.promise.sendPromise({poa: true, stop: true}).then(miners => {
            console.log(miners)
            setAccounts([...miners])
        })

        setMining(false)
        setStatus('STOPPED')

        // global.publisher.ws.close()

        // for (let i = 0; i < accounts.length; i++) {
        //     // accounts[i].pause = true
        //     // accounts[i].mining = false
        // }

        // setAccounts([...accounts])
    }

    let selectToken = (publicKey, token) => {

        userStorage.promise.sendPromise({
            poa: true,
            account: {publicKey},
            token,
        }).then(miners => {
            // console.log(miners)
            setAccounts([...miners])
        })

        // console.log(accountId)
        // console.log(token)
        // accounts[accountId].token = token

    }

    let onMiner = (publicKey) => {

        userStorage.promise.sendPromise({
            poa: true,
            account: {publicKey},
            mining: true,
            set: true,
        }).then(miners => {
            // console.log(miners)
            setAccounts([...miners])
        })
    }

    let offMiner = (publicKey) => {

        userStorage.promise.sendPromise({
            poa: true,
            account: {publicKey},
            mining: true,
            set: false,
        }).then(miners => {
            // console.log(miners)
            setAccounts([...miners])
        })
    }

    useEffect(() => {

        userStorage.promise.sendPromise({
            poa: true,
            status: true,
        }).then(status => {
            console.log(status)
            setMining(status.miningProcess)
            // setStatus('INITIALIZATION')
        })

        userStorage.promise.sendPromise({
            poa: true,
            get: true,
        }).then(miners => {
            // console.log(miners)
            setAccounts(miners)
            setStatus('READY')

            for (let i = 0; i < miners.length; i++) {
                apiController.getRewards(miners[i].publicKey).then(rewards => {
                    console.log(rewards)
                    miners[i].rewards = rewards.records
                })
            }
        })



        // userStorage.user.loadUser().then(async account => {

            // setKeys(account.seedAccountsArray)

            // let localAccounts = []
            // for (let i = 0; i < account.seedAccountsArray.length; i++) {
            //
            //     let privateKey = getMnemonicPrivateKeyHex(account.seed, account.seedAccountsArray[i])
            //     const publicKey = ENQWeb.Utils.Sign.getPublicKey(privateKey, true)
            //
            //     let tokens = await getBalance(publicKey)
            //
            //     console.log(tokens)
            //
            //     localAccounts.push({
            //         i: i + 1,
            //         publicKey: publicKey,
            //         mining: false,
            //         list: true,
            //         tokens,
            //         token: tokens[0] ? tokens[0] : '',
            //     })
            // }

            // console.log(localAccounts)

            // setAccounts(localAccounts)
        // })

        // setTokens(userStorage.tokens.getTokens())

    }, [])

    // const getBalance = async (publicKey) => {
    //
    //     let tokens = []
    //
    //     await apiController.getBalanceAll(publicKey)
    //         .then((res) => {
    //
    //             console.log(res)
    //
    //             for (let i in res) {
    //
    //                 // console.log(res[i].token + ' ' + res[i].ticker)
    //
    //                 tokens.push({
    //                     token: res[i].token,
    //                     ticker: res[i].ticker,
    //                     minable: res[i].minable,
    //                     amount: BigInt(res[i].amount),
    //                     decimals: 10 ** res[i].decimals
    //                 })
    //             }
    //
    //             // console.log(res.amount / 1e10)
    //
    //         }).catch((err) => {
    //             console.error('error: ', err)
    //         })
    //
    //     return tokens
    // }


    let renderCards = () => {

        let cards = []

        for (let i = 0; i < accounts.length; i++) {

            let tokens = accounts[i].tokens.map((token) => <div key={token.token}
                                                                onClick={() => token.minable === 0 ? () => {} : selectToken(accounts[i].publicKey, token)}
                                                                className={token.minable === 0 ? styles.card_grid_disabled : (token.token === accounts[i].token.token ? styles.card_grid_select : '')}>
                <div>{token.ticker}</div>
                <div>{(Number(token.amount) / (10 ** token.decimals)).toFixed(0)}</div>
            </div>)

            let card =
                <div key={i + 'card'}
                     className={styles.card + ' ' + styles.mining_card + ' ' + (accounts[i].mining && mining ? styles.mining_card_mine : '')}>
                    <div className={styles.row}>
                        <div>
                            <div>Account M{accounts[i].i + 1}</div>
                            <div className={styles.text_minimum}>{(accounts[i].publisher && accounts[i].publisher.status) || 'Disconnected'}</div>
                        </div>
                        <div onClick={() => {
                            if (accounts[i].mining) {
                                offMiner(accounts[i].publicKey)
                            } else {
                                onMiner(accounts[i].publicKey)
                            }
                        }} className={styles.text_big + (accounts[i].mining ? '' : ' ' + styles.text_black)}>{accounts[i].mining ? 'ON' : 'OFF'}</div>
                    </div>

                    <div className={styles.card_field}>
                        <div>{shortHash(accounts[i].publicKey)}</div>
                    </div>

                    {accounts[i].list && tokens.length > 0 && <div className={styles.card_field_long} onClick={() => {
                        accounts[i].list = !accounts[i].list
                        setAccounts([...accounts])
                    }}>
                        {/*<div>{(Math.floor(Math.random() * 100)) + ' BIT'}</div>*/}
                        <div>{accounts[i].token.ticker}</div>
                        <div>{(Number(accounts[i].token.amount) / (10 ** accounts[i].token.decimals)).toFixed(0)}</div>
                    </div>}

                    {!accounts[i].list && accounts[i].tokens.length > 0 &&
                        <div>
                            {accounts[i].rewards && <div className={styles.text_help}>
                                <div>Last reward: {(Number(accounts[i].rewards[0].amount) / 1e10).toFixed(4) + ' ' + accounts[i].rewards[0].ticker}</div>
                                <div>{new Date(accounts[i].rewards[0].time * 1000).toTimeString()}</div>
                            </div>}

                            <div className={styles.card_field + ' ' + styles.card_grid}>
                                {tokens}
                            </div>
                        </div>}

                    <div className={styles.card_field_select} onClick={(() => {
                        accounts[i].list = !accounts[i].list
                        setAccounts([...accounts])
                    })}>{accounts[i].list ? 'SHOW TOKENS' : 'HIDE'}</div>
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

            <div onClick={mining ? stopMining : startMining}
                 className={styles.button_round + ' ' + (mining ? styles.mining : '')}>{mining ? 'STOP' : 'START'}
            </div>

            <div className={styles.mining_status}>{status}</div>

            <Separator/>

            <div className={styles.cards}>
                {renderCards()}
            </div>

            <Separator/>

        </div>
    )
}
