import React, {useState, useEffect} from "react";
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
// import 'react-tabs/style/react-tabs.css';
import styles from "../css/index.module.css";
import Transaction from "./Transaction";
import Requests from "./Requests"
import Password from "./Password";
import Network from "./Network";
import Lock from "./Lock";
import Receive from "./Receive";
import Header from "../elements/Header";
import Address from "../elements/Address";
import Menu from "../elements/Menu";

let names = {
    enable: 'Share account address',
    tx: 'Sign transaction'
}

export default function Account(props) {

    ENQWeb.Enq.provider = props.user.net

    const [amount, setAmount] = useState(0);
    const [usd, setUSD] = useState(0);
    const [ticker, setTicker] = useState('');

    const [isLocked, setLocked] = useState(disk.lock.checkLock());

    const [net, setNet] = useState(String(ENQWeb.Net.currentProvider));

    const [menu, setMenu] = useState(false);

    const [activeTab, setActiveTab] = useState(0);

    // setNetwork(value) {
    //     this.setState({isNetwork: value}, () => {
    //         if (!value)
    //             window.location.reload(false);
    //     })
    // }

    // useEffect(() => {},[]);

    let copyPublicKey = () => {
        navigator.clipboard.writeText(props.user.publicKey)
    }

    let unlock = () => {
        setLocked(false)
    }

    let balance = () => {
        // console.log(this.props)
        ENQWeb.Enq.provider = props.user.net
        let token = ENQWeb.Enq.token[ENQWeb.Enq.provider]
        console.log(token)
        ENQWeb.Net.get.getBalance(props.user.publicKey, token).then(res => {
            console.log(res)
            setAmount(res.amount / 1e10)
            setTicker(res.ticker)
            if (props.user.net === 'pulse') {
                ENQWeb.Enq.sendRequest('https://api.coingecko.com/api/v3/simple/price?ids=enq-enecuum&vs_currencies=USD')
                    .then(answer => {
                        if (answer['enq-enecuum'] !== undefined) {
                            let usd = answer['enq-enecuum'].usd * amount
                            setUSD(usd)
                        }
                    })
            }
            console.log(res.amount / 1e10)
        }).catch(err => {
            console.log('error: ', err)
        })
    }

    balance()

    let activity = disk.list.listOfTask()
    let activityElements = []

    for (let key in activity) {
        let item = activity[key]
        activityElements.push(
            <div key={key} onClick={() => {

                if (item.type === 'enable')
                    selectPublicKeyRequest(item, activity[key])
                else
                    selectTransactionRequest(item, activity[key])

            }} className={styles.field + ' ' + styles.button}>
                {names[item.type]}
            </div>
        )
    }

    let renderMenu = () => {
        if (menu)
            return <Menu/>
    }

    return (
        <div className={styles.main}>

            <Header setMenu={setMenu}/>

            {renderMenu()}

            <Address/>

            <div className={styles.content}>

                <img className={styles.content_logo} src='./images/48.png'/>
                <div className={styles.balance}>{amount.toFixed(4)} {ticker}</div>
                <div className={styles.usd}>${usd} USD</div>
                {/*<div className={styles.field + ' ' + styles.address}>{props.user.publicKey}</div>*/}
                {/*<div className={styles.field + ' ' + styles.copy} onClick={() => copyPublicKey()}>COPY</div>*/}

            </div>

            <div className={styles.center}>

                <div onClick={() => copyPublicKey()}>
                    <div className={styles.icon_container}><img className={styles.icon} src={'./icons/8.png'}/></div>
                    <div>Copy</div>
                </div>

                {/*<div onClick={() => {*/}
                {/*    (disk.list.listOfTask().length > 0 ? setRequests(true) : null)*/}
                {/*}}*/}
                {/*     className={styles.field + ' ' + styles.button + ' ' + styles.button_icon + ' ' + (disk.list.listOfTask().length > 0 ? styles.green : styles.disabled)}>*/}
                {/*    <div>Requests</div>*/}
                {/*    <img className={styles.icon} src={'./icons/12.png'}/>*/}
                {/*</div>*/}

                {/*<div onClick={() => {*/}
                {/*}} className={styles.field + ' ' + styles.button + ' ' + styles.disabled}>Transactions history*/}
                {/*</div>*/}

                <div onClick={() => setTransaction(true)}>
                    <div className={styles.icon_container}><img className={styles.icon} src={'./icons/12.png'}/></div>
                    <div>Send</div>
                    <div>Transaction</div>
                </div>

                {/*<div onClick={() => setReceive(true)}*/}
                {/*     className={styles.field + ' ' + styles.button + ' ' + styles.button_icon}>Credentials*/}
                {/*</div>*/}

                {/*this.setPassword(true)*/}
                {/*<div onClick={() => {*/}
                {/*}}*/}
                {/*     className={styles.field + ' ' + styles.button + ' ' + styles.disabled}>Set password*/}
                {/*</div>*/}

                {/*<div onClick={props.logout}*/}
                {/*     className={styles.field + ' ' + styles.button + ' ' + styles.button_blue}>Logout*/}
                {/*</div>*/}

            </div>

            <Tabs className={styles.bottom}>

                <div className={styles.bottom_tabs}>
                    <div onClick={() => setActiveTab(0)} className={(activeTab === 0 ? ' ' + styles.bottom_tab_active : '')}>Assets</div>
                    <div onClick={() => setActiveTab(1)} className={(activeTab === 1 ? ' ' + styles.bottom_tab_active : '')}>Activity</div>
                </div>

                <div className={styles.bottom_list + (activeTab === 0 ? '' : ' ' + styles.bottom_list_disabled)}>

                    <div className={styles.asset}>
                        <img className={styles.icon} src={'./icons/8.png'}/>
                        <div>
                            <div>{amount.toFixed(4)} {ticker}</div>
                            <div>${usd} USD</div>
                        </div>
                    </div>

                </div>

                <div className={styles.bottom_list + (activeTab === 1 ? '' : ' ' + styles.bottom_list_disabled)}>

                    {activityElements}

                </div>

            </Tabs>


        </div>
    )
}