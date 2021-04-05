import React from "react";
import styles from "../../css/index.module.css";
import Separator from "../../elements/Separator";

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
        }

        console.log(this.props.request)
        console.log(this.props.taskId)
    }

    copyHash() {
        navigator.clipboard.writeText(this.props.txHash)
    }

    async confirm() {
        await global.asyncRequest({allow: true, taskId: this.props.taskId})
        this.props.back()
    }

    async reject() {
        await global.asyncRequest({disallow: true, taskId: this.props.taskId})
        this.props.back()
    }

    render() {

        return (
            <div className={styles.main}>

                <div className={styles.data}>

                    <div className={styles.field}>From: {this.state.from}</div>
                    <div className={styles.field}>To: {this.state.to}</div>
                    <div className={styles.field}>Amount: {this.state.amount}</div>
                    <div className={styles.field}>Ticker: {this.state.ticker}</div>
                    <div className={styles.field}>Nonce: {this.state.nonce}</div>
                    <div className={styles.field}>Data: {this.state.data}</div>

                </div>

                <div className={styles.form}>

                    {/*<div onClick={this.allow}*/}
                    {/*     className={styles.field}>{this.state.website}*/}
                    {/*</div>*/}

                    <div onClick={this.reject}
                         className={styles.field + ' ' + styles.button}>Reject
                    </div>

                    <div className={styles.buttons_field}>

                        <div onClick={() => this.props.setTransactionRequest(false)}
                             className={styles.field + ' ' + styles.button}>Back
                        </div>

                        <div onClick={this.confirm}
                             className={styles.field + ' ' + styles.button + ' ' + styles.button_blue}>Confirm
                        </div>

                    </div>

                    <Separator />

                </div>
            </div>
        )
    }
}