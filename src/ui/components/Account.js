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

const names = {
    enable: 'Share account address',
    tx: 'Send transaction',
}

const shortAddress = (address) => {
    return address.substring(0, 5) + '...' + address.substring(address.length - 3, address.length - 1)
}

export default function Account(props) {
    ENQWeb.Enq.provider = props.user.net

    const [amount, setAmount] = useState(0)
    const [usd, setUSD] = useState(0)
    const [ticker, setTicker] = useState('')

    const [connectionsCounter, setConnectionsCounter] = useState(0)

    const [isLocked, setLocked] = useState(disk.lock.checkLock())

    const [net, setNet] = useState(String(ENQWeb.Net.currentProvider))

    const [isConnects, setConnects] = useState(false)
    const [connectsElements, setConnectsElements] = useState([])

    const [assets, setAssets] = useState([])

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
        let counter = 0;
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

        // console.log(history)
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
        // console.log(token)
        ENQWeb.Net.get.getBalance(props.user.publicKey, token).then((res) => {
            // console.log(res)
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
            setAssets([{
                amount: res.amount / 1e10,
                ticker: res.ticker,
                usd: usd,
                image: './images/enq.png'
            }])
            // console.log(res.amount / 1e10)
        }).catch((err) => {
            console.err('error: ', err)
        })
    }

    const openEnable = () => {
        let params = getUrlVars()
        let task = disk.task.loadTask()
        if (params.type === 'enable') {
            if (task[params.id] && !isLocked) {
                props.setPublicKeyRequest(task[params.id])
            }
        }
    }

    const activity = disk.list.listOfTask()
    const activityElements = []

    // &nbsp;
    let date = 'Aug 20, 2020 · '

    for (const key in activity) {
        const item = activity[key]
        // console.log(item)
        activityElements.push(
            <div
                key={key} onClick={() => {
                if (item.type === 'enable') props.setPublicKeyRequest(item)
                else props.setTransactionRequest(item)
            }} className={`${styles.activity}`}
            >
                <img className={styles.icon} src={(item.type === 'enable' ? './icons/13.png' : './icons/12.png')}
                     alt=""/>
                <div>
                    <div>{names[item.type]}</div>
                    <div className={styles.time}>{
                        new Date(item.data.date).toDateString() + ' ' +
                        (item.tx ? 'To: ' + shortAddress(item.tx.to) : item.cb.url)}</div>
                </div>
                {item.tx ?
                    <div className={styles.activity_data}>
                        <div>{'-' + (item.tx.value / 1e10) + ' ' + (ticker ? ticker : 'COIN')}</div>
                    </div> : ''}
            </div>,
        )
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
                            {item.amount.toFixed(4)}
                            {' '}
                            {item.ticker}
                        </div>
                        <div className={styles.time}>
                            $
                            {item.usd}
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
        if (menu) return <Menu logout={props.logout} publickKey={props.user.publicKey} setLock={props.setLock}
                               setPassword={props.setPassword}/>
    }

    useEffect(() => {
        getConnects().then()
        getHistory().then()
        balance()
        openEnable()
    }, []);

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
                             if (connects[key].enabled)
                                 elements.push(<div key={key} onClick={() => {}} className={`${styles.connect}`}>
                                 <div>
                                     <div>{key}</div>
                                     {/*<div className={styles.time}>{date}</div>*/}
                                     <div></div>
                                 </div>
                             </div>)
                         }
                         setConnectsElements(elements)
                         setConnects(true)
                         setActiveTab(2)
                     }}
                     setPublicKeyRequest={props.setPublicKeyRequest}/>

            <div className={styles.content}>

                <img className={styles.content_logo} src="./images/48.png" alt=""/>
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

                    <div onClick={addAsset} className={`${styles.field} ${styles.button} ${styles.button_blue} ${styles.button_add_token}`}>
                        Add token
                    </div>

                </div>

                <div
                    className={`${styles.bottom_list} ${styles.bottom_list_activity} ${activeTab === 1 ? '' : `${styles.bottom_list_disabled}`}`}>

                    {activityElements}

                </div>

                <div
                    className={`${styles.bottom_list} ${styles.bottom_list_activity} ${activeTab === 2 ? '' : `${styles.bottom_list_disabled}`}`}>

                    {connectsElements}

                </div>

            </div>


        </div>
    )
}
