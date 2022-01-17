import React, {useEffect, useState} from 'react'
import styles from '../css/index.module.css'
import Header from '../elements/Header'
import Address from '../elements/Address'
import Menu from '../elements/Menu'
import {explorerAddress, explorerTX, generateIcon, shortHash} from '../Utils'

const names = {
    enable: 'Share account address',
    tx: 'Send transaction',
    iin: 'Transaction in',
    iout: 'Transaction out',
    sign: 'Sign message'
}

let tickers = {}

export default function Account(props) {
    ENQWeb.Enq.provider = props.user.net

    let [localNetworks, setLocalNetworks] = useState(JSON.parse(localStorage.getItem('networks')) || [])

    const [amount, setAmount] = useState(BigInt(0))
    const [usd, setUSD] = useState(BigInt(0))
    const [ticker, setTicker] = useState('')
    const [logo, setLogo] = useState('./images/enq.png')
    const [connectionsCounter, setConnectionsCounter] = useState(0)

    const [isLocked, setLocked] = useState(userStorage.lock.checkLock())

    const [net, setNet] = useState(String(ENQWeb.Net.currentProvider))

    const [isConnects, setConnects] = useState(false)
    const [connectsElements, setConnectsElements] = useState([])

    const [assets, setAssets] = useState([])
    const [activity, setActivity] = useState(userStorage.list.listOfTask())
    const [history, setHistory] = useState([])

    const [menu, setMenu] = useState(false)

    const [allTokens, setAllTokens] = useState((userStorage.tokens.getTokens()).tokens ? (userStorage.tokens.getTokens()).tokens : {})

    const [isCopied, setCopied] = useState(false)

    const clickMenu = () => {
        setMenu(!menu)
    }

    const [activeTab, setActiveTab] = useState(0)

    // setNetwork(value) {
    //     this.setState({isNetwork: value}, () => {
    //         if (!value)
    //             window.location.reload(false);
    //     })
    // }

    let addConnect = (url, date) => {
        console.log('addConnect')
        let elements = [...connectsElements]
        elements.push()
        // console.log(elements)
        setConnectsElements(elements)
        // console.log(connectsElements)
    }


    // addConnect('faucet-bit.enecuum.com', '26.04.2021')
    // addConnect('http://95.216.207.173:8000', '26.04.2021')
    // addConnect('google.com', '26.07.2022')

    const getConnects = async () => {
        let connects = await asyncRequest({connectionList: true})
        if (typeof connects === 'object') {
            setConnectionsCounter(Object.keys(connects.ports).length)
        }
        if (typeof connects === 'number') {
            setConnectionsCounter(connects)
        }
    }

    const copyPublicKey = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(props.user.publicKey)
            setCopied(true)
        } else {
            console.error('navigator.clipboard: ' + false)
        }
    }

    // const unlock = () => {
    //     setLocked(false)
    // }

    const getBalance = () => {
        // console.log(this.props)
        ENQWeb.Enq.provider = props.user.net
        const mainToken = ENQWeb.Enq.token[ENQWeb.Enq.provider] ? ENQWeb.Enq.token[ENQWeb.Enq.provider] : (localNetworks.find(element => element.host === ENQWeb.Net.currentProvider) ?
            localNetworks.find(element => element.host === ENQWeb.Net.currentProvider).token : '')
        const token = props.user.token ? props.user.token : mainToken

        // console.log(token)
        let tokens = []

        ENQWeb.Net.get.getBalanceAll(props.user.publicKey)
            .then((res) => {
                // console.log(res.map(a => a.ticker + ': ' + a.amount))
                let amount = 0
                let ticker = ''
                let image = './images/enq.png'
                for (let i in res) {

                    tickers[res[i].token] = res[i].ticker

                    if (res[i].token === token) {
                        amount = BigInt(res[i].amount)
                        ticker = res[i].ticker
                        image = res[i].token === mainToken ? './images/enq.png' : generateIcon(res[i].token)
                    } else {
                        tokens.push({
                            amount: BigInt(res[i].amount),
                            ticker: res[i].ticker,
                            usd: 0,
                            image: res[i].token === mainToken ? './images/enq.png' : generateIcon(res[i].token),
                            tokenHash: res[i].token
                        })
                    }
                }

                // console.log(ticker)
                setAmount(amount)
                setTicker(ticker)
                setLogo(image)
                cacheTokens(tickers).then()

                if (props.user.net === 'https://pulse.enecuum.com') {
                    ENQWeb.Enq.sendRequest('https://api.coingecko.com/api/v3/simple/price?ids=enq-enecuum&vs_currencies=USD')
                        .then((answer) => {
                            if (answer['enq-enecuum'] !== undefined) {

                                const usd = BigInt((answer['enq-enecuum'].usd * 1e10).toFixed(0))
                                const value = usd * BigInt(amount) / BigInt(1e10)
                                setUSD(value)
                            }
                        })
                }
                setAssets([{
                    amount: amount,
                    ticker: ticker,
                    usd: usd,
                    image: image,
                    tokenHash: token,
                    main: true
                }, ...tokens])
                // console.log(res.amount / 1e10)
            })
            .catch((err) => {
                console.error('error: ', err)
            })
    }

    const openPopup = async () => {
        let params = getUrlVars()
        let task = userStorage.task.loadTask()
        if (params.type === 'enable') {
            if (task[params.id] && !isLocked) {
                props.setPublicKeyRequest(task[params.id])
                return false
            }
        }
        if (params.type === 'tx') {
            if (task[params.id] && !isLocked) {
                props.setTransactionRequest(task[params.id])
                return false
            }
        }
        if (params.type === 'sign') {
            if (task[params.id] && !isLocked) {
                props.setSignRequest(task[params.id])
                return false
            }
        }
        if (params.type === 'connectLedger') {
            if (!isLocked) {
                // props.setTransactionRequest(task[params.id])
                props.setConnectLedger(true)
                return false
            }
        }

        return true
    }

    const activityElements = []

    // &nbsp;

    const findTickerInCache = async (hash) => {
        return allTokens[hash] !== undefined ? allTokens[hash] : (await ENQWeb.Net.get.token_info(hash)).ticker
    }

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
                     src={(item.type === 'enable' ? './images/icons/13.png' : './images/icons/12.png')}
                     alt=""/>
                <div>
                    <div>{names[item.type]}</div>
                    <div className={styles.time}>
                        {new Date(item.data.date).toISOString().slice(0, 10) + ' '}
                        {(item.tx ? <div className={styles.history_link}
                                         onClick={() => explorerAddress(item.tx.to)}>To: {shortHash(item.tx.to)}</div> : item.cb.url)}
                    </div>
                </div>
                {item.tx ?
                    <div className={styles.activity_data}>

                        <div>{'-' + (item.tx.value ? (item.tx.value / 1e10) : (item.tx.amount / 1e10)) + ' ' + (item.tx.ticker ? (allTokens[item.tx.ticker] ? allTokens[item.tx.ticker] : 'COIN') : (allTokens[item.tx.tokenHash] ? allTokens[item.tx.tokenHash] : 'COIN'))}</div>

                    </div> : ''}
            </div>,
        )
    }

    const getHistory = async () => {

        let history = {}
        history.records = []
        for (let i = 0; i < 4; i++) {
            let historyRecords = await ENQWeb.Net.get.accountTransactions(props.user.publicKey, i)
            history.records = history.records.concat(historyRecords.records)
        }

        // let history = await ENQWeb.Net.get.accountTransactions(props.user.publicKey, 0)

        // console.log(history.records)

        let oldActivity = []
        for (let id in history.records) {
            // console.log(history.records[id])
            if (history.records[id]) {
                oldActivity.push({
                    data: {
                        date: history.records[id].time * 1000,
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
                        ticker: await findTickerInCache(history.records[id].token_hash) || false,
                        value: history.records[id].amount * (history.records[id].rectype === 'iin' ? 1 : -1)
                    },
                    cb: {
                        taskId: 0,
                    },
                    type: history.records[id].rectype
                })
            }
        }

        return oldActivity

        // setHistory(oldActivity)
        // renderHistory()
    }

    let renderHistory = (historyArray) => {

        const historyElements = []
        for (const key in historyArray.filter(item => item.tx.tokenHash === props.user.token || item.tx.data.includes(props.user.token))) {
            const item = historyArray[key]
            // console.log(item)
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
                }} className={`${styles.activity}`}
                >
                    <img className={styles.icon}
                         src={(item.tx.value > 0 ? './images/icons/22.png' : './images/icons/12.png')}
                         alt=""/>
                    <div>
                        <div>{names[item.type]}</div>
                        <div className={styles.time}>
                            {new Date(item.data.date).toISOString().slice(0, 10)}
                            <div className={styles.history_link}
                                 onClick={() => explorerTX(item.tx.hash)}>{shortHash(item.tx.hash)}</div>
                        </div>
                    </div>
                    {item.tx ?
                        <div className={styles.activity_data}>

                            <div>{(item.tx.value ? (item.tx.value / 1e10) : (item.tx.amount / 1e10)) + ' ' + (item.tx.ticker ? item.tx.ticker : 'COIN')}</div>

                        </div> : ''}
                </div>,
            )
        }

        setHistory(historyElements)
    }

    //TODO
    // renderHistory()

    //Reject all
    let rejectAll = async () => {
        for (const key in activity) {
            const item = activity[key]
            // asyncRequest({reject_all: true})
            await asyncRequest({
                disallow: true,
                taskId: item.cb.taskId
            })
            setActivity([])
        }
    }

    let changeToken = async (hash) => {
        // console.log(hash);
        let user = props.user
        user.token = hash
        await userStorage.promise.sendPromise({
            account: true,
            set: true,
            data: user
        })
        // window.location.reload(false)
        await getBalance()
        await renderAssets()
        setActiveTab(props.user.token === ENQWeb.Enq.token[ENQWeb.Enq.provider] ? 0 : 1)
        window.scrollTo(0, 0)
    }

    const assetsElements = []
    let renderAssets = () => {

        // console.log(assets)
        let mainToken = assets.find(element => element.main === true)
        // console.log(mainToken)

        let assetsSort = assets.sort((a, b) => Number(a.amount) - Number(b.amount))
        assetsSort.splice(assets.indexOf(mainToken), 1)
        // console.log(assetsSort)
        if (mainToken) {
            assetsSort.unshift(mainToken)
        }

        // console.log(mainToken)
        // console.log(assets[0])
        // console.log(assetsSort.indexOf(assets[0]))

        for (const key in assetsSort) {
            const item = assetsSort[key]

            // console.log(ENQWeb.Net.ticker)
            // console.log(props.user.token)
            // console.log(item.tokenHash)
            // console.log(item.tokenHash === ENQWeb.Net.ticker)

            assetsElements.push(
                <div key={key}
                     className={styles.asset + ' ' + (props.user.token === item.tokenHash ? styles.asset_select : '')}
                     onClick={() => {
                         changeToken(item.tokenHash).then()
                     }}>
                    <img className={styles.icon} src={item.image}/>
                    <div>
                        <div>
                            {(Number(item.amount) / 1e10).toFixed(4)}
                            {' '}
                            {item.ticker}
                        </div>
                        <div className={styles.time}>
                            $
                            {(Number(item.usd) / 1e10).toFixed(2)}
                            {' '}
                            USD
                        </div>
                    </div>
                </div>
            )
        }
    }


    let addAsset = () => {
        setAssets([...assets, {
            amount: 0,
            ticker: 'COIN',
            usd: '0.00',
            image: './images/icons/3.png'
        }])
    }

    const renderMenu = () => {
        if (menu) {
            return <Menu login={props.login}
                         logout={props.logout}
                         publicKey={props.user.publicKey}
                         setLock={props.setLock}
                         setConfirm={props.setConfirm}
                         setNetwork={props.setNetwork}
                         setKeys={props.setKeys}
                         setPassword={props.setPassword}
                         setMnemonic={props.setMnemonic}
                         setAccountSelector={props.setAccountSelector}
                         setImportMnemonic={props.setImportMnemonic}
            />
        }
    }


    useEffect(() => {

        openPopup().then(result => {
            if (result === true) {
                getConnects().then()
                getHistory().then((history) => {

                    // console.log(history)
                    if (isMounted)
                        renderHistory(history)
                })
                getBalance()
            }
        })

        let isMounted = true
        return () => { isMounted = false }

    }, [])

    // TODO What's going on here
    // renderHistory()

    renderAssets()

    return (
        <div className={styles.main}>

            <Header clickMenu={clickMenu} user={props.user}/>

            {renderMenu()}

            <Address publicKey={props.user.publicKey}
                     connectionsCounter={connectionsCounter}
                     isCopied={isCopied}
                     setCopied={setCopied}
                     isMainToken={props.user.token === ENQWeb.Enq.token[ENQWeb.Enq.provider]}
                     setMainToken={() => {
                         changeToken(ENQWeb.Enq.token[ENQWeb.Enq.provider]).then()
                     }}
                     setConnects={(connects) => {
                         // console.log(connects)
                         let elements = []
                         for (const key in connects) {
                             elements.push(
                                 <div key={key} onClick={() => {}} className={`${styles.connect}`}>
                                     <div>{key.replaceAll('https://', '')}</div>
                                     <div onClick={() => {
                                         userStorage.promise.sendPromise({
                                             ports: true,
                                             disconnect: true,
                                             name: key
                                         }).then(() => console.log(`${key} is disconnected`))
                                     }}>✕</div>
                                 </div>)
                         }
                         setConnectsElements(elements)
                         setConnects(true)
                         setActiveTab(2)
                     }}
                     setPublicKeyRequest={props.setPublicKeyRequest}/>

            <div className={styles.content}>

                <img className={styles.content_logo} src={logo} alt=""/>
                <div className={styles.balance} title={(Number(amount) / 1e10)}>
                    {(Number(amount) / 1e10).toFixed(4)}
                    {' '}
                    {ticker}
                </div>
                <div className={styles.usd}>
                    $
                    {(Number(usd) / 1e10).toFixed(2)}
                    {' '}
                    USD
                </div>

            </div>

            <div className={styles.center}>

                <div className={styles.circle_button} onClick={copyPublicKey}>
                    <div className={styles.icon_container}><img className={styles.icon} src="./images/icons/8.png"/>
                    </div>
                    <div>Copy</div>
                </div>

                <div className={styles.circle_button}
                     onClick={() => props.setTransaction({
                         balance: amount,
                         ticker: ticker,
                         token: props.user.token
                     })}>
                    <div className={styles.icon_container}><img className={styles.icon} src="./images/icons/12.png"/>
                    </div>
                    <div>Send</div>
                    {/*<div>Transaction</div>*/}
                </div>

            </div>

            {/*TABS*/}

            <div className={styles.bottom}>

                {/*{console.log(props.user.token === ENQWeb.Enq.token[ENQWeb.Enq.provider])}*/}

                <div className={styles.bottom_tabs}>
                    {(activeTab === 0 || props.user.token === ENQWeb.Enq.token[ENQWeb.Enq.provider]) && <div
                        onClick={() => setActiveTab(0)}
                        className={(activeTab === 0 ? ` ${styles.bottom_tab_active}` : '')}
                    >
                        Assets
                    </div>}
                    <div
                        onClick={() => setActiveTab(1)}
                        className={(activeTab === 1 ? ` ${styles.bottom_tab_active}` : '')}
                    >
                        Activity <sup>{activity.length}</sup>
                    </div>
                    {isConnects && activeTab === 2 && <div
                        onClick={() => setActiveTab(2)}
                        className={(activeTab === 2 ? ` ${styles.bottom_tab_active}` : '')}
                    >
                        Connects
                    </div>}
                </div>

                <div className={styles.bottom_assets + (activeTab === 0 ? '' : ` ${styles.bottom_list_disabled}`)}>

                    {assetsElements}

                    <div onClick={() => {
                    }}
                         className={`${styles.field} ${styles.button} ${styles.button_blue} ${styles.button_add_token}`}>
                        Add token
                    </div>

                </div>

                <div className={styles.bottom_list + (activeTab === 1 ? '' : ` ${styles.bottom_list_disabled}`)}>

                    {activityElements}

                    {activityElements.length > 1 && <div onClick={rejectAll}
                                                         className={`${styles.field} ${styles.button} ${styles.button_blue} ${styles.button_reject_all}`}>
                        Reject all
                    </div>}

                    {history.length > 0 && <div className={styles.history_title}>History</div>}

                    {history}

                </div>

                <div
                    className={`${styles.bottom_list} ${styles.bottom_list_activity} ${activeTab === 2 ? '' : `${styles.bottom_list_disabled}`}`}>

                    {connectsElements}

                </div>

            </div>


        </div>
    )
}
