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
import AccountPage from "./components/AccountPage"

let net = localStorage.getItem('net')
if (!net) {
    net = 'bit'
    localStorage.setItem('net', net)
}

ENQWeb.Net.provider = net

export default function App(props) {
    const [isPassword, setPassword] = useState(!disk.lock.getHashPassword())
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

    const [isConnectLedger, setConnectLedger] = useState(false)
    const [ledgerTransport, setLedgerTransport] = useState()
    const [isAccountPage, setAccountPage] = useState(false)


    const checkLock = () => {
        if (disk.lock.checkLock() && disk.lock.getHashPassword()) {
            return true
        } else {
            return false
        }
    }

    const [isLock, setLock] = useState(checkLock)

    const getUser = async () => {
        let account = await global.disk.user.loadUser()
        setUser(account)
        // console.log(account)
        setLogin(account.privateKey ? false : true)
    }

    useEffect(() => {
        const version = chrome.runtime.getManifest().version
        const prod = false
        console.log('App: ' + version)
        // console.log('Prod: ' + prod)
        console.log('Lib: ' + ENQWeb.version)
        getUser()
            .then()
    }, [])


    const login = () => {
        setPassword(false)
        setLogin(true)
    }

    const login2 = (_user) => {
        // console.log('login2')
        setUser(_user)
        setLogin(false)
    }

    const logout = () => {
        global.disk.user.removeUser()
        disk.lock.removeLock()
        disk.promise.sendPromise({
            account: true,
            logout: true
        })
        global.asyncRequest({reject_all: true})
        setLogin(true)
        setLock(false)
        window.location.reload(false)
        localStorage.removeItem('net')
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


    const unlock = (_user) => {
        // console.log(_user)
        setUser(_user)
        setLock(false)
        setLogin(false)
    }

    if (isConfirm) {
        return <Confirm setConfirm={setConfirm} logout={logout}/>
    }

    if (isTransaction) {
        return (
            <Transaction
                setTransaction={setTransaction}
                isTransaction={isTransaction}
                publicKey={user.publicKey}
                token={user.token}
                getLedgerTransport={getLedgerTransport}
            />
        )
    }

    if (isNetwork) {
        return <Network setNetwork={setNetwork}/>
    }

    if (isReceive) {
        return <Receive setReceive={setReceive} user={user}/>
    }

    if (isPublicKeyRequest) {
        return <PublicKeyRequest setPublicKeyRequest={setPublicKeyRequest} request={isPublicKeyRequest}/>
    }

    if (isTransactionRequest) {
        return <TransactionRequest setTransactionRequest={setTransactionRequest} request={isTransactionRequest}
                                   user={user}/>
    }

    if (isTransactionHistory) {
        return <TransactionHistory setTransactionHistory={setTransactionHistory}
                                   request={isTransactionHistory}
                                   user={user}/>
    }

    if (isConnectLedger) {
        return <ConnectLedger getLedgerTransport={getLedgerTransport}/>
    }

    if (isSignRequest) {
        return <SignRequest setSignRequest={setSignRequest} request={isSignRequest}
                            getLedgerTransport={getLedgerTransport}/>
    }

    if (isLock) {
        return <Lock unlock={unlock} logout={logout} setConfirm={setConfirm}/>
    }

    if (isPassword || (!user.publicKey && !disk.lock.getHashPassword())) {
        return <Password setPassword={setPassword} login={login} publicKey={user.publicKey}/>
    }

    if (isLogin) return <Login login={login2}/>

    if (isAccountPage){
        return <AccountPage user={user}
                            setAccountPage={setAccountPage}/>
    }


    return <Account user={user}
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
                    setSignRequest={setSignRequest}
                    setAccountPage={setAccountPage}/>
}
