import React, { useState } from 'react'
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
    const [isPassword, setPassword] = useState(false)
    const [isNetwork, setNetwork] = useState(false)
    const [isReceive, setReceive] = useState(false)
    const [isTransaction, setTransaction] = useState(false)

    const [isPublicKeyRequest, setPublicKeyRequest] = useState(false)
    const [isTransactionRequest, setTransactionRequest] = useState(false)

    let user = global.disk.user.loadUser()

    const [isLogin, setLogin] = useState(!!user.privateKey)
    const [isLocked, setLocked] = useState(disk.lock.checkLock())

    const login = (_user) => {
        user = _user
        setLogin(true)
        console.log(isLogin)
    }

    const logout = () => {
        global.disk.user.removeUser()
        disk.lock.removeLock()
        global.asyncRequest({ reject_all: true })
        setLogin(false)
    }


    if (!isLogin && !isLocked) return <Login login={login} />

    const unlock = () => {
        setLocked(false)
    }

    if (isLocked) return <Lock unlock={unlock} />

    if (isLocked) {
        return <Lock unlock={unlock} />
    }

    // if (publicKeyRequest) {
    //     return <PublicKeyRequests request={this.state.publicKeyRequest}
    //                               taskId={this.state.taskId}/>
    // }
    //
    // if (transactionRequest) {
    //     return <TransactionRequest request={this.state.transactionRequest}
    //                                taskId={this.state.taskId}/>
    // }

    if (isTransaction) {
        return (
            <Transaction
            setTransaction={setTransaction}
            publicKey={user.publicKey}
          />
        )
    }

    if (isPassword) {
        return <Password setPassword={setPassword} />
    }

    if (isNetwork) {
        return <Network setNetwork={setNetwork} />
    }

    if (isReceive) {
        return <Receive setReceive={setReceive} user={user} />
    }

    if (isPublicKeyRequest)
        return <PublicKeyRequest setPublicKeyRequest={setPublicKeyRequest} />

    if (isTransactionRequest)
        return <TransactionRequest setTransactionRequest={setTransactionRequest} request={disk.list.listOfTask()[0]} />

    return <Account user={user}
                    logout={logout}
                    setLocked={setLocked}
                    setPassword={setPassword}
                    setNetwork={setNetwork}
                    setReceive={setReceive}
                    setTransaction={setTransaction}
                    setPublicKeyRequest={setPublicKeyRequest}
                    setTransactionRequest={setTransactionRequest} />
}
