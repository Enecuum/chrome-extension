import React, {useState, useEffect} from 'react'
import styles from '../../css/index.module.css'
import Separator from '../../elements/Separator'
import elements from '../../css/elements.module.css'
import {shortHash} from '../../Utils'
import {apiController} from '../../../utils/apiController'
import Back from "../../elements/Back";
import {msg} from '@babel/core/lib/config/validation/option-assertions'

// let fee = BigInt(0.1 * 1e10)
const copyText = ('\n\nCopy address to clipboard').toUpperCase()

export default function TransactionRequest(props) {

    // console.log(props.request.tx)
    ENQWeb.Enq.provider = props.user.net

    const [jsonFrom] = useState(props.request.tx.from)
    const [activeTab, setActiveTab] = useState(0)
    const [url, setUrl] = useState(`${ENQWeb.Net.provider}/#!/tx/` + props.txHash)
    const [data, setData] = useState(props.request.tx.data)
    const [from, setFrom] = useState(jsonFrom.pubkey ? jsonFrom.pubkey.replaceAll('"', '') : jsonFrom.replaceAll('"', ''))

    //TODO
    const [ticker, setTicker] = useState('BIT')
    const [feeTicker, setFeeTicker] = useState(ticker)
    const [decimals, setDecimals] = useState(1e10)
    const [feeDecimals, setFeeDecimals] = useState(1e10)
    const [to, setTo] = useState(props.request.tx.to)
    const [amount, setAmount] = useState(props.request.tx.value ? BigInt(props.request.tx.value) : BigInt(props.request.tx.amount))
    const [nonce, setNonce] = useState(props.request.tx.nonce)
    const [taskId, setTaskId] = useState(props.request.cb.taskId)
    const [dataText, setDataText] = useState([])
    const [fee, setFee] = useState(BigInt(0.1 * 1e10))
    const [type, setType] = useState('undefined'.toUpperCase())
    const [isBlock, setBlock] = useState(true)


    // token transfer (data не парсится)
    // create token
    // delegate
    // undelegate
    // create pos
    // pos reward -> claim reward
    // transfer
    // mint
    // burn
    // create pool
    // add liquidity
    // remove liqudity
    // swap

    const copyHash = () => {
        navigator.clipboard.writeText(props.txHash)
    }


    const decimalsSearch = (tokenInfo) => {
        let decimals = 10 ** tokenInfo[0].decimals
        setDecimals(decimals)
    }
    const feeDecimalsSearch = (tokenInfo) => {
        let feeDecimals = 10 ** tokenInfo[0].decimals
        setFeeDecimals(feeDecimals)
    }
    const initTickerAndFee = async () => {
        let tokenHash = props.request.tx.ticker ? props.request.tx.ticker : props.request.tx.tokenHash
        let tokenInfo = await apiController.getTokenInfo(tokenHash)
        decimalsSearch(tokenInfo)
        console.log({tokenInfo, tokenHash})
        if (tokenInfo.length === 0) {
            console.warn('token info error...')
        } else {
            setTicker(tokenInfo[0].ticker)
            // RN-117
            setFeeTicker(tokenInfo[0].ticker)
            if (tokenInfo[0]['fee_type'] === 2) {
                let mainToken = await apiController.getTokenInfo(ENQWeb.Enq.ticker)
                feeDecimalsSearch(mainToken)
                setFee(BigInt(tokenInfo[0]['fee_value']))
                setFeeTicker(mainToken[0]['ticker'])
            } else {
                if (props.request.data.fee_use !== false) {
                    let originAmount = amount - BigInt(props.request.data.fee_value)
                    setFee(BigInt(await ENQWeb.Web.fee_counter(tokenHash, originAmount)))
                } else {
                    setFee(BigInt(await ENQWeb.Web.fee_counter(tokenHash, amount)))
                }
            }

        }
        console.log({decimals, feeDecimals})
    }

    const dataParse = (field) => {
        return new Promise((resolve, reject) => {
            let dataParser = new Worker('./js/workerDataParse.js',)
            let timer
            dataParser.onmessage = (msg) => {
                clearTimeout(timer)
                dataParser.terminate()
                resolve(msg)
            }
            dataParser.onerror = err => {
                console.warn(err)
                reject(err)
            }
            dataParser.postMessage(field)
            timer = setTimeout(() => {
                dataParser.terminate()
                reject('timeout')
            }, 2000)
        })
    }

    global.testing = dataParse

    const parseData = () => {
        initTickerAndFee()
            .then()
        let dataTextArray = []
        let field = data
        if (ENQWeb.Utils.ofd.isContract(field)) {
            dataParse(field)
                .then(data => {
                    data = JSON.parse(data.data)
                    if (data.parsed) {
                        setBlock(false)
                        field = ENQWeb.Utils.ofd.parse(field)

                        if (field.type) {
                            dataTextArray.push(<div key={'type'}>{field.type}</div>)
                            setType(field.type)
                        }
                        if (field.parameters) {
                            let map = Object.keys(field.parameters)
                            if(map.includes("compressed_data")){
                                field.parameters["compressed_data"] = JSON.stringify(ENQWeb.Utils.ofd.parseCompressData(field.parameters["compressed_data"]))
                            }
                            for (let key in field.parameters) {
                                // console.log(key, field.parameters[key]);
                                if(key !== "compressed_data"){
                                    dataTextArray.push(<div key={key}>{key}: {field.parameters[key].toString()}</div>)
                                }
                            }
                            if(map.includes("compressed_data")){
                                let compress = JSON.parse(field.parameters["compressed_data"])
                                for(let key in compress){
                                    dataTextArray.push(<div key={key}>{key}: {compress[key].toString()}</div>)
                                }
                            }
                        }
                    }
                })
                .catch(err => {
                    console.warn(err)
                    setType('invalid data field'.toUpperCase())
                })

        } else {
            setBlock(false)
            dataTextArray.push(field)
        }

        setDataText(dataTextArray)
    }


    const closeModalWindow = () => {
        let params = getUrlVars()
        if (params.type === 'tx') {
            window.close()
        }
    }

    const confirm = async () => {
        if (!isBlock) {
            try {
                setBlock(true)
                await asyncRequest({
                    allow: true,
                    taskId: taskId
                })
                    .then(answer => {
                        try {
                            bufferForMsg = answer.data.data
                        } catch (e) {
                            console.error(e)
                        }
                        if (answer.data.status === 'reject') {
                            setBlock(false)
                        } else {
                            props.setTransactionRequest(false)
                            closeModalWindow()
                        }
                    })

            } catch (err) {
                setBlock(false)
            }

        } else {
            console.warn('bad data')
        }
    }

    const reject = async () => {
        await asyncRequest({
            disallow: true,
            taskId: taskId
        }).then(data => {
            try {
                bufferForMsg = data.data.data
            } catch (e) {

            }
        })
        props.setTransactionRequest(false)
        closeModalWindow()
    }

    useEffect(() => {
        parseData()
    }, [])

    // console.log(amount)
    // console.log((amount / 1e10))
    // console.log(amount - fee * 1e10)

    return (
        <div className={styles.main}>

            <Back setFalse={() => props.setTransactionRequest(false)}/>

            <div className={styles.transaction_network}>
                Network: {ENQWeb.Net.currentProvider.toUpperCase()}
            </div>

            <div className={styles.card}>

                <div className={styles.transaction_from_to}>

                    <div className={styles.transaction_address_copy} onClick={() => {
                        navigator.clipboard.writeText(from)
                    }} title={from + copyText}>{shortHash(from)}</div>

                    <div>❯</div>

                    <div className={styles.transaction_address_copy} onClick={() => {
                        navigator.clipboard.writeText(to)
                    }} title={to + copyText}>{shortHash(to)}</div>

                </div>

                <div className={styles.transaction_url}>{props.request.cb.url}</div>

                <div
                    className={styles.transaction_type}>{
                    ENQWeb.Utils.ofd.isContract(data) ?
                        type.toUpperCase()
                            .replaceAll('_', ' ') :
                        'TOKEN TRANSFER'
                }</div>

                {/*SWAP TOKEN*/}

                {/*SWAP EXACT TOKENS FOR*/}

                {/*<div className={styles.field}>Ticker: {this.state.ticker}</div>*/}
                {/*<div className={styles.field}>Nonce: {this.state.nonce}</div>*/}
                {/*<div className={styles.field}>Data: {this.state.data}</div>*/}
                <div className={styles.transaction_amount}>{ticker === feeTicker ? Number(amount - fee) / decimals + ' ' + ticker : Number(amount) / decimals + ' ' + ticker}</div>

            </div>

            <div className={styles.bottom_tabs + ' ' + styles.data_bottom_tabs}>
                <div
                    onClick={() => setActiveTab(0)}
                    className={(activeTab === 0 ? ` ${styles.bottom_tab_active}` : '')}
                >
                    Details
                </div>
                <div
                    onClick={() => setActiveTab(1)}
                    className={(activeTab === 1 ? ` ${styles.bottom_tab_active}` : '')}
                >
                    Data
                </div>
                <div
                    onClick={() => setActiveTab(2)}
                    className={(activeTab === 2 ? ` ${styles.bottom_tab_active}` : '')}
                >
                    Raw
                </div>
            </div>

            <div
                className={styles.bottom_list + (activeTab === 0 ? '' : ` ${styles.bottom_list_disabled}`)}>

                <div className={styles.transaction_data_fee}>
                    <div>FEE</div>
                    <div>{Number(fee) / feeDecimals + ' ' + feeTicker}</div>
                </div>

                <div className={styles.transaction_data_amount}>
                    <div>TOTAL</div>
                    <div>{(Number(amount) / decimals) + ' ' + ticker + (ticker !== feeTicker ?
                        ' + ' + Number(fee) / feeDecimals + ' ' + feeTicker : '')}</div>
                </div>


            </div>

            <div className={`${styles.bottom_list} ${activeTab === 1 ? '' : `${styles.bottom_list_disabled}`}`}>

                <div className={styles.transaction_data_data}>{(props.request.tx.data ? dataText : 'No data')}</div>

            </div>

            <div className={`${styles.bottom_list} ${activeTab === 2 ? '' : `${styles.bottom_list_disabled}`}`}>

                <div className={styles.transaction_data_data}>{props.request.tx.data}</div>

            </div>

            {activeTab === 0 && <div className={styles.form}>

                {/*<div onClick={this.allow}*/}
                {/*     className={styles.field}>{this.state.website}*/}
                {/*</div>*/}

                <div onClick={reject}
                     className={styles.field + ' ' + styles.button}>Reject
                </div>

                <div onClick={confirm}
                     className={styles.field + ' ' + styles.button + ' ' + (isBlock ? styles.button_disabled : styles.button_blue)}>Confirm
                </div>

                <Separator/>

            </div>}
        </div>
    )
}
