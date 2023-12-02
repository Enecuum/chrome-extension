import React, { useEffect, useState } from 'react'
import Login from './components/Login'
import Lock from './components/Lock'
import Transaction from './components/Transaction'
import Password from './components/Password'
import Network from './components/Network'
import Receive from './components/Receive'
import Account from './components/main/Account'


import PublicKeyRequest from './components/requests/PublicKeyRequest'
import TransactionRequest from './components/requests/TransactionRequest'
import ConnectLedger from './components/requests/ConnectLedger'
import Confirm from './components/Confirm'

import TransportWebUSB from '@ledgerhq/hw-transport-webusb'
import Eth from '@ledgerhq/hw-app-eth'
import SignRequest from './components/requests/SignRequest'
import TransactionHistory from './components/requests/TransactionHistory'
import Keys from './components/account/Keys'
import Referral from './components/Referral'
import Mnemonic from './components/account/mnemonic/Mnemonic'
import ImportMnemonic from './components/account/mnemonic/ImoprtMnemonic'
import Selector from './components/account/Selector'
import { NET, PASSWORD_VERSION, WAKELOCK } from '../utils/names'
import ImportKey from './components/account/ImportKey'
import eventBus from '../utils/eventBus'
import Ledger from './components/account/Ledger'
import { ledgerPath } from './Utils'
import TransportWebHID from '@ledgerhq/hw-transport-webhid'

import WebView from './components/WebView'
import Mining from './components/Mining'
import QRCamera from './components/QRCamera'
import { Capacitor } from '@capacitor/core'
import { NativeBiometric } from 'capacitor-native-biometric'

import { createGesture, Gesture } from '@ionic/react'

import PoSList from './components/pos/PoSList'
import PoSCard from './components/pos/PoSCard'
import PosSend from "./components/pos/PosSend";
import TransferList from "./components/pos/transferList";


let net = localStorage.getItem(NET)
if (!net) {
    net = 'pulse'
    localStorage.setItem(NET, net)
}

ENQWeb.Net.provider = net

