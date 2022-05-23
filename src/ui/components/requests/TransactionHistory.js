import React, {useState, useEffect} from 'react'
import styles from '../../css/index.module.css'
import Separator from '../../elements/Separator'
import elements from '../../css/elements.module.css'
import {explorerTX, shortHash} from '../../Utils'
import { apiController } from '../../../utils/apiController'
import { ENQ_CONTENT } from '../../../utils/names'
import Back from "../../elements/Back";

// let fee = BigInt(0.1 * 1e10)
const copyText = ('\n\nCopy address to clipboard').toUpperCase()

export default function TransactionHistory(props) {

    console.log(props.request.tx)

    // const [jsonFrom] = useState(props.request.tx.from)
    const [activeTab, setActiveTab] = useState(0)
    const [url, setUrl] = useState(`${ENQWeb.Net.provider}/#!/tx/` + props.txHash)
    const [data, setData] = useState(props.request.tx.data)

    //TODO
    const [ticker, setTicker] = useState('BIT')
    const [feeTicker, setFeeTicker] = useState('BIT')

    const [to, setTo] = useState(props.request.tx.to)
    const [from, setFrom] = useState(props.request.tx.from.pubkey)

    const [amount, setAmount] = useState(BigInt(props.request.tx.value))
    const [nonce, setNonce] = useState(props.request.tx.nonce)
    const [taskId, setTaskId] = useState(props.request.cb.taskId)
    const [dataText, setDataText] = useState([])
    const [fee, setFee] = useState(BigInt(0.1 * 1e10))
    let mainToken
    const [feeDecimal, setFeeDecimal] = useState(1e10)

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

    let typeIn = props.request.rectype === 'iin'

    console.log(props)

    const copyHash = () => {
        navigator.clipboard.writeText(props.txHash)
    }

    const initTickerAndFee = async () => {
        // let tokenHash = props.request.tx.tokenHash
        // let tokenInfo = await apiController.getTokenInfo(tokenHash)
        // if (tokenInfo.length === 0) {
        //     console.warn('Token info error')
        // } else {
        //     setTicker(tokenInfo[0].ticker)
        // }
        setTicker(props.request.data.ticker || props.request.tx.ticker)
        if( props.request.data.fee_type !== 2 )
            setFeeTicker(props.request.data.ticker || props.request.tx.ticker || 'COIN')

        else{
            if(!props.request.tx.feeTicker && !props.request.tx.feeDecimals){
                mainToken = (await apiController.getTokenInfo(ENQWeb.Enq.ticker))[0]
                setFeeDecimal(10 ** mainToken.decimals)
            }
            setFeeTicker(props.request.data.feeTicker || mainToken.ticker)
        }
        setFee(BigInt((typeIn ? 1 : -1) * props.request.tx.fee_value))
    }

    const parseData = () => {
        initTickerAndFee().then()
        let dataTextArray = []
        let field = data
        if (ENQWeb.Utils.ofd.isContract(field)) {

            field = ENQWeb.Utils.ofd.parse(field)

            if (field.type) {
                dataTextArray.push(<div key={'type'}>{field.type}</div>)
            }
            if (field.parameters) {
                for (let key in field.parameters) {
                    // console.log(key, field.parameters[key]);
                    dataTextArray.push(<div key={key}>{key}: {field.parameters[key].toString()}</div>)
                }
            }
        } else {
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
        await asyncRequest({
            allow: true,
            taskId: taskId
        })
        props.setTransactionRequest(false)
        closeModalWindow()
    }

    const reject = async () => {
        await asyncRequest({
            disallow: true,
            taskId: taskId
        })
        props.setTransactionRequest(false)
        closeModalWindow()
    }

    const copyHashString = () => {
        navigator.clipboard.writeText(props.request.tx.hash)
    }

    const getTransaction = async () => {
        let transaction = await apiController.getTransaction(props.request.tx.hash)

        if (typeIn)
            setFrom(transaction.from)
        else
            setTo(transaction.to)

        // console.log(transaction)
    }

    useEffect(() => {
        parseData()
        getTransaction().then()
    }, [])

    // console.log(amount)
    // console.log((amount / 1e10))
    // console.log(amount - fee * 1e10)

    // console.log(props.request.rectype)

    // console.log(typeIn)

    return (
        <div className={styles.main}>

            <Back setFalse={() => props.setTransactionHistory(false)}/>


            <div className={styles.transaction_network}>
                Network: {ENQWeb.Net.currentProvider.replace('https://', '').toUpperCase()}
            </div>

            <div className={styles.card}>

                <div className={styles.transaction_from_to}>

                    <div className={styles.transaction_address_copy} onClick={() => {
                        navigator.clipboard.writeText(typeIn ? to : from)
                    }} title={from + copyText}>{shortHash(typeIn ? to : from)}</div>

                    <div>{typeIn ? '❮' : '❯'}</div>

                    <div className={styles.transaction_address_copy} onClick={() => {
                        navigator.clipboard.writeText(typeIn ? from : to)
                    }} title={to + copyText}>{shortHash(typeIn ? from : to)}</div>

                </div>

                <div className={styles.transaction_url}>{props.request.cb.url}</div>

                <div
                    className={styles.transaction_type}>{
                    ENQWeb.Utils.ofd.isContract(data) ?
                        (ENQWeb.Utils.ofd.parse(data)).type.toUpperCase().replaceAll('_', ' ') :
                        'TOKEN TRANSFER'
                }</div>

                {/*SWAP TOKEN*/}

                {/*SWAP EXACT TOKENS FOR*/}

                {/*<div className={styles.field}>Ticker: {this.state.ticker}</div>*/}
                {/*<div className={styles.field}>Nonce: {this.state.nonce}</div>*/}
                {/*<div className={styles.field}>Data: {this.state.data}</div>*/}
                <div className={styles.transaction_amount}>{props.request.data.fee_type !== 2 ? Number(amount - fee) / props.request.data.decimals + ' ' + ticker : Number(amount) / props.request.data.decimals + ' ' + ticker}</div>

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
                    <div>{Number(fee) / (props.request.data.feeDecimals || feeDecimal) + ' ' + feeTicker}</div>
                </div>

                <div className={styles.transaction_data_amount}>
                    <div>TOTAL</div>
                    <div>{(Number(amount) / props.request.data.decimals) + ' ' + ticker + (props.request.data.fee_type !== 2 ? '' : ' ' + ((typeIn ? '- ' : '')) + Number(fee) / (props.request.data.feeDecimals || feeDecimal) + ' ' + feeTicker)}</div>
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

                <div onClick={() => {explorerTX(props.request.tx.hash)}}
                                         className={styles.field + ' ' + styles.button + ' ' + styles.button_link}>
                    Open in explorer
                </div>

                <div onClick={copyHashString}
                     className={styles.field + ' ' + styles.button}>Copy transaction hash
                </div>

                <Separator/>

            </div>}
        </div>
    )
}
