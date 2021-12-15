import React, {useEffect, useState} from 'react'
import Login from './components/Login'
import Lock from './components/Lock'
import Transaction from './components/Transaction'
import Password from './components/Password'
import Network from './components/Network'
import Receive from './components/Receive'
import Account from './components/Account'


import PublicKeyRequest from './components/requests/PublicKeyRequest'
import TransactionRequest from './components/requests/TransactionRequest'
import ConnectLedger from './components/requests/ConnectLedger'
import Confirm from './components/Confirm'

import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import Eth from "@ledgerhq/hw-app-eth";
import SignRequest from "./components/requests/SignRequest";
import TransactionHistory from "./components/requests/TransactionHistory";
import Keys from "./components/account/Keys";
import Mnemonic from "./components/account/mnemonic/Mnemonic";
import ImportMnemonic from "./components/account/mnemonic/ImoprtMnemonic";
import Selector from "./components/account/Selector";
import {NET} from "../utils/names";
import ImportKey from "./components/account/ImportKey";
import eventBus from "../utils/eventBus";

let net = localStorage.getItem(NET)
if (!net) {
    net = 'bit'
    localStorage.setItem(NET, net)
}

ENQWeb.Net.provider = net

export default function App(props) {
    const [isPassword, setPassword] = useState(!userStorage.lock.getHashPassword())
    const [isLogin, setLogin] = useState(true)

    const [isConfirm, setConfirm] = useState(false)

    const [user, setUser] = useState({})

    const [isNetwork, setNetwork] = useState(false)
    const [isReceive, setReceive] = useState(false)
    const [isTransaction, setTransaction] = useState(false)

    const [isPublicKeyRequest, setPublicKeyRequest] = useState(false)
    const [isTransactionRequest, setTransactionRequest] = useState(false)
    const [isTransactionHistory, setTransactionHistory] = useState(false)

    const [isSignRequest, setSignRequest] = useState(false)

    const [isImportMnemonic, setImportMnemonic] = useState(false)
    const [isMnemonic, setMnemonic] = useState(false)
    const [isAccountSelector, setAccountSelector] = useState(false)
    const [isImportKey, setImportKey] = useState(false)


    const [isConnectLedger, setConnectLedger] = useState(false)
    const [ledgerTransport, setLedgerTransport] = useState()

    const [isKeys, setKeys] = useState(false)

    eventBus.on('lock', (data) => {

        setLock(true)
    })

    const checkLock = () => {
        if (userStorage.lock.checkLock() && userStorage.lock.getHashPassword()) {
            return true
        } else {
            return false
        }
    }

    const [isLock, setLock] = useState(checkLock)

    const getUser = async () => {
        let account = await userStorage.user.loadUser()
        setUser(account)
        console.warn('App get user object')
        console.log(account)
        setLogin(!account.publicKey || account.publicKey.length <= 0)
        // setLogin(true)
    }

    useEffect(() => {
        const version = chrome.runtime.getManifest().version
        console.log('App: ' + version)
        console.log('Lib: ' + ENQWeb.version)
        console.log('OS: ' + window.navigator.platform)
        getUser().then()
    }, [])


    const loginState = () => {
        setPassword(false)
        setLogin(true)
    }

    const login2 = (_user) => {
        // console.log('login2')
        setUser(_user)
        setLogin(false)
    }

    const logout = () => {

        userStorage.user.removeUser()
        userStorage.lock.removeLock()

        userStorage.promise.sendPromise({
            account: true,
            logout: true
        })
            .then(() => {

                asyncRequest({reject_all: true})

                setLogin(true)
                setLock(false)
                setPassword(true)
                // setPassword(true)

                localStorage.removeItem(NET)

                location.reload()
            })
    }

    const createLedgerTransport = async () => {

        return await TransportWebUSB.create().then(async transport => {

            const eth = new Eth(transport)
            console.log(eth)

            return await eth.getAddress("44'/60'/0'/0/0").then(async o => {

                console.log(o.address)

                // this.setState({
                //     address: o.address
                // })

                setLedgerTransport(transport)

                return transport
            })
        })
    }

    const getLedgerTransport = async () => {

        console.log(ledgerTransport)

        // if (!ledgerTransport)
        return await createLedgerTransport()

        // else
        //     return ledgerTransport
    }

    // global.disconnectAllPorts()

    // TODO user
    const unlock = (_user) => {
        // console.log(_user)
        setUser(_user)
        setLock(false)
        setLogin(false)
    }

    if (isImportMnemonic) {
        return <ImportMnemonic login={login2} setImportMnemonic={setImportMnemonic}/>
    }

    if (isImportKey) {
        return <ImportKey login={login2} setImportKey={setImportKey}/>
    }

    if (isMnemonic) {
        return <Mnemonic login={login2} setMnemonic={setMnemonic} user={user}/>
    }

    if (isAccountSelector) {
        return <Selector login={login2}
                         setAccountSelector={setAccountSelector}
                         setMnemonic={setMnemonic}
                         setImportMnemonic={setImportMnemonic}
                         setImportKey={setImportKey}/>
    }

    // if (isKeys) {
    //     return <Keys setKeys={setKeys}/>
    // }

    if (isConfirm) {
        return <Confirm setConfirm={setConfirm} logout={logout}/>
    }

    // TODO user
    if (isTransaction) {
        return (
            <Transaction
                setTransaction={setTransaction}
                isTransaction={isTransaction}
                publicKey={user.publicKey}
                token={user.token}
                getLedgerTransport={getLedgerTransport}
                setTransactionRequest={setTransactionRequest}
                setTransactionHistory={setTransactionHistory}
            />
        )
    }

    if (isNetwork) {
        return <Network setNetwork={setNetwork}/>
    }

    // if (isReceive) {
    //     return <Receive setReceive={setReceive} user={user}/>
    // }

    if (isPublicKeyRequest) {
        return <PublicKeyRequest setPublicKeyRequest={setPublicKeyRequest} request={isPublicKeyRequest}/>
    }

    // TODO user
    if (isTransactionRequest) {
        return <TransactionRequest setTransactionRequest={setTransactionRequest} request={isTransactionRequest}
                                   user={user}/>
    }

    // TODO user
    if (isTransactionHistory) {
        return <TransactionHistory setTransactionHistory={setTransactionHistory}
                                   request={isTransactionHistory}
                                   user={user}/>
    }

    if (isConnectLedger) {
        return <ConnectLedger getLedgerTransport={getLedgerTransport} login={login2}/>
    }

    if (isSignRequest) {
        return <SignRequest setSignRequest={setSignRequest} request={isSignRequest}
                            getLedgerTransport={getLedgerTransport}/>
    }


    // TODO user
    if (isPassword || (!user.publicKey && !userStorage.lock.getHashPassword())) {
        return <Password user={user} setPassword={setPassword} login={loginState} publicKey={user.publicKey}/>
    }

    if (isLock) {
        return <Lock unlock={unlock} logout={logout} setConfirm={setConfirm}/>
    }

    if (isLogin) return <Login login={login2} setMnemonic={setMnemonic}/>

    // TODO user
    return <Account user={user}
                    login={login2}
                    logout={logout}
                    setLock={setLock}
                    setPassword={setPassword}
                    setConfirm={setConfirm}
                    setNetwork={setNetwork}
                    setReceive={setReceive}
                    setTransaction={setTransaction}
                    setPublicKeyRequest={setPublicKeyRequest}
                    setTransactionRequest={setTransactionRequest}
                    setTransactionHistory={setTransactionHistory}
                    setConnectLedger={setConnectLedger}
                    setKeys={setKeys}
                    setSignRequest={setSignRequest}
                    setMnemonic={setMnemonic}
                    setAccountSelector={setAccountSelector}
                    setImportMnemonic={setImportMnemonic}
    />
}