export default function App(props) {


    const [isWebView, setWebView] = useState(false)

    const [isPassword, setPassword] = useState(!userStorage.lock.getHashPassword())
    const [isLogin, setLogin] = useState(true)

    const [isConfirm, setConfirm] = useState(false)

    const [user, setUser] = useState({})

    const [isNetwork, setNetwork] = useState(false)
    const [isReceive, setReceive] = useState(false)
    const [isMining, setMining] = useState(false)
    const [isTransaction, setTransaction] = useState(false)

    const [isPublicKeyRequest, setPublicKeyRequest] = useState(false)
    const [isTransactionRequest, setTransactionRequest] = useState(false)
    const [isTransactionHistory, setTransactionHistory] = useState(false)

    const [isSignRequest, setSignRequest] = useState(false)

    const [isImportMnemonic, setImportMnemonic] = useState(false)
    const [isMnemonic, setMnemonic] = useState(false)
    const [isAccountSelector, setAccountSelector] = useState(false)
    const [isImportKey, setImportKey] = useState(false)


    const [isLedger, setLedger] = useState(false)
    const [ledgerTransport, setLedgerTransport] = useState(false)

    const [isKeys, setKeys] = useState(false)
    const [isReferral, setReferral] = useState(false)
    const [isCamera, setCamera] = useState(false)
    const [isBiometry, setBiometry] = useState(false)
    const [isPosList, setPosList] = useState(false)
    const [isPosCard, setPosCard] = useState(false)
    const [isPosSend, setPosSend] = useState(false)
    const [isTransferList, setTransferList] = useState(false)

    const [isIntervalMinerGetter, setIsIntervalMinerGetter] = useState(false)

    let [deferredPrompt, setDeferredPrompt] = useState()
    let initPWA = () => {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault()
            deferredPrompt = e
            setDeferredPrompt(e)
        })
        initBiometry()
            .then()
    }
    let installPWA = async () => {
        deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice
        deferredPrompt = null
    }

    const getBiometry = () => {
        let config = JSON.parse(localStorage.getItem(PASSWORD_VERSION))
        if (config === null) {
            config = {}
        }
        if (config.bio === undefined) {
            config.bio = false
            localStorage.setItem(PASSWORD_VERSION, JSON.stringify(config))
        }
        return config.bio
    }

    const changeBiometry = () => {
        if (isBiometry) {
            console.log(isBiometry)
            let config = JSON.parse(localStorage.getItem(PASSWORD_VERSION))
            config.bio = !config.bio
            localStorage.setItem(PASSWORD_VERSION, JSON.stringify(config))
            userStorage.promise.sendPromise({
                biometry: true,
                update: true,
                data: config.bio
            })
                .then()
            return true
        } else {
            console.log('isBiometry:' + false)
        }
        return false

    }

    let initBiometry = async () => {
        let isAvailable = await NativeBiometric.isAvailable()
            .then(data => true)
            .catch(() => false)
        setBiometry(isAvailable)
    }

    let setWakeLock = async () => {
        try {
            const wakeLock = await navigator.wakeLock.request('screen')
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    }

    let initWakeLock = async () => {
        try {
            let wakelock = localStorage.getItem(WAKELOCK)
            if (wakelock === null) {
                localStorage.setItem(WAKELOCK, JSON.stringify({ status: false }))
            } else {
                // console.log(wakelock)
                wakelock = JSON.parse(wakelock)
                if (wakelock.status) {
                    setWakeLock()
                        .then()
                }
            }
        } catch (e) {
            console.log(e)
        }
    }

    let changeWakeLock = async () => {
        try {
            let wakelock = JSON.parse(localStorage.getItem(WAKELOCK))
            localStorage.setItem(WAKELOCK, JSON.stringify({ status: !wakelock.status }))
            initWakeLock().then()
        } catch (e) {
            console.log(e)
        }
    }

    let getWakeLock = () => {
        try {
            let wakelock = JSON.parse(localStorage.getItem(WAKELOCK))
            return wakelock.status;
        } catch (e) {
            console.log(e)
            return false;
        }
    }


    eventBus.on('lock', (data) => {
        console.warn('EVENT: ' + 'lock' + ' ' + data.message)
        setLock(data.message)
    })


    const ledgerTransportController = async () => {
        // console.log("Support WebHID:", await TransportWebHID.isSupported())
        try {
            // console.info("connect: ", navigator.userAgentData.platform)
            if (ledgerTransport === false) {
                // console.log('work')
                let Transport
                if (navigator.userAgentData.platform === 'Android') {
                    Transport = await TransportWebUSB.create()
                } else {
                    Transport = await TransportWebHID.create()
                }
                // console.warn(Transport)
                setLedgerTransport(Transport)
                return Transport
            } else {
                return ledgerTransport
            }
        } catch (err) {
            console.error(err)
            setLedgerTransport(false)
            return false
        }

    }

    const checkLock = (log = true) => {

        if (userStorage.lock.checkLock() && userStorage.lock.getHashPassword()) {
            if (log) {
                console.log('LOCKED')
            }
            return true
        } else {
            if (log) {
                console.log('LOCK OPEN')
            }
            return false
        }
    }

    const [isLock, setLock] = useState(checkLock)

    const lockChecker = () => {
        setInterval(() => {
            setLock(checkLock(false))
        }, 1000)
    }

    lockChecker()

    const getUser = async () => {
        let account = await updateUserData()
        // console.warn('App get user object')
        // console.log(account)
        setLogin(!account.publicKey || account.publicKey.length <= 0)
        // setLogin(true)
    }

    const updateUserData = async () => {
        let account = await userStorage.user.loadUser()
        setUser(account)
        return account
    }

    useEffect(() => {
        initPWA()
        const version = chrome.runtime.getManifest().version
        console.log('App: ' + version)
        console.log('Lib: ' + ENQWeb.version)
        console.log('OS: ' + window.navigator.platform)
        console.log('Platform: ' + Capacitor.getPlatform())
        getUser()
            .then()

        initGestures()
        initWakeLock()
            .then()
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

                asyncRequest({ reject_all: true })

                setLock(false)
                setLogin(true)
                setPassword(true)
                // setPassword(true)
                localStorage.removeItem(NET)
                if (getBiometry() === true) {
                    changeBiometry()
                }

                location.reload(false)
            })
    }

    const createLedgerTransport = async () => {

        return await TransportWebUSB.create()
            .then(async transport => {

                const eth = new Eth(transport)
                console.log(eth)

                return await eth.getAddress('44\'/60\'/0\'/0/0')
                    .then(async o => {

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

    const initGestures = () => {

        const gesture = createGesture({
            el: document.getElementById('app'),
            threshold: 15,
            gestureName: 'my-gesture',
            onMove: ev => onMove(ev)
        })

        gesture.enable()

        const onMove = (detail) => {
            const type = detail.type
            const currentX = detail.currentX
            const deltaX = detail.deltaX
            const velocityX = detail.velocityX

            if (velocityX > 1) {
                console.log('BACK')
            }

            // console.log({type, currentX, deltaX, velocityX})
        }
    }

    // ________LOCK_____________
    if (isConfirm) {
        return <Confirm setConfirm={setConfirm} logout={logout}/>
    }

    if (isLock) {
        return <Lock unlock={unlock} logout={logout} setConfirm={setConfirm} getBiometry={getBiometry}
                     changeBiometry={changeBiometry}/>
    }

    // _____________other____________
    if (isImportMnemonic) {
        return <ImportMnemonic login={login2} setImportMnemonic={setImportMnemonic}/>
    }

    if (isImportKey) {
        return <ImportKey login={login2} setImportKey={setImportKey}/>
    }

    if (isMnemonic) {
        return <Mnemonic login={login2} setMnemonic={setMnemonic} user={user}/>
    }

    if (isKeys) {
        return <Keys isKeys={isKeys} setKeys={setKeys}/>
    }

    if (isLedger) {
        return <Ledger setLedger={setLedger}
                       getLedgerTransport={getLedgerTransport}
                       setLedgerTransport={setLedgerTransport}
                       ledgerTransport={ledgerTransport}
                       setKeys={setKeys}
                       ledgerTransportController={ledgerTransportController}
        />
    }

    if (isAccountSelector) {
        return <Selector login={login2}
                         setLedger={setLedger}
                         setKeys={setKeys}
                         setAccountSelector={setAccountSelector}
                         setMnemonic={setMnemonic}
                         setImportMnemonic={setImportMnemonic}
                         setImportKey={setImportKey}
                         setTransport={setLedgerTransport}
                         ledgerTransport={ledgerTransport}
                         ledgerTransportController={ledgerTransportController}
                         updateUserData={updateUserData}
        />
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
                setLedgerTransport={setLedgerTransport}
                ledgerTransport={ledgerTransport}
                ledgerTransportController={ledgerTransportController}
            />
        )
    }

    if (isNetwork) {
        return <Network setNetwork={setNetwork}
                        user={user}
                        updateUserData={updateUserData}
        />
    }

    if (isMining) {
        return <Mining setMining={setMining} setIsIntervalMinerGetter={setIsIntervalMinerGetter} isIntervalMinerGetter={isIntervalMinerGetter}/>
    }

    // if (isReceive) {
    //     return <Receive setReceive={setReceive} user={user}/>
    // }

    // __________Requests____________-
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

    // if (isConnectLedger) {
    //     return <ConnectLedger getLedgerTransport={getLedgerTransport} login={login2}/>
    // }

    if (isSignRequest) {
        return <SignRequest setSignRequest={setSignRequest} request={isSignRequest}
                            getLedgerTransport={getLedgerTransport}/>
    }

    // ____________POS______________
    if(isTransferList){
        return <TransferList isTransferList={isTransferList} setTransferList={setTransferList} isPosCard={isPosCard} user={user} setTransactionRequest={setTransactionRequest} setPosCard={setPosCard} setPosList={setPosList}/>
    }

    if (isPosSend){
        return <PosSend isPosSend={isPosSend} setPosSend={setPosSend} isPosCard={isPosCard} user={user} setTransactionRequest={setTransactionRequest} setPosCard={setPosCard} setPosList={setPosList}/>
    }

    if (isPosCard){
        return <PoSCard isPoSCard={isPosCard} setPosCard={setPosCard} user={user} setPosSend={setPosSend} setTransactionRequest={setTransactionRequest} setPosList={setPosList} setTransferList={setTransferList}/>
    }

    if (isPosList){
        return <PoSList isPosList={isPosList} setPosList={setPosList} user={user} setPoSCard={setPosCard}/>
    }


    //__________Account__________
    // TODO user
    if (isPassword || (!user.publicKey && !userStorage.lock.getHashPassword())) {
        return <Password user={user} setPassword={setPassword} login={loginState} publicKey={user.publicKey}
                         getBiometry={getBiometry}/>
    }

    if (isLogin) return <Login login={login2} setMnemonic={setMnemonic}/>

    if (isWebView) {
        return <WebView url={isWebView} setWebView={setWebView} user={user}
                        setTransactionRequest={setTransactionRequest}
                        setPublicKeyRequest={setPublicKeyRequest}/>
    }

    if (isCamera) return <QRCamera isCamera={isCamera} setCamera={setCamera}/>

    if (isReferral) {
        return <Referral isReferral={isReferral} setReferral={setReferral} setCamera={setCamera}
                         publicKey={user.publicKey}/>
    }

    // TODO user
    return <Account user={user}
                    login={login2}
                    logout={logout}
                    setLock={setLock}
                    setPassword={setPassword}
                    setWebView={setWebView}
                    setConfirm={setConfirm}
                    setNetwork={setNetwork}
                    setMining={setMining}
                    setReceive={setReceive}
                    setTransaction={setTransaction}
                    setPublicKeyRequest={setPublicKeyRequest}
                    setTransactionRequest={setTransactionRequest}
                    setTransactionHistory={setTransactionHistory}
                    setKeys={setKeys}
                    setSignRequest={setSignRequest}
                    setMnemonic={setMnemonic}
                    setAccountSelector={setAccountSelector}
                    setLedger={setLedger}
                    setImportMnemonic={setImportMnemonic}
                    installPWA={installPWA}
                    updateUserData={updateUserData}
                    setReferral={setReferral}
                    getBiometry={getBiometry}
                    changeBiometry={changeBiometry}
                    getWakeLock={getWakeLock}
                    changeWakeLock={changeWakeLock}
                    setPosList={setPosList}
    />
}
