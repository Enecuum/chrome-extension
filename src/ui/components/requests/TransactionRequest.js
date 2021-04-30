import React, { useState, useEffect } from 'react'
import styles from '../../css/index.module.css'
import Separator from '../../elements/Separator'
import elements from '../../css/elements.module.css'
import {shortAddress} from "../../Utils";

let fee = 0.1
const copyText = ('\n\nCopy address to clipboard').toUpperCase()

export default function TransactionRequest(props) {

    const [jsonFrom] = useState(JSON.stringify(props.request.tx.from))
    const [activeTab, setActiveTab] = useState(0)
    const [url, setUrl] = useState(`${ENQWeb.Net.provider}/#!/tx/` + props.txHash)
    const [data, setData] = useState(props.request.tx.data)
    const [from, setFrom] = useState(jsonFrom.pubkey?jsonFrom.pubkey.replaceAll('"',''):jsonFrom.replaceAll('"',''))
    const [ticker, setTicker] = useState(props.request.tx.tokenHash)
    const [to, setTo] = useState(props.request.tx.to)
    const [amount, setAmount] = useState(props.request.tx.value)
    const [nonce, setNonce] = useState(props.request.tx.nonce)
    const [taskId, setTaskId] = useState(props.request.cb.taskId)
    const [dataText, setDataText] = useState([])


    const copyHash = () => {
        navigator.clipboard.writeText(props.txHash)
    }

    const parseData = () => {
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
                    dataTextArray.push(<div key={key}>{key}: {field.parameters[key]}</div>)
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
        await global.asyncRequest({
            allow: true,
            taskId: taskId
        })
        props.setTransactionRequest(false)
        closeModalWindow()
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

    return (
        <div className={styles.main}>

            <div className={styles.transaction_network}>
                Network: {ENQWeb.Net.currentProvider.toUpperCase()}
            </div>

            <div className={styles.data}>

                <div className={styles.transaction_from_to}>

                    <div className={styles.transaction_address_copy} onClick={() => {
                        navigator.clipboard.writeText(from)
                    }} title={from + copyText}>{shortAddress(from)}</div>

                    <div>❯</div>

                    <div className={styles.transaction_address_copy} onClick={() => {
                        navigator.clipboard.writeText(to)
                    }} title={to + copyText}>{shortAddress(to)}</div>

                </div>

                <div className={styles.transaction_url}>{props.request.cb.url}</div>

                <div className={styles.transaction_type}>{ENQWeb.Utils.ofd.isContract(data) ? (ENQWeb.Utils.ofd.parse(data)).type.toUpperCase():'TOKEN TRANSFER'}</div>

                {/*SWAP TOKEN*/}

                {/*SWAP EXACT TOKENS FOR*/}

                {/*<div className={styles.field}>Ticker: {this.state.ticker}</div>*/}
                {/*<div className={styles.field}>Nonce: {this.state.nonce}</div>*/}
                {/*<div className={styles.field}>Data: {this.state.data}</div>*/}
                <div className={styles.transaction_amount}>{(amount / 1e10) - fee + ' ENQ'}</div>

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
            </div>

            <div
                className={styles.bottom_list + (activeTab === 0 ? '' : ` ${styles.bottom_list_disabled}`)}>

                <div className={styles.transaction_data_fee}>
                    <div>FEE</div>
                    <div>{fee + ' ENQ'}</div>
                </div>

                <div className={styles.transaction_data_amount}>
                    <div>TOTAL</div>
                    <div>{(amount / 1e10) + ' ENQ'}</div>
                </div>

            </div>

            <div className={`${styles.bottom_list} ${activeTab === 1 ? '' : `${styles.bottom_list_disabled}`}`}>

                <div className={styles.transaction_data_data}>{(props.request.tx.data ? dataText : 'No data')}</div>

            </div>

            <div className={styles.form}>

                {/*<div onClick={this.allow}*/}
                {/*     className={styles.field}>{this.state.website}*/}
                {/*</div>*/}

                <div onClick={reject}
                     className={styles.field + ' ' + styles.button}>Reject
                </div>

                <div onClick={confirm}
                     className={styles.field + ' ' + styles.button + ' ' + styles.button_blue}>Confirm
                </div>

                <Separator/>

            </div>
        </div>
    )
}
