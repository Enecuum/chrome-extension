import React from "react";
import styles from "../../index.module.css";

export class TransactionRequest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            url: `${ENQWeb.Net.provider}/#!/tx/` + this.props.txHash
        }
    }

    copyHash() {
        navigator.clipboard.writeText(this.props.txHash)
    }

    confirm() {
    }

    reject() {
    }

    render() {

        return (
            <div className={styles.main}>

                <div className={styles.form}>

                    <div className={styles.field}>Amount: {this.state.amount}</div>
                    <div className={styles.field}>Data: {this.state.data}</div>
                    <div className={styles.field}>From: {this.state.from}</div>
                    <div className={styles.field}>Ticker: {this.state.ticker}</div>
                    <div className={styles.field}>To: {this.state.to}</div>
                    <div className={styles.field}>Nonce: {this.state.nonce}</div>

                    {/*<div className={styles.field}>Net: {this.state.net}</div>*/}

                    <div onClick={() => this.confirm()}
                         className={styles.field + ' ' + styles.button}>Confirm
                    </div>

                    <div onClick={() => this.reject()}
                         className={styles.field + ' ' + styles.button}>Reject
                    </div>

                </div>

                <div className={styles.form}>
                    <div onClick={() => this.props.setRequests(false)}
                         className={styles.field + ' ' + styles.button}>Back
                    </div>
                </div>
            </div>
        )
    }
}