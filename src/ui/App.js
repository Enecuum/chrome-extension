import React, {useState} from "react";
import Login from "./components/Login";
import Lock from "./components/Lock";
import Requests from "./components/Requests";
import Transaction from "./components/Transaction";
import Password from "./components/Password";
import Network from "./components/Network";
import Receive from "./components/Receive";
import Account from "./components/Account";
import PublicKeyRequests from "./components/requests/PublicKeyRequest";
import TransactionRequest from "./components/requests/TransactionRequest";

export default function App(props) {

    const [isTransaction, setTransaction] = useState(false);
    const [isRequests, setRequests] = useState(false);
    const [isPassword, setPassword] = useState(false);
    const [isNetwork, setNetwork] = useState(false);
    const [isReceive, setReceive] = useState(false);

    const [isLogin, setLogin] = useState(disk.lock.checkLock());
    const [isLocked, setLocked] = useState(disk.lock.checkLock());

    let background = props.background.background

    let user = global.disk.user.loadUser()

    let login = (_user) => {
        user = _user
        setLogin(true)
    }

    let logout = () => {
        global.disk.user.removeUser()
        disk.lock.removeLock()
        global.asyncRequest({reject_all: true})
        setLogin(false)
    }


    if (isLogin)
        return <Login login={login}/>

    let unlock = () => {
        setLocked(false)
    }

    if (isLocked)
        return <Lock unlock={unlock}/>

    if (isLocked) {
        return <Lock unlock={unlock}/>
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
        return <Transaction setTransaction={setTransaction}
                            publicKey={user.publicKey}/>
    }

    if (isPassword) {
        return <Password setPassword={setPassword}/>
    }

    if (isNetwork) {
        return <Network setNetwork={setNetwork}/>
    }

    if (isReceive) {
        return <Receive setReceive={setReceive} user={user}/>
    }

    return <Account user={user} />
}