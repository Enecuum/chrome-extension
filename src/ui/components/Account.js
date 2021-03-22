import React, {useState, useEffect} from "react";
import styles from "../index.module.css";
import Transaction from "./Transaction";
import Requests from "./Requests"
import Password from "./Password";
import Network from "./Network";
import AskPassword from "./AskPassword";
import Receive from "./Receive";
import Header from "../elements/Header";

export default function Account(props) {

    ENQWeb.Enq.provider = props.user.net

    const [isTransaction, setTransaction] = useState(false);
    const [isRequests, setRequests] = useState(false);
    const [isPassword, setPassword] = useState(false);
    const [isNetwork, setNetwork] = useState(false);
    const [isReceive, setReceive] = useState(false);

    const [amount, setAmount] = useState(0);
    const [usd, setUSD] = useState(0);
    const [ticker, setTicker] = useState('');

    const [isLocked, setLocked] = useState(disk.lock.checkLock());

    const [net, setNet] = useState(String(ENQWeb.Net.currentProvider));

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
            console.log('error: ',err)
        })
    }

    if (isLocked) {
        return <AskPassword unlock={unlock}/>
    }

    if (isRequests) {
        return <Requests setRequests={setRequests}/>
    }

    if (isTransaction) {
        return <Transaction setTransaction={setTransaction}
                            amount={amount}
                            publicKey={props.user.publicKey}/>
    }

    if (isPassword) {
        return <Password setPassword={setPassword}/>
    }

    if (isPassword) {
        return <Password setPassword={setPassword}/>
    }

    if (isNetwork) {
        return <Network setNetwork={setNetwork}/>
    }

    if (isReceive) {
        return <Receive setReceive={setReceive} logout={props.logout} user={props.user}/>
    }

    balance()

    return (
        <div className={styles.main}>

            <Header/>

            <div className={styles.content}>

                <div className={styles.field + ' ' + styles.balance}>{amount} {ticker}</div>
                <div className={styles.field + ' ' + styles.usd}>{usd} USD</div>
                <div className={styles.field + ' ' + styles.address}>{props.user.publicKey}</div>
                <div className={styles.field + ' ' + styles.copy} onClick={() => copyPublicKey()}>COPY</div>

            </div>

            <div className={styles.form}>

                <div onClick={() => {
                    (disk.list.listOfTask().length > 0 ? setRequests(true) : null)
                }}
                     className={styles.field + ' ' + styles.button + ' ' + (disk.list.listOfTask().length > 0 ? styles.green : styles.disabled)}>Requests
                </div>

                {/*<div onClick={() => {*/}
                {/*}} className={styles.field + ' ' + styles.button + ' ' + styles.disabled}>Transactions history*/}
                {/*</div>*/}

                <div onClick={() => setTransaction(true)}
                     className={styles.field + ' ' + styles.button}>Send transaction
                </div>

                <div onClick={() => setReceive(true)}
                     className={styles.field + ' ' + styles.button}>Credentials
                </div>

                {/*this.setPassword(true)*/}
                {/*<div onClick={() => {*/}
                {/*}}*/}
                {/*     className={styles.field + ' ' + styles.button + ' ' + styles.disabled}>Set password*/}
                {/*</div>*/}

                <div onClick={() => setNetwork(true)}
                     className={styles.field + ' ' + styles.button}>Network: {net.toUpperCase()}
                </div>

                {/*<div onClick={props.logout}*/}
                {/*     className={styles.field + ' ' + styles.button + ' ' + styles.red}>Logout*/}
                {/*</div>*/}

            </div>
        </div>
    )
}