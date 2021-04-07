import React, {useState} from "react";
import styles from "../../css/index.module.css";
import Separator from "../../elements/Separator";

let fee = 0.1

export default class TransactionRequest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            url: `${ENQWeb.Net.provider}/#!/tx/` + this.props.txHash,
            amount: this.props.request.data.value,
            data: JSON.stringify(this.props.request.data.data),
            from: JSON.stringify(this.props.request.data.from),
            ticker: this.props.request.data.tokenHash,
            to: this.props.request.data.to,
            nonce: this.props.request.data.nonce,
            activeTab: 0,
            taskId: this.props.request.cb.taskId,
        }

        console.log(this.props.request)
        console.log(this.props.taskId)

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

                        <div>{shortAddress(this.state.from.replaceAll('"', ''))}</div>

                        <div>❯</div>

                        <div>{shortAddress(this.state.to)}</div>

                    </div>

                    <div className={styles.transaction_url}>{this.props.request.cb.url}</div>

                    <div className={styles.transaction_type}>SWAP EXACT TOKENS FOR TOKEN</div>

                    {/*<div className={styles.field}>Ticker: {this.state.ticker}</div>*/}
                    {/*<div className={styles.field}>Nonce: {this.state.nonce}</div>*/}
                    {/*<div className={styles.field}>Data: {this.state.data}</div>*/}
                    <div className={styles.transaction_amount}>{(this.state.amount / 1e10) + ' ENQ'}</div>

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
                        <div>{(this.state.amount / 1e10) + fee + ' ENQ'}</div>
                    </div>

                </div>

                <div
                    className={`${styles.bottom_list} ${this.state.activeTab === 1 ? '' : `${styles.bottom_list_disabled}`}`}>

                    <div className={styles.transaction_data_data}>{(this.props.request.data.data ? 'Data' : 'No data')}</div>

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