import React, {useState} from "react";
import styles from "../../css/index.module.css";
import Separator from "../../elements/Separator";
import elements from "../../css/elements.module.css";

let fee = 0.1
const copyText = ('\n\nCopy address to clipboard').toUpperCase()

export default class TransactionRequest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            url: `${ENQWeb.Net.provider}/#!/tx/` + this.props.txHash,
            amount: this.props.request.tx.value,
            data: JSON.stringify(this.props.request.tx.data),
            from: JSON.stringify(this.props.request.tx.from).replaceAll('"', ''),
            ticker: this.props.request.tx.tokenHash,
            to: this.props.request.tx.to,
            nonce: this.props.request.tx.nonce,
            activeTab: 0,
            taskId: this.props.request.cb.taskId,
        }

        // console.log(this.props.request)
        // console.log(this.props.taskId)

        this.confirm = this.confirm.bind(this)
        this.reject = this.reject.bind(this)
    }

    copyHash() {
        navigator.clipboard.writeText(this.props.txHash)
    }

    async confirm() {
        await global.asyncRequest({allow: true, taskId: this.state.taskId})
        this.props.setTransactionRequest(false)
    }

    async reject() {
        await global.asyncRequest({disallow: true, taskId: this.state.taskId})
        this.props.setTransactionRequest(false)
    }

    render() {

        return (
            <div className={styles.main}>

                <div className={styles.transaction_network}>
                    Network: {ENQWeb.Net.currentProvider.toUpperCase()}
                </div>

                <div className={styles.data}>

                    <div className={styles.transaction_from_to}>

                        <div className={styles.transaction_address_copy} onClick={() => {
                            navigator.clipboard.writeText(this.state.from)
                        }} title={this.state.from + copyText}>{shortAddress(this.state.from)}</div>

                        <div>❯</div>

                        <div className={styles.transaction_address_copy} onClick={() => {
                            navigator.clipboard.writeText(this.state.to)
                        }} title={this.state.to + copyText}>{shortAddress(this.state.to)}</div>

                    </div>

                    <div className={styles.transaction_url}>{this.props.request.cb.url}</div>

                    <div className={styles.transaction_type}>TOKEN TRANSFER</div>

                    {/*SWAP TOKEN*/}

                    {/*SWAP EXACT TOKENS FOR*/}

                    {/*<div className={styles.field}>Ticker: {this.state.ticker}</div>*/}
                    {/*<div className={styles.field}>Nonce: {this.state.nonce}</div>*/}
                    {/*<div className={styles.field}>Data: {this.state.data}</div>*/}
                    <div className={styles.transaction_amount}>{(this.state.amount / 1e10) - fee + ' ENQ'}</div>

                </div>

                <div className={styles.bottom_tabs + ' ' + styles.data_bottom_tabs}>
                    <div
                        onClick={() => this.setState({activeTab: 0})}
                        className={(this.state.activeTab === 0 ? ` ${styles.bottom_tab_active}` : '')}
                    >
                        Details
                    </div>
                    <div
                        onClick={() => this.setState({activeTab: 1})}
                        className={(this.state.activeTab === 1 ? ` ${styles.bottom_tab_active}` : '')}
                    >
                        Data
                    </div>
                </div>

                <div
                    className={styles.bottom_list + (this.state.activeTab === 0 ? '' : ` ${styles.bottom_list_disabled}`)}>

                    <div className={styles.transaction_data_fee}>
                        <div>FEE</div>
                        <div>{fee + ' ENQ'}</div>
                    </div>

                    <div className={styles.transaction_data_amount}>
                        <div>TOTAL</div>
                        <div>{(this.state.amount / 1e10) + ' ENQ'}</div>
                    </div>

                </div>

                <div
                    className={`${styles.bottom_list} ${this.state.activeTab === 1 ? '' : `${styles.bottom_list_disabled}`}`}>

                    <div
                        className={styles.transaction_data_data}>{(this.props.request.tx.data ? 'Data' : 'No data')}</div>

                </div>

                <div className={styles.form}>

                    {/*<div onClick={this.allow}*/}
                    {/*     className={styles.field}>{this.state.website}*/}
                    {/*</div>*/}

                    <div onClick={this.reject}
                         className={styles.field + ' ' + styles.button}>Reject
                    </div>

                    <div onClick={this.confirm}
                         className={styles.field + ' ' + styles.button + ' ' + styles.button_blue}>Confirm
                    </div>

                    <Separator/>

                </div>
            </div>
        )
    }
}

const shortAddress = (address) => {
    return address.substring(0, 5) + '...' + address.substring(address.length - 3, address.length - 1)
}