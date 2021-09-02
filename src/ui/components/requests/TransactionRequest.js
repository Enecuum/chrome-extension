import React, {useState, useEffect} from 'react'
import styles from '../../css/index.module.css'
import Separator from '../../elements/Separator'
import elements from '../../css/elements.module.css'
import {shortHash} from '../../Utils'

// let fee = BigInt(0.1 * 1e10)
const copyText = ('\n\nCopy address to clipboard').toUpperCase()

export default function TransactionRequest(props) {

    console.log(props.request.tx)
    ENQWeb.Enq.provider = props.user.net;

    const [jsonFrom] = useState(props.request.tx.from)
    const [activeTab, setActiveTab] = useState(0)
    const [url, setUrl] = useState(`${ENQWeb.Net.provider}/#!/tx/` + props.txHash)
    const [data, setData] = useState(props.request.tx.data)
    const [from, setFrom] = useState(jsonFrom.pubkey ? jsonFrom.pubkey.replaceAll('"', '') : jsonFrom.replaceAll('"', ''))

    //TODO
    const [ticker, setTicker] = useState('BIT')
    const [to, setTo] = useState(props.request.tx.to)
    const [amount, setAmount] = useState(props.request.tx.value ? BigInt(props.request.tx.value) : BigInt(props.request.tx.amount))
    const [nonce, setNonce] = useState(props.request.tx.nonce)
    const [taskId, setTaskId] = useState(props.request.cb.taskId)
    const [dataText, setDataText] = useState([])
    const [fee, setFee] = useState(BigInt(0.1 * 1e10))
    const [Type, setType] = useState("undefined".toUpperCase())
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

    const initTickerAndFee = async () => {
        let tokenHash = props.request.tx.ticker ? props.request.tx.ticker : props.request.tx.tokenHash
        let tokenInfo = await ENQWeb.Net.get.token_info(tokenHash)
        if (tokenInfo.length === 0) {
            console.warn('token info error...')
        } else {
            setTicker(tokenInfo[0].ticker)
            if (props.request.data.fee_use !== false) {
                let originAmount = amount - BigInt(props.request.data.fee_value)
                setFee(BigInt(await ENQWeb.Web.fee_counter(tokenHash, originAmount)))
            } else {
                setFee(BigInt(await ENQWeb.Web.fee_counter(tokenHash, amount)))
            }
        }
    }

    const dataParse = (field) => {
        return new Promise((resolve, reject) => {
            let dataParser = new Worker("./js/workerDataParse.js",)
            let timer
            dataParser.onmessage = (msg) => {
                clearTimeout(timer)
                dataParser.terminate()
                resolve(msg)
            }
            dataParser.onerror = err => {
                console.warn(err);
                reject(err)
            }
            dataParser.postMessage(field)
            timer = setTimeout(() => {
                dataParser.terminate();
                reject("timeout")
            }, 2000)
        })
    }

    global.testing = dataParse

    const parseData = () => {
        initTickerAndFee().then()
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
                            for (let key in field.parameters) {
                                // console.log(key, field.parameters[key]);
                                dataTextArray.push(<div key={key}>{key}: {field.parameters[key].toString()}</div>)
                            }
                        }
                    }
                })
                .catch(err => {
                    console.warn(err)
                    setType("invalid data field".toUpperCase())
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
            await global.asyncRequest({
                allow: true,
                taskId: taskId
            })
            props.setTransactionRequest(false)
            closeModalWindow()
        } else {
            console.warn("bad data")
        }
    }

    const reject = async () => {
        await global.asyncRequest({
            disallow: true,
            taskId: taskId
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

            <div className={styles.transaction_history_back} onClick={() => props.setTransactionRequest(false)}>❮ Back
            </div>

            <div className={styles.transaction_network}>
                Network: {ENQWeb.Net.currentProvider.toUpperCase()}
            </div>

            <div className={styles.data}>

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
                        Type.toUpperCase().replaceAll('_', ' ') :
                        'TOKEN TRANSFER'
                }</div>

                {/*SWAP TOKEN*/}

                {/*SWAP EXACT TOKENS FOR*/}

                {/*<div className={styles.field}>Ticker: {this.state.ticker}</div>*/}
                {/*<div className={styles.field}>Nonce: {this.state.nonce}</div>*/}
                {/*<div className={styles.field}>Data: {this.state.data}</div>*/}
                <div className={styles.transaction_amount}>{Number(amount - fee) / 1e10 + ' ' + ticker}</div>

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
                    <div>{Number(fee) / 1e10 + ' ' + ticker}</div>
                </div>

                <div className={styles.transaction_data_amount}>
                    <div>TOTAL</div>
                    <div>{(Number(amount) / 1e10) + ' ' + ticker}</div>
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
