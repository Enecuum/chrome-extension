import React, { useEffect, useState } from 'react'
import styles from '../../css/index.module.css'
import Header from '../../elements/Header'
import Address from '../../elements/Address'
import Menu from '../../elements/Menu'
import { copyToClipboard, explorerAddress, explorerTX, generateIcon, shortHash } from '../../Utils'
import Separator from '../../elements/Separator'
import { apiController } from '../../../utils/apiController'
import Input from '../../elements/Input'
import Assets from './Assets'
import Activity from './Activity'
import { globalState } from '../../../globalState'
import {getText, texts} from "../../../utils/texts";


let tickers = {}
let decimals = {}

export default function Account(props) {

    const [trustedTokens, setTrustedTokens] = useState(apiController.getTokenList())

    global.setIframeWork(false)

    ENQWeb.Enq.provider = props.user.net

    let [localNetworks, setLocalNetworks] = useState(JSON.parse(localStorage.getItem('networks')) || [])

    const [amount, setAmount] = useState(BigInt(0))
    const [amountDecimal, setAmountDecimal] = useState(1e10)
    const [usd, setUSD] = useState(BigInt(0))
    const [ticker, setTicker] = useState('')
    const [logo, setLogo] = useState('./images/enq.png')
    const [connectionsCounter, setConnectionsCounter] = useState(0)

    const [isLocked, setLocked] = useState(userStorage.lock.checkLock())

    const [isConnects, setConnects] = useState(false)
    const [connectsElements, setConnectsElements] = useState([])

    const [assets, setAssets] = useState([])
    const [activity, setActivity] = useState(userStorage.list.listOfTask())
    const [menu, setMenu] = useState(false)


    const [isCopied, setCopied] = useState(false)

    const [favoriteSites, setFavoriteSites] = useState([])

    const [activeTab, setActiveTab] = useState(0)

    const [userTrustedTokens, setUserTrustedTokens] = useState(userStorage.tokens.getUserTrustedTokens())

    const [isMiningToken, setMiningToken] = useState(true)

    const [activityString, setActivityString] = useState(activity.length > 0 ? <sup>{activity.length}</sup> : '')

    const clickMenu = () => {
        setMenu(!menu)
    }

    const getConnects = async () => {
        let connects = await asyncRequest({ connectionList: true })
        if (typeof connects === 'object') {
            setConnectionsCounter(Object.keys(connects.ports ? connects.ports : {}).length)
        }
        if (typeof connects === 'number') {
            setConnectionsCounter(connects)
        }
        return connects
    }

    const copyPublicKey = () => {
        copyToClipboard(props.user.publicKey)
        setCopied(true)
    }

    const getMainToken = () => {
        return ENQWeb.Enq.token[ENQWeb.Enq.provider] ? ENQWeb.Enq.token[ENQWeb.Enq.provider] : (localNetworks.find(element => element.host === ENQWeb.Net.currentProvider) ?
            localNetworks.find(element => element.host === ENQWeb.Net.currentProvider).token : '')
    }

    const getBalance = async () => {
        // console.log('getBalance')
        ENQWeb.Enq.provider = props.user.net

        const mainToken = getMainToken()
        const currentToken = props.user.token ? props.user.token : mainToken

        let tokens = []
        try {
            let globalStateBalances = globalState.getTokenBalance(ENQWeb.Enq.provider, props.user.publicKey, currentToken)
            // console.log('SET GLOBAL STATE AMOUNT: ' + globalStateBalances.amount)
            setAmount(globalStateBalances.amount)
            setTicker(globalStateBalances.ticker)
            setLogo(generateIcon(currentToken))
            setAmountDecimal(10 ** (globalStateBalances.decimal || 10))
        } catch (e) {
            console.warn('wrong data in global state!\n')
            console.error(e)
        }


        await apiController.getBalanceAll(props.user.publicKey)
            .then(async (res) => {

                let headerLoader2 = document.getElementById('header_loader')
                headerLoader2.style.width = '95%'

                if (res.includes('<!DOCTYPE')) {
                    console.warn('server is down')
                } else {
                    globalState.setBalanceData(ENQWeb.Enq.provider, props.user.publicKey, res)
                    globalState.save()
                        .then()
                }
                let amount = BigInt(0)
                let ticker = ''
                let decimal = 10

                //TODO untrusted token
                let image = './images/enq.png'

                for (let i in res) {

                    tickers[res[i].token] = res[i].ticker
                    decimals[res[i].token] = 10 ** res[i].decimals

                    if (res[i].token === currentToken) {
                        amount = BigInt(res[i].amount)
                        ticker = res[i].ticker
                        image = generateIcon(res[i].token)
                        decimal = res[i].decimals

                        setMiningToken(res[i].minable === 1)

                        if (props.user.net !== 'https://pulse.enecuum.com') {
                            if (trustedTokens.find(token => token.address === res[i].token)) {
                                let api_price_raw = (await apiController.getTokenInfo(res[i].token))[0].price_raw
                                let price_raw = api_price_raw && api_price_raw.cg_price ? api_price_raw : {
                                    cg_price: 0,
                                    decimals: 10
                                }
                                // console.log(price_raw)
                                const value = BigInt(price_raw.cg_price) * BigInt(amount) / BigInt(10 ** price_raw.decimals)
                                setUSD(value)
                            } else {
                                setUSD(0)
                            }
                        }

                    } else {

                        let tokenUsd = 0

                        if (trustedTokens.find(token => token.address === res[i].token)) {
                            let api_price_raw = (await apiController.getTokenInfo(res[i].token))[0].price_raw
                            let price_raw = api_price_raw && api_price_raw.cg_price ? api_price_raw : {
                                cg_price: 0,
                                decimals: 10
                            }
                            tokenUsd = BigInt(price_raw.cg_price) * BigInt(res[i].amount) / BigInt(10 ** price_raw.decimals)
                        }

                        // console.log(res[i].amount)

                        let userTrustedToken = userTrustedTokens.find(token => token.hash === res[i].token)
                        if (userTrustedToken) {
                            // console.log(userTrustedToken)
                            userTrustedToken.usd = tokenUsd
                            userTrustedToken.amount = BigInt(res[i].amount)
                            // setUserTrustedTokens([...userTrustedTokens, userTrustedToken])
                        } else {
                            tokens.push({
                                amount: BigInt(res[i].amount),
                                ticker: res[i].ticker,
                                usd: tokenUsd,
                                image: generateIcon(res[i].token),
                                tokenHash: res[i].token,
                                decimals: 10 ** res[i].decimals,
                            })
                        }
                    }
                }

                // USER TRUSTED
                for (let i in userTrustedTokens) {
                    if (currentToken === userTrustedTokens[i].hash) {
                        // amount = BigInt(res[i].amount)
                        ticker = userTrustedTokens[i].ticker
                        image = generateIcon(userTrustedTokens[i].hash)
                        // decimal = res[i].decimals
                    }
                }

                // console.log(tickers)

                setAmount(amount)
                setTicker(ticker)
                setLogo(image)
                setAmountDecimal(10 ** decimal)

                //TODO
                cacheTokens(tickers)
                    .then()

                //TODO
                if (props.user.net === 'https://pulse.enecuum.com') {

                    if (props.user.token === mainToken) {
                        apiController.getCoinGeckoPrice()
                            .then(enecuumUSD => {
                                const usd = BigInt((enecuumUSD * 1e10).toFixed(0))
                                const value = usd * BigInt(amount) / BigInt(10 ** decimal)
                                setUSD(value)
                            })
                    } else {
                        setUSD(0)
                    }
                }

                setAssets([{
                    amount: amount,
                    ticker: ticker,
                    usd: usd,
                    image: image,
                    tokenHash: currentToken,
                    decimals: 10 ** decimal,
                    main: true
                }, ...tokens])

                let headerLoader3 = document.getElementById('header_loader')
                headerLoader3.style.width = '100%'
                headerLoader3.style.opacity = 0

            })
            .catch((err) => {
                console.error('error: ', err)
            })
    }

    const openPopup = async () => {
        let params = getUrlVars()
        let task = userStorage.task.loadTask()
        if (params.type === 'enable') {
            if (task[params.id] && !isLocked) {
                props.setPublicKeyRequest(task[params.id])
                return false
            }
        }
        if (params.type === 'tx') {
            if (task[params.id] && !isLocked) {
                props.setTransactionRequest(task[params.id])
                return false
            }
        }
        if (params.type === 'sign') {
            if (task[params.id] && !isLocked) {
                props.setSignRequest(task[params.id])
                return false
            }
        }
        if (params.type === 'connectLedger') {
            // if (!isLocked) {
            //     // props.setTransactionRequest(task[params.id])
            //     props.setConnectLedger(true)
            //     return false
            // }
        }
        if (params.type === 'ledger') {
            if (!isLocked) {
                props.setLedger(true)
                props.setAccountSelector(true)
                return false
            }
        }
        if (params.type === 'accounts') {
            if (!isLocked) {
                // props.setTransactionRequest(task[params.id])
                props.setAccountSelector(true)
                return false
            }
        }

        return true
    }

    const changeToken = async (hash) => {

        // console.log(hash)

        let user = props.user
        user.token = hash

        await userStorage.promise.sendPromise({
            account: true,
            set: true,
            data: user
        })

        // await getBalance()

        setActiveTab(props.user.token === ENQWeb.Enq.token[ENQWeb.Enq.provider] ? 0 : 1)
        window.scrollTo(0, 0)
    }

    const renderMenu = () => {
        if (menu) {
            return <Menu login={props.login}
                         logout={props.logout}
                         publicKey={props.user.publicKey}
                         setLock={props.setLock}
                         setConfirm={props.setConfirm}
                         setNetwork={props.setNetwork}
                         setMining={props.setMining}
                         setKeys={props.setKeys}
                         setPassword={props.setPassword}
                         setWebView={props.setWebView}
                         setMnemonic={props.setMnemonic}
                         setAccountSelector={props.setAccountSelector}
                         setImportMnemonic={props.setImportMnemonic}
                         installPWA={props.installPWA}
                         setReferral={props.setReferral}
                         getBiometry={props.getBiometry}
                         changeBiometry={props.changeBiometry}
            />
        }
    }

    useEffect(() => {

        props.user.token && props.user.token !== ENQWeb.Enq.token[ENQWeb.Enq.provider] ? setActiveTab(1) : () => {}

        openPopup()
            .then(async result => {
                if (result === true) {
                    getBalance()
                        .then()
                    getConnects()
                        .then(() => {
                            let a = setInterval(() => {
                                getConnects()
                                    .then()
                                updateActivity()
                            }, 1000)
                        })
                }
            })

        apiController.getServerTokenList().then(tokens => {
            setTrustedTokens(tokens)
        })

        let isMounted = true
        return () => {
            isMounted = false
        }

    }, [usd, activeTab, userTrustedTokens, props.user])

    let setAllConnects = (connects) => {

        let elements = []
        let sites = userStorage.sites.getSites()
        let favSites = []
        for (const key in connects) {
            elements.push(
                <div key={key} onClick={() => {
                }} className={`${styles.connect}`}>
                    <div>{key.replaceAll('https://', '')}</div>
                    <div onClick={() => {
                        userStorage.promise.sendPromise({
                            ports: true,
                            disconnect: true,
                            name: key
                        })
                            .then(() => {
                                console.log(`${key} is disconnected`)
                                getConnects()
                                    .then()
                                setActiveTab(0)
                            })
                    }}>✕
                    </div>
                </div>)

        }

        for (const key in sites) {
            if (sites[key] === true) {
                favSites.push(
                    <div key={key} onClick={() => {
                    }} className={`${styles.connect}`}>
                        <div>{key.replaceAll('https://', '')}</div>
                        <div onClick={() => {
                            userStorage.promise.sendPromise({
                                ports: true,
                                disconnect: true,
                                favorite: true,
                                name: key
                            })
                                .then(() => {
                                    console.log(`${key} is disconnected`)
                                    getConnects()
                                        .then()
                                    setActiveTab(0)
                                })
                        }}>✕
                        </div>
                    </div>)
            }
        }

        if (elements.length >= 2) {
            elements.push(
                <div onClick={() => {
                    userStorage.promise.sendPromise({
                        ports: true,
                        disconnect: true,
                        all: true
                    })
                        .then(() => {
                            console.warn('Disconnect all')
                            getConnects()
                                .then()
                            setActiveTab(0)
                        })

                }} className={`${styles.field} ${styles.button}`}>
                    Disconnect all
                </div>)
        }
        setFavoriteSites(favSites)
        setConnectsElements(elements)
        setConnects(true)
        setActiveTab(2)
    }

    BigInt.prototype.toJSON = function () {
        return this.toString()
    }

    const updateActivity = () => {
        let update = userStorage.list.listOfTask()
        setActivity(update)
        setActivityString(update.length > 0 ? <sup>{update.length}</sup> : '')
    }

    const addUserTrustedToken = (item) => {
        userStorage.tokens.setUserTrustedTokens([...userTrustedTokens, item])
        setUserTrustedTokens([...userTrustedTokens, item])
    }

    // console.log(props.user.token)

    // console.log(ENQWeb.Enq.token[ENQWeb.Enq.provider])

    // console.log(props.user.token)


    return (
        <div className={styles.main}>

            <Header clickMenu={clickMenu} user={props.user}/>

            {renderMenu()}

            <Address publicKey={props.user.publicKey}
                     connectionsCounter={connectionsCounter}
                     isCopied={isCopied}
                     setCopied={setCopied}
                     token={props.user.token}
                     isMainToken={!props.user.token || props.user.token === ENQWeb.Enq.token[ENQWeb.Enq.provider]}
                     setMainToken={() => {
                         changeToken(ENQWeb.Enq.token[ENQWeb.Enq.provider])
                             .then()
                     }}
                     setConnects={(connects) => setAllConnects(connects)}
                     setPublicKeyRequest={props.setPublicKeyRequest}
                     getBalance={getBalance}
            />

            <div className={styles.content}>

                <img className={styles.content_logo} src={logo} alt=""/>
                <div className={styles.balance}
                     title={decimals[props.user.token] ? (Number(amount) / decimals[props.user.token]) : ''}>
                    {(Number(amount) / amountDecimal).toFixed(4)}
                    {' '}
                    {ticker}
                </div>
                <div className={styles.usd}>
                    $
                    {(Number(usd) / 1e10).toFixed(2)}
                    {' '}
                    USD
                </div>

            </div>

            <div className={styles.center}>

                <div className={styles.circle_button} onClick={copyPublicKey}>
                    <div className={styles.icon_container}><img className={styles.icon} src="./images/icons/8.png"/>
                    </div>
                    <div>Copy</div>
                </div>

                <div className={styles.circle_button}
                     onClick={() => props.setTransaction({
                         balance: amount,
                         ticker: ticker,
                         token: props.user.token
                     })}>
                    <div className={styles.icon_container}><img className={styles.icon} src="./images/icons/12.png"/>
                    </div>
                    <div>Send</div>
                    {/*<div>Transaction</div>*/}
                </div>

                {isMiningToken && <div className={styles.circle_button} onClick={props.setMining}>
                    <div className={styles.icon_container}><img className={styles.icon} src="./images/icons/9.png"/>
                    </div>
                    <div>Mining</div>
                </div>}

            </div>

            {/*TABS*/}

            <div className={styles.bottom}>

                {/*{console.log(props.user.token === ENQWeb.Enq.token[ENQWeb.Enq.provider])}*/}

                <div className={styles.bottom_tabs}>
                    {(!props.user.token || (props.user.token === ENQWeb.Enq.token[ENQWeb.Enq.provider])) && <div
                        onClick={() => setActiveTab(0)}
                        className={(activeTab === 0 ? ` ${styles.bottom_tab_active}` : '')}
                    >
                        Assets
                    </div>}
                    <div
                        onClick={() => setActiveTab(1)}
                        className={(activeTab === 1 ? ` ${styles.bottom_tab_active}` : '')}
                    >
                        Activity {activityString}
                    </div>
                    {isConnects && activeTab === 2 && <div
                        onClick={() => setActiveTab(2)}
                        className={(activeTab === 2 ? ` ${styles.bottom_tab_active}` : '')}
                    >
                        Connects
                    </div>}
                </div>

                <Assets activeTab={activeTab}
                        assets={assets}
                        changeToken={changeToken}
                        user={props.user}
                        userTrustedTokens={userTrustedTokens}
                        addUserTrustedToken={addUserTrustedToken}
                />

                <Activity activeTab={activeTab}
                          decimals={decimals}
                          tickers={tickers}
                          user={props.user}
                          setTransactionHistory={props.setTransactionHistory}
                          setTransactionRequest={props.setTransactionRequest}
                          setPublicKeyRequest={props.setPublicKeyRequest}
                          setSignRequest={props.setSignRequest}
                          getMainToken={getMainToken}
                          updateActivity={updateActivity}
                />

                <div
                    className={`${styles.bottom_list} ${styles.bottom_list_activity} ${activeTab === 2 ? '' : `${styles.bottom_list_disabled}`}`}>

                    {connectsElements.length === 0 &&
                        <div className={styles.title2}>{getText('not_connected')}</div>}

                    {connectsElements}

                    {favoriteSites.length > 0 && <div className={styles.favorites}>Favorites</div>}

                    <Separator/>

                    {favoriteSites}

                </div>

            </div>


        </div>
    )
}
