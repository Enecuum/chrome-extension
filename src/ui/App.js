import React, {useEffect, useState} from 'react'
import Login from './components/Login'
import Lock from './components/Lock'
import Requests from './components/Requests'
import Transaction from './components/Transaction'
import Password from './components/Password'
import Network from './components/Network'
import Receive from './components/Receive'
import Account from './components/Account'


import PublicKeyRequest from './components/requests/PublicKeyRequest'
import TransactionRequest from './components/requests/TransactionRequest'

export default function App(props) {
    const [isPassword, setPassword] = useState(!disk.lock.getHashPassword())
    const [isLogin, setLogin] = useState(false)

    const [user, setUser] = useState({});

    const [isNetwork, setNetwork] = useState(false)
    const [isReceive, setReceive] = useState(false)
    const [isTransaction, setTransaction] = useState(false)

    const [isPublicKeyRequest, setPublicKeyRequest] = useState(false)
    const [isTransactionRequest, setTransactionRequest] = useState(false)

    const checkLock = () => {
        if (disk.lock.checkLock() && disk.lock.getHashPassword())
            return true
        else
            return false
    }

    const [isLock, setLock] = useState(checkLock)

    const getUser = async () => {
        let account = await global.disk.user.loadUser()
        setUser(account)
        setLogin(!!account.privateKey)
    }

    useEffect(() => {
        const version = chrome.runtime.getManifest().version
        console.log(version)
        getUser().then()
    }, [])


    const login = () => {
        setPassword(false)
    }

    const login2 = (_user) => {
        // console.log('login2')
        setUser(_user)
        setLogin(true)
    }

    const logout = () => {
        global.disk.user.removeUser()
        disk.lock.removeLock()
        disk.promise.sendPromise({account: true, logout: true})
        global.asyncRequest({reject_all: true})
        setLogin(false)
        setLock(false);
        window.location.reload(false);
    }

    if (isPassword || (!user.publicKey && !disk.lock.getHashPassword())) {
        return <Password setPassword={setPassword} login={login} publicKey={user.publicKey}/>
    }

    if (!isLogin && !isLock) return <Login login={login2}/>

    const unlock = () => {
        setLock(false)
    }

    if (isLock) return <Lock unlock={unlock} logout={logout}/>

    if (isTransaction) {
        return (
            <Transaction
                setTransaction={setTransaction}
                publicKey={user.publicKey}
            />
        )
    }

    if (isNetwork) {
        return <Network setNetwork={setNetwork}/>
    }

    if (isReceive) {
        return <Receive setReceive={setReceive} user={user}/>
    }

    if (isPublicKeyRequest)
        return <PublicKeyRequest setPublicKeyRequest={setPublicKeyRequest} request={isPublicKeyRequest}/>

    if (isTransactionRequest)
        return <TransactionRequest setTransactionRequest={setTransactionRequest} request={isTransactionRequest}/>

    return <Account user={user}
                    logout={logout}
                    setLock={setLock}
                    setPassword={setPassword}
                    setNetwork={setNetwork}
                    setReceive={setReceive}
                    setTransaction={setTransaction}
                    setPublicKeyRequest={setPublicKeyRequest}
                    setTransactionRequest={setTransactionRequest}/>
}
