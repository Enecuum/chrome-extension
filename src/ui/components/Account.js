import React, {useEffect, useState} from 'react'
import styles from '../css/index.module.css'
import Header from '../elements/Header'
import Address from '../elements/Address'
import Menu from '../elements/Menu'
import {copyToClipboard, explorerAddress, explorerTX, generateIcon, shortHash} from '../Utils'
import Separator from '../elements/Separator'
import {apiController} from '../../utils/apiController'

const names = {
    enable: 'Share account address',
    tx: 'Send transaction',
    iin: 'Transaction in',
    iout: 'Transaction out',
    sign: 'Sign message'
}

let tickers = {}

global.api = apiController

export default function Account(props) {

    global.setIframeWork(false)

    ENQWeb.Enq.provider = props.user.net

    let [localNetworks, setLocalNetworks] = useState(JSON.parse(localStorage.getItem('networks')) || [])

    const [amount, setAmount] = useState(BigInt(0))
    const [amountDecimal, setAmountDecimal] = useState(1e10)
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

    const [favoriteSites, setFavoriteSites] = useState([])

    let decimals = {}

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
        return connects
    }

    const copyPublicKey = () => {
        copyToClipboard(props.user.publicKey)
        setCopied(true)
    }

    // const unlock = () => {
    //     setLocked(false)
    // }

    const getBalance = async () => {
        // console.log(this.props)
        ENQWeb.Enq.provider = props.user.net
        const mainToken = ENQWeb.Enq.token[ENQWeb.Enq.provider] ? ENQWeb.Enq.token[ENQWeb.Enq.provider] : (localNetworks.find(element => element.host === ENQWeb.Net.currentProvider) ?
            localNetworks.find(element => element.host === ENQWeb.Net.currentProvider).token : '')
        const token = props.user.token ? props.user.token : mainToken

        // console.log(token)
        let tokens = []

        await apiController.getBalanceAll(props.user.publicKey)
            .then((res) => {
                // console.log(res.map(a => a.ticker + ': ' + a.amount))
                let amount = 0
                let ticker = ''
                let decimal
                let image = './images/enq.png'
                for (let i in res) {
                    // console.log(res[i])
                    tickers[res[i].token] = res[i].ticker
                    decimals[res[i].token] = 10 ** res[i].decimals
                    if (res[i].token === token) {
                        amount = BigInt(res[i].amount)
                        ticker = res[i].ticker
                        image = res[i].token === mainToken ? './images/enq.png' : generateIcon(res[i].token)
                        decimal = res[i].decimals
                    } else {
                        tokens.push({
                            amount: BigInt(res[i].amount),
                            ticker: res[i].ticker,
                            usd: 0,
                            image: res[i].token === mainToken ? './images/enq.png' : generateIcon(res[i].token),
                            tokenHash: res[i].token,
                            decimals: 10 ** res[i].decimals
                        })
                    }
                }

                // console.log(ticker)
                setAmount(amount)
                setTicker(ticker)
                setLogo(image)
                setAmountDecimal(10**decimal)
                cacheTokens(tickers)
                    .then()

                if (props.user.net === 'https://pulse.enecuum.com') {
                    apiController.sendRequest('https://api.coingecko.com/api/v3/simple/price?ids=enq-enecuum&vs_currencies=USD')
                        .then((answer) => {
                            if (answer['enq-enecuum'] !== undefined) {

                                const usd = BigInt((answer['enq-enecuum'].usd * 1e10).toFixed(0))
                                const value = usd * BigInt(amount) / BigInt(10 ** decimal)
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
                    decimals: 10 ** decimal,
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
            // if (!isLocked) {
            //     // props.setTransactionRequest(task[params.id])
            //     props.setConnectLedger(true)
            //     return false
            // }
        }
        if (params.type === 'ledger') {
            if (!isLocked) {
                props.setLedger(true)
                props.setAccountSelector(true)
                return false
            }
        }
        if (params.type === 'accounts') {
            if (!isLocked) {
                // props.setTransactionRequest(task[params.id])
                props.setAccountSelector(true)
                return false
            }
        }

        return true
    }

    const activityElements = []

    // &nbsp;

    const findTickerInCache = async (hash) => {
        return allTokens[hash] !== undefined ? allTokens[hash] : (await apiController.getTokenInfo(hash)).ticker
    }


    const renderActivity = ()=>{
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

                            <div>{'-' + (item.tx.value ? (item.tx.value / (decimals[item.tx.tokenHash] || 1e10)) : (item.tx.amount /(decimals[item.tx.tokenHash] || 1e10) )) + ' ' + (item.tx.ticker ? (allTokens[item.tx.ticker] ? allTokens[item.tx.ticker] : 'COIN') : (allTokens[item.tx.tokenHash] ? allTokens[item.tx.tokenHash] : 'COIN'))}</div>

                        </div> : ''}
                </div>,
            )
        }
    }

    renderActivity()

    const getHistory = async () => {

        let history = {}
        history.records = []
        for (let i = 0; i < 4; i++) {
            let historyRecords = await apiController.getAccountTransactions(props.user.publicKey, i)
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
                        feeTicker: false,
                        feeDecimals: false,
                        decimals: decimals[history.records[id].token_hash] || 1e10,
                        ticker: false,
                        fee_type: history.records[id].fee_type,
                        fee:history.records[id].fee_value
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

    let renderHistory = async (historyArray) => {

        const historyElements = []
        let tokenDecimals = {}
        for (const key in historyArray.filter(item => item.tx.tokenHash === props.user.token || item.tx.data.includes(props.user.token))) {
            const item = historyArray[key]
            // console.log(item)
            if(!decimals[item.tx.tokenHash]){
                await apiController.getTokenInfo(item.tx.tokenHash)
                    .then(token=>{
                        try {
                            decimals[item.tx.tokenHash] = (10 ** token[0]['decimals'])
                        }catch (e) {
                            decimals[item.tx.tokenHash] = 1e10
                        }
                    })
            }
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
                            {new Date(item.data.date).toISOString()
                                .slice(0, 10)}
                            <div className={styles.history_link}
                                 onClick={() => explorerTX(item.tx.hash)}>{shortHash(item.tx.hash)}</div>
                        </div>
                    </div>
                    {item.tx ?
                        <div className={styles.activity_data}>

                            <div>{(item.tx.value ? (item.tx.value / (decimals[item.tx.tokenHash] || 1e10)) : (item.tx.amount / (decimals[item.tx.tokenHash] || 1e10))) + ' ' + (item.tx.ticker ? item.tx.ticker : 'COIN')}</div>

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
        await asyncRequest({reject_all: true})
        setActivity([])
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
        // await renderAssets()
        setActiveTab(props.user.token === ENQWeb.Enq.token[ENQWeb.Enq.provider] ? 0 : 1)
        window.scrollTo(0, 0)
    }

    let renderAssets = () => {

        const assetsElements = []

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
            // console.log(item)
            assetsElements.push(
                <div key={key}
                     className={styles.asset + ' ' + (props.user.token === item.tokenHash ? styles.asset_select : '')}
                     onClick={() => {
                         changeToken(item.tokenHash)
                             .then()
                     }}>
                    <img className={styles.icon} src={item.image}/>
                    <div>
                        <div>
                            {(Number(item.amount) / item.decimals).toFixed(4)}
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

        return assetsElements
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
                         setMining={props.setMining}
                         setKeys={props.setKeys}
                         setPassword={props.setPassword}
                         setWebView={props.setWebView}
                         setMnemonic={props.setMnemonic}
                         setAccountSelector={props.setAccountSelector}
                         setImportMnemonic={props.setImportMnemonic}
                         installPWA={props.installPWA}
            />
        }
    }


    useEffect(() => {

        openPopup()
            .then(async result => {
                if (result === true) {
                    getBalance().then()
                    getConnects()
                        .then()
                    getHistory()
                        .then((history) => {

                            // console.log(history)
                            if (isMounted) {
                                renderHistory(history)
                            }
                        })
                }
            })

        let isMounted = true
        return () => {
            isMounted = false
        }

    }, [])


    // TODO What's going on here
    // renderHistory()

    // renderAssets()

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
                         changeToken(ENQWeb.Enq.token[ENQWeb.Enq.provider])
                             .then()
                     }}
                     setConnects={(connects) => {
                         // console.log(connects)
                         let elements = []
                         let sites = userStorage.sites.getSites()
                         let favSites = []
                         for (const key in connects) {
                             elements.push(
                                 <div key={key} onClick={() => {
                                 }} className={`${styles.connect}`}>
                                     <div>{key.replaceAll('https://', '')}</div>
                                     <div onClick={() => {
                                         userStorage.promise.sendPromise({
                                             ports: true,
                                             disconnect: true,
                                             name: key
                                         })
                                             .then(() => {
                                                 console.log(`${key} is disconnected`)
                                                 getConnects()
                                                     .then()
                                                 setActiveTab(0)
                                             })
                                     }}>✕
                                     </div>
                                 </div>)

                         }

                         for (const key in sites) {
                             if (sites[key] === true) {
                                 favSites.push(
                                     <div key={key} onClick={() => {
                                     }} className={`${styles.connect}`}>
                                         <div>{key.replaceAll('https://', '')}</div>
                                         <div onClick={() => {
                                             userStorage.promise.sendPromise({
                                                 ports: true,
                                                 disconnect: true,
                                                 favorite: true,
                                                 name: key
                                             })
                                                 .then(() => {
                                                     console.log(`${key} is disconnected`)
                                                     getConnects()
                                                         .then()
                                                     setActiveTab(0)
                                                 })
                                         }}>✕
                                         </div>
                                     </div>)
                             }
                         }

                         if (elements.length >= 2) {
                             elements.push(
                                 <div onClick={() => {
                                     userStorage.promise.sendPromise({
                                         ports: true,
                                         disconnect: true,
                                         all: true
                                     })
                                         .then(() => {
                                             console.warn('disconnect All')
                                             getConnects()
                                                 .then()
                                             setActiveTab(0)
                                         })

                                 }} className={`${styles.field} ${styles.button}`}>
                                     Disconnect all
                                 </div>)
                         }
                         setFavoriteSites(favSites)
                         setConnectsElements(elements)
                         setConnects(true)
                         setActiveTab(2)
                     }}
                     setPublicKeyRequest={props.setPublicKeyRequest}/>

            <div className={styles.content}>

                <img className={styles.content_logo} src={logo} alt=""/>
                <div className={styles.balance} title={decimals[props.user.token] ? (Number(amount) / decimals[props.user.token]) : ''}>
                    {(Number(amount) / amountDecimal).toFixed(4)}
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

                <div className={styles.circle_button} onClick={props.setMining}>
                    <div className={styles.icon_container}><img className={styles.icon} src="./images/icons/9.png"/>
                    </div>
                    <div>Mining</div>
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

                    {renderAssets()}

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

                    {favoriteSites.length > 0 && <div className={styles.favorites}>Favorites</div>}

                    <Separator/>

                    {favoriteSites}

                </div>

            </div>


        </div>
    )
}
