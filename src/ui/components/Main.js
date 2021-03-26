import React, {useState, useEffect} from "react";
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
// import 'react-tabs/style/react-tabs.css';
import styles from "../css/index.module.css";
import Transaction from "./Transaction";
import Requests from "./Requests"
import Password from "./Password";
import Network from "./Network";
import AskPassword from "./AskPassword";
import Receive from "./Receive";
import Header from "../elements/Header";
import Address from "../elements/Address";
import Account from "./Account";

let names = {
    enable: 'Share account address',
    tx: 'Sign transaction'
}

export default function Main(props) {

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

    return <Account/>
}