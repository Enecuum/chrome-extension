import React, { useState, useEffect } from 'react'
import {
    Tab, Tabs, TabList, TabPanel,
} from 'react-tabs'
// import 'react-tabs/style/react-tabs.css';
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

const names = {
    enable: 'Share account address',
    tx: 'Sign transaction',
}

export default function Account(props) {
    ENQWeb.Enq.provider = props.user.net

    const [amount, setAmount] = useState(0)
    const [usd, setUSD] = useState(0)
    const [ticker, setTicker] = useState('')

    // const [isLocked, setLocked] = useState(disk.lock.checkLock())

    const [net, setNet] = useState(String(ENQWeb.Net.currentProvider))

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

    // useEffect(() => {},[]);

    const copyPublicKey = () => {
        navigator.clipboard.writeText(props.user.publicKey)
    }

    const unlock = () => {
        setLocked(false)
    }

    const balance = () => {
        // console.log(this.props)
        ENQWeb.Enq.provider = props.user.net
        const token = ENQWeb.Enq.token[ENQWeb.Enq.provider]
        console.log(token)
        ENQWeb.Net.get.getBalance(props.user.publicKey, token).then((res) => {
            console.log(res)
            setAmount(res.amount / 1e10)
            setTicker(res.ticker)
            if (props.user.net === 'pulse') {
                ENQWeb.Enq.sendRequest('https://api.coingecko.com/api/v3/simple/price?ids=enq-enecuum&vs_currencies=USD')
                    .then((answer) => {
                        if (answer['enq-enecuum'] !== undefined) {
                            const usd = answer['enq-enecuum'].usd * amount
                            setUSD(usd)
                        }
                    })
            }
            console.log(res.amount / 1e10)
        }).catch((err) => {
            console.log('error: ', err)
        })
    }

    balance()

    const activity = disk.list.listOfTask()
    const activityElements = []

    for (const key in activity) {
        const item = activity[key]
        console.log(item)
        activityElements.push(
            <div
                key={key} onClick={() => {
                    if (item.type === 'enable') selectPublicKeyRequest(item, activity[key])
                    else selectTransactionRequest(item, activity[key])
                }} className={`${styles.activity}`}
            >
                <img className={styles.content_logo} src="./images/48.png" alt="" />
                <div>
                    <div>{item.type}</div>
                    <div>{names[item.type]}</div>
                </div>
            </div>,
        )
    }

    const renderMenu = () => {
        if (menu) return <Menu logout={props.logout} publickKey={props.user.publicKey} />
    }

    return (
        <div className={styles.main}>

            <Header clickMenu={clickMenu} />

            {renderMenu()}

            <Address publickKey={props.user.publicKey} />

            <div className={styles.content}>

                <img className={styles.content_logo} src="./images/48.png" alt="" />
                <div className={styles.balance}>
                    {amount.toFixed(4)}
                    {' '}
                    {ticker}
                </div>
                <div className={styles.usd}>
                    $
                    {usd}
                    {' '}
                    USD
                </div>

            </div>

            <div className={styles.center}>

                <div className={styles.circle_button} onClick={() => copyPublicKey()}>
                    <div className={styles.icon_container}><img className={styles.icon} src="./icons/8.png" /></div>
                    <div>Copy</div>
                </div>

                <div className={styles.circle_button} onClick={() => setTransaction(true)}>
                    <div className={styles.icon_container}><img className={styles.icon} src="./icons/12.png" /></div>
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
                        Activity<sup>{activity.length}</sup>
                    </div>
                </div>

                <div className={styles.bottom_list + (activeTab === 0 ? '' : ` ${styles.bottom_list_disabled}`)}>

                    <div className={styles.asset}>
                        <img className={styles.icon} src="./icons/1.png" />
                        <div>
                            <div>
                                {amount.toFixed(4)}
                                {' '}
                                {ticker}
                            </div>
                            <div className={styles.usd}>
                                $
                                {usd}
                                {' '}
                                USD
                            </div>
                        </div>
                    </div>

                    <div className={styles.asset}>
                        <img className={styles.icon} src="./icons/2.png" />
                        <div>
                            <div>
                                0.00
                                {' '}
                                USDT
                            </div>
                            <div className={styles.usd}>
                                $
                                {usd}
                                {' '}
                                USD
                            </div>
                        </div>
                    </div>

                    <div
                      onClick={() => {}}
                      className={`${styles.field} ${styles.button} ${styles.button_blue} ${styles.button_add_token}`}
                    >
                        Add token
                    </div>

                </div>

                <div className={`${styles.bottom_list} ${activeTab === 1 ? '' : `${styles.bottom_list_disabled}`}`}>

                    {activityElements}

                </div>

            </div>


        </div>
    )
}
