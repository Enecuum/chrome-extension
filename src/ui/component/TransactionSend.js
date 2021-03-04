import React from "react";
import styles from "../index.module.css";

export class TransactionSend extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            url: `${ENQWeb.Net.provider}/#!/tx/` + this.props.txHash
        }
    }

    copyHash() {
        navigator.clipboard.writeText(this.props.txHash)
    }

    render() {
        console.log(`${ENQWeb.Net.provider}/#!/tx/`)
        return (
            <div className={styles.main}>

                <div className={styles.form}>
                    <div className={styles.field}><a href={this.state.url} target="_blank">{this.props.txHash}</a></div>
                    <div className={styles.field + ' ' + styles.copy + ' ' + styles.header}
                         onClick={() => this.copyHash()}>COPY
                    </div>

                    <div className={styles.field}>From: {this.state.from}</div>
                    <div className={styles.field}>To: {this.state.to}</div>
                    <div className={styles.field}>Amount: {this.state.amount}</div>
                    <div className={styles.field}>Date: {this.state.date}</div>
                    <div className={styles.field}>Net: {this.state.net}</div>

                </div>

                <div className={styles.form}>
                    <div onClick={() => this.props.setTransaction(false)}
                         className={styles.field + ' ' + styles.button}>Back
                    </div>
                </div>
            </div>
        )
    }
}