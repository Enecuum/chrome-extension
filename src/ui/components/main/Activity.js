import styles from '../../css/index.module.css'
import React, { useEffect, useState } from 'react'
import { explorerAddress, explorerTX, shortHash } from '../../Utils'
import { apiController } from '../../../utils/apiController'
import { globalState } from '../../../globalState'

const names = {
    enable: 'Share account address',
    tx: 'Send transaction',
    iin: 'Transaction in',
    iout: 'Transaction out',
    sign: 'Sign message'
}


export default function Activity(props) {

    const [activity, setActivity] = useState(userStorage.list.listOfTask())
    const [history, setHistory] = useState([])

    const [allTokens, setAllTokens] = useState((userStorage.tokens.getTokens()).tokens ? (userStorage.tokens.getTokens()).tokens : {})


    const findTickerInCache = async (hash) => {
        // console.log(allTokens)
        let ticker = allTokens[hash] !== undefined ? allTokens[hash] : (await apiController.getTokenInfo(hash)).ticker
        // console.log(ticker)
        return ticker
    }

    const getHistory = async () => {

        // console.log('getHistory')

        // console.log(globalState.getNetworkState(ENQWeb.Enq.provider))
        let globalStateHistory = globalState.getNetworkState(ENQWeb.Enq.provider).history[props.user.publicKey] || []
        // console.log(globalStateHistory)
        setHistory(globalStateHistory)

        let history = {}
        history.records = []
        for (let i = 0; i < 5; i++) {
            let historyRecords = await apiController.getAccountTransactions(props.user.publicKey, i)
            history.records = history.records.concat(historyRecords.records)
        }

        let oldActivity = []
        for (let id in history.records) {
            if (history.records[id]) {
                oldActivity.push({
                    status: history.records[id].status,
                    data: {
                        date: history.records[id].time * 1000,
                        feeTicker: false,
                        feeDecimals: false,
                        decimals: props.decimals[history.records[id].token_hash] || 1e10,
                        ticker: false,
                        fee_type: history.records[id].fee_type,
                        fee: history.records[id].fee_value
                    },
                    rectype: history.records[id].rectype,
                    tx: {
                        to: history.records[id].rectype === 'iin' ? props.user.publicKey : '00000',
                        from: {
                            pubkey: history.records[id].rectype !== 'iin' ? props.user.publicKey : '00000',
                        },
                        data: history.records[id].data,
                        hash: history.records[id].hash,
                        fee_value: history.records[id].fee_value,
                        tokenHash: history.records[id].token_hash,
                        ticker: await findTickerInCache(history.records[id].token_hash),
                        value: history.records[id].amount * (history.records[id].rectype === 'iin' ? 1 : -1)
                    },
                    cb: {
                        taskId: 0,
                    },
                    type: history.records[id].rectype
                })
            }
        }

        setHistory(oldActivity)
        globalState.setHistory(ENQWeb.Enq.provider, props.user.publicKey, oldActivity)
        globalState.save().then()
    }

    let renderHistory = () => {

        let historyArray = history

        // console.log(history)

        // console.log(props.user.token)
        // console.log(historyArray)

        const historyElements = []
        // || item.tx.data.includes(props.user.token)

        // TODO only trusted tokens
        let filteredHistory = props.user.token && props.user.token !== props.getMainToken() ? historyArray.filter(item => item.tx.tokenHash === props.user.token) : historyArray
        // console.log(filteredHistory)

        for (const key in filteredHistory) {
            // console.log(filteredHistory[key].tx.tokenHash === props.user.token)
            // console.log(filteredHistory[key].tx.tokenHash)
            const item = filteredHistory[key]
            // console.log(item.tx.tokenHash)
            // console.log(decimals)
            // console.log(decimals.hasOwnProperty(item.tx.tokenHash))
            // if (!decimals.hasOwnProperty(item.tx.tokenHash)) {
            //     apiController.getTokenInfo(item.tx.tokenHash)
            //         .then(token => {
            //             try {
            //                 decimals[item.tx.tokenHash] = (10 ** token[0]['decimals'])
            //             } catch (e) {
            //                 decimals[item.tx.tokenHash] = 1e10
            //             }
            //         })
            // }

            // console.log(item.data.date)
            // console.log(new Date().getTime() - (1000 * 60 * 60 * 24))

            let today = item.data.date > new Date().getTime() - (1000 * 60 * 60 * 24)

            // console.log(item)
            // console.log(item.tx)
            historyElements.push(
                <div
                    key={key} onClick={() => {
                    //TODO
                    if (item.type === 'iin') {
                        props.setTransactionHistory(item)
                    }
                    if (item.type === 'iout') {
                        props.setTransactionHistory(item)
                    }
                }} className={`${styles.activity + (today ? ' ' + styles.today : '')}`}
                >
                    <img className={styles.icon + (item.status === 2 ? (' ' + styles.reject) : '')}
                         src={(item.tx.value > 0 ? './images/icons/22.png' : './images/icons/12.png')}
                         alt=""/>
                    <div>
                        <div>{names[item.type]}</div>
                        <div className={styles.time}>
                            {new Date(item.data.date).toISOString()
                                .slice(0, 10)}
                            <div className={styles.history_link}
                                 onClick={() => explorerTX(item.tx.hash)}>{shortHash(item.tx.hash)}</div>
                        </div>
                    </div>
                    {item.tx ?
                        <div className={styles.activity_data}>
                            {item.type === 'iout' ?
                                <div>{(item.tx.value ?
                                    ((item.tx.value) / (props.decimals[item.tx.tokenHash] || 1e10)) :
                                    (item.tx.amount / (props.decimals[item.tx.tokenHash] || 1e10)))
                                + ' ' +
                                (item.tx.ticker ? item.tx.ticker : 'COIN')}</div>
                                :
                                <div>{(item.tx.value ?
                                    ((item.tx.value - item.tx.fee_value) / (props.decimals[item.tx.tokenHash] || 1e10)) :
                                    (item.tx.amount / (props.decimals[item.tx.tokenHash] || 1e10)))
                                + ' ' +
                                (item.tx.ticker ? item.tx.ticker : 'COIN')}</div>}


                        </div> : ''}
                </div>,
            )
        }
        return historyElements
    }

    //Reject all
    let rejectAll = async () => {
        await asyncRequest({ reject_all: true })
        setActivity([])
    }

    const renderActivity = () => {

        let activityElements = []

        for (const key in activity) {
            const item = activity[key]
            // console.log(item)
            activityElements.push(
                <div
                    key={key} onClick={() => {
                    if (item.type === 'enable') {
                        props.setPublicKeyRequest(item)
                    }
                    if (item.type === 'tx') {
                        props.setTransactionRequest(item)
                    }
                    if (item.type === 'sign') {
                        props.setSignRequest(item)
                    }
                }} className={`${styles.activity}`}>
                    <img className={styles.icon}
                         src={(item.type === 'enable' ? './images/icons/checkbox2.png' : './images/icons/checkbox1.png')}
                         alt=""/>
                    <div>
                        <div>{names[item.type]}</div>
                        <div className={styles.time}>
                            {new Date(item.data.date).toISOString()
                                .slice(0, 10) + ' '}
                            {(item.tx ? <div className={styles.history_link}
                                             onClick={() => explorerAddress(item.tx.to)}>To: {shortHash(item.tx.to)}</div> : item.cb.url)}
                        </div>
                    </div>
                    {item.tx ?
                        <div className={styles.activity_data}>

                            <div>{'-' + (item.tx.value ? (item.tx.value / (props.decimals[item.tx.tokenHash] || 1e10)) : (item.tx.amount / (props.decimals[item.tx.tokenHash] || 1e10))) + ' ' + (item.tx.ticker ? (allTokens[item.tx.ticker] ? allTokens[item.tx.ticker] : 'COIN') : (allTokens[item.tx.tokenHash] ? allTokens[item.tx.tokenHash] : 'COIN'))}</div>

                        </div> : ''}
                </div>,
            )
        }

        return activityElements
    }

    useEffect(() => {

        getHistory()
            .then()

        let isMounted = true
        return () => {
            isMounted = false
        }

    }, [])

    return (
        <div className={styles.bottom_list + (props.activeTab === 1 ? '' : ` ${styles.bottom_list_disabled}`)}>

            {renderActivity()}

            {activity.length > 1 && <div onClick={rejectAll}
                                         className={`${styles.field} ${styles.button} ${styles.button_blue} ${styles.button_reject_all}`}>
                Reject all
            </div>}

            {history.length > 0 && <div className={styles.field}>HISTORY:</div>}

            {renderHistory()}

        </div>
    )
}
