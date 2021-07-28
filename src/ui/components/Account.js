import React, {useState, useEffect} from 'react'
import styles from '../css/index.module.css'
import Transaction from './Transaction'
import Requests from './Requests'
import Password from './Password'
import Network from './Network'
import Lock from './Lock'
import Receive from './Receive'
import Header from '../elements/Header'
import Address from '../elements/Address'
import Menu from '../elements/Menu'
import {shortAddress} from '../Utils'

const names = {
    enable: 'Share account address',
    tx: 'Send transaction',
    history: 'Transaction',
    sign: 'Sign message'
}

let tickers = {}

export default function Account(props) {
    ENQWeb.Enq.provider = props.user.net

    const [amount, setAmount] = useState(BigInt(0))
    const [usd, setUSD] = useState(BigInt(0))
    const [ticker, setTicker] = useState('')

    const [connectionsCounter, setConnectionsCounter] = useState(0)

    const [isLocked, setLocked] = useState(disk.lock.checkLock())

    const [net, setNet] = useState(String(ENQWeb.Net.currentProvider))

    const [isConnects, setConnects] = useState(false)
    const [connectsElements, setConnectsElements] = useState([])

    const [assets, setAssets] = useState([])
    const [activity, setActivity] = useState(disk.list.listOfTask())

    const [menu, setMenu] = useState(false)
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
        console.log(elements)
        setConnectsElements(elements)
        console.log(connectsElements)
    }


    // addConnect('faucet-bit.enecuum.com', '26.04.2021')
    // addConnect('http://95.216.207.173:8000', '26.04.2021')
    // addConnect('google.com', '26.07.2022')

    const getConnects = async () => {
        let connects = await asyncRequest({connectionList: true})
        let counter = 0
        for (let key in connects.ports) {
            if (connects.ports[key].enabled) {
                counter++

                //TODO add element
                // connectsElements.push(connects.ports[key])
                // addConnect(connects.ports[key], 'now')
            }
        }

        // console.log(counter)

        setConnectionsCounter(counter)
    }

    const getHistory = async () => {
        let history = await ENQWeb.Net.get.accountTransactions(props.user.publicKey, 0)

        let tx = {
            type: 'tx',

        }

        console.log(history.records)
        console.log(activity)

        let oldActivity = []
        for (let id in history.records) {
            // console.log(history.records[id])
            oldActivity.push({
                data: {date: history.records[id].time * 1000},
                tx: {
                    to: history.records[id].hash,
                    from: {
                        pubkey: history.records[id].hash,
                    },
                    value: history.records[id].amount
                },
                cb: {
                    taskId: 0,
                },
                type: 'history'
            })
        }

        setActivity([...activity, ...oldActivity])
    }

    const copyPublicKey = () => {
        navigator.clipboard.writeText(props.user.publicKey)
    }

    // const unlock = () => {
    //     setLocked(false)
    // }

    const balance = () => {
        // console.log(this.props)
        ENQWeb.Enq.provider = props.user.net
        const token = ENQWeb.Enq.token[ENQWeb.Enq.provider]
        console.log(token)

        let tokens = []

        ENQWeb.Net.get.getBalanceAll(props.user.publicKey)
            .then((res) => {
                // console.log(res.map(a => a.ticker + ': ' + a.amount))
                let amount = 0
                let ticker = ''
                for (let i in res) {

                    tickers[res[i].token] = res[i].ticker

                    if (res[i].token === token) {
                        amount = BigInt(res[i].amount)
                        ticker = res[i].ticker
                    } else
                        tokens.push({
                            amount: BigInt(res[i].amount),
                            ticker: res[i].ticker,
                            usd: 0,
                            image: './icons/3.png'
                        })
                }
                // console.log(tickers)
                setAmount(amount)
                setTicker(ticker)
                if (props.user.net === 'pulse') {
                    ENQWeb.Enq.sendRequest('https://api.coingecko.com/api/v3/simple/price?ids=enq-enecuum&vs_currencies=USD')
                        .then((answer) => {
                            if (answer['enq-enecuum'] !== undefined) {

                                const usd = BigInt((answer['enq-enecuum'].usd * 1e10).toFixed(0))
                                const value = usd * amount / BigInt(1e10)
                                setUSD(value)
                            }
                        })
                }
                setAssets([{
                    amount: amount,
                    ticker: ticker,
                    usd: usd,
                    image: './images/enq.png'
                }, ...tokens])
                // console.log(res.amount / 1e10)
            })
            .catch((err) => {
                console.error('error: ', err)
            })
    }

    const openPopup = async () => {
        let params = getUrlVars()
        let task = disk.task.loadTask()
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
        if(params.type === 'sign'){
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
            }} className={`${styles.activity}`}
            >
                <img className={styles.icon} src={(item.type === 'enable' ? './icons/13.png' : './icons/12.png')}
                     alt=""/>
                <div>
                    <div>{names[item.type]}</div>
                    <div className={styles.time}>{
                        new Date(item.data.date).toISOString()
                            .slice(0, 10) + ' ' +
                        (item.tx ? 'To: ' + shortAddress(item.tx.to) : item.cb.url)}</div>
                </div>
                {item.tx ?
                    <div className={styles.activity_data}>
                        <div>{'-' + (item.tx.value / 1e10) + ' ' + (ticker ? ticker : 'COIN')}</div>
                    </div> : ''}
            </div>,
        )
    }

    //Reject all
    let rejectAll = async () => {
        for (const key in activity) {
            const item = activity[key]
            // global.asyncRequest({reject_all: true})
            await global.asyncRequest({
                disallow: true,
                taskId: item.cb.taskId
            })
            setActivity([])
        }
    }

    const assetsElements = []
    let renderAssets = () => {
        for (const key in assets) {
            const item = assets[key]
            assetsElements.push(
                <div key={key} className={styles.asset}>
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
            image: './icons/3.png'
        }])
    }

    renderAssets()

    const renderMenu = () => {
        if (menu) {
            return <Menu logout={props.logout}
                         publickKey={props.user.publicKey}
                         setLock={props.setLock}
                         setConfirm={props.setConfirm}
                         setPassword={props.setPassword}/>
        }
    }

    useEffect(() => {
        openPopup().then(result => {
            if (result === true) {
                getConnects().then()
                // getHistory().then()
                balance()
            }
        })
    }, [])

    return (
        <div className={styles.main}>

            <Header clickMenu={clickMenu}/>

            {renderMenu()}

            <Address publicKey={props.user.publicKey}
                     connectionsCounter={connectionsCounter}
                     setConnects={(connects) => {
                         // console.log(connects)
                         let elements = []
                         for (const key in connects) {
                             if (connects[key].enabled) {
                                 elements.push(<div key={key} onClick={() => {
                                 }} className={`${styles.connect}`}>
                                     <div>
                                         <div>{key}</div>
                                         {/*<div className={styles.time}>{date}</div>*/}
                                         <div></div>
                                     </div>
                                 </div>)
                             }
                         }
                         setConnectsElements(elements)
                         setConnects(true)
                         setActiveTab(2)
                     }}
                     setPublicKeyRequest={props.setPublicKeyRequest}/>

            <div className={styles.content}>

                <img className={styles.content_logo} src="./images/48.png" alt=""/>
                <div className={styles.balance}>
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
                    <div className={styles.icon_container}><img className={styles.icon} src="./icons/8.png"/></div>
                    <div>Copy</div>
                </div>

                <div className={styles.circle_button} onClick={() => props.setTransaction(true)}>
                    <div className={styles.icon_container}><img className={styles.icon} src="./icons/12.png"/></div>
                    <div>Send</div>
                    <div>Transaction</div>
                </div>

            </div>

            {/*TABS*/}

            <div className={styles.bottom}>

                <div className={styles.bottom_tabs}>
                    <div
                        onClick={() => setActiveTab(0)}
                        className={(activeTab === 0 ? ` ${styles.bottom_tab_active}` : '')}
                    >
                        Assets
                    </div>
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

                <div className={styles.bottom_list + (activeTab === 0 ? '' : ` ${styles.bottom_list_disabled}`)}>

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

                </div>

                <div
                    className={`${styles.bottom_list} ${styles.bottom_list_activity} ${activeTab === 2 ? '' : `${styles.bottom_list_disabled}`}`}>

                    {connectsElements}

                </div>

            </div>


        </div>
    )
}
