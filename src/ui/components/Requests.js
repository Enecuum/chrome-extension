import React from "react";
import styles from "../index.module.css";
import PublicKeyRequests from "./requests/PublicKeyRequest";
import TransactionRequest from "./requests/TransactionRequest";

let names = {
    enable: 'Share account address',
    tx: 'Sign transaction'
}

export default class Requests extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            requests: disk.task.loadTask(),
            publicKeyRequest: null,
            transactionRequest: null
        }

        this.back = this.back.bind(this)
    }

    back() {
        this.setState({
            publicKeyRequest: null,
            transactionRequest: null
        })
    }

    rejectAll() {
    }

    render() {

        if (this.state.publicKeyRequest) {
            return <PublicKeyRequests back={this.back} request={this.state.publicKeyRequest}/>
        }

        if (this.state.transactionRequest) {
            return <TransactionRequest back={this.back} request={this.state.transactionRequest}/>
        }

        const items = []

        for (const key of Object.keys(this.state.requests)) {
            let item = this.state.requests[key]
            items.push(
                <div key={key} onClick={() => {

                    if (item.type === 'enable')
                        this.setState({publicKeyRequest: item})
                    else
                        this.setState({transactionRequest: item})

                }} className={styles.field + ' ' + styles.button}>
                    {names[item.type]}
                </div>
            )
        }

        return (
            <div className={styles.main}>

                <div className={styles.header}>

                    <div className={styles.field + ' ' + styles.text}>List of requests</div>

                    {items}

                    <div onClick={() => this.rejectAll()}
                         className={styles.field + ' ' + styles.button}>Reject all
                    </div>

                </div>

                <div className={styles.form}>
                    <div onClick={() => {
                        this.props.setRequests(false)
                    }}
                         className={styles.field + ' ' + styles.button}>Back
                    </div>
                </div>


            </div>
        )
    }
}
