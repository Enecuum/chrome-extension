import React from "react";
import styles from "../index.module.css";
import {Transaction} from "./Transaction";

export default class Account extends React.Component {
    constructor(props) {
        super(props)
        this.state = {isSendTransaction: false, value: 0}
        this.setSendTransaction = this.setSendTransaction.bind(this)
        this.balance = this.balance.bind(this)
        console.log(this)

        this.balance()
    }

    setSendTransaction(value) {
        this.setState({isSendTransaction: value});
    }

    balance() {
        // console.log(this.props)
        ENQWeb.Enq.provider = this.props.user.net
        let token = ENQWeb.Enq.token[ENQWeb.Enq.provider]
        ENQWeb.Net.get.getBalance(this.props.user.publicKey, token).then(res => {
            this.setState({value: res.amount / 1e10})
            console.log(res.amount / 1e10)
        }).catch(err => {
            console.log(err)
        })

    }

    render() {

        if (this.state.isSendTransaction)
            return <Transaction setSend={this.setSendTransaction} value={this.state.value}
                                background={this.props.background} publicKey={this.props.user.publicKey}/>
        else
            return (
                <div className={styles.main}>

                    <div className={styles.header}>

                        <div className={styles.field + ' ' + styles.balance}>{this.state.value.toFixed(2)} ENQ</div>
                        <div className={styles.field + ' ' + styles.usd}>0.0 USD</div>
                        <div className={styles.field + ' ' + styles.address}>{this.props.user.publicKey}</div>
                        <div className={styles.field + ' ' + styles.copy}>COPY</div>

                    </div>

                    <div className={styles.form}>

                        <div onClick={() => {}} className={styles.field + ' ' + styles.button + ' ' + styles.disabled}>Transactions history</div>

                        <div onClick={() => this.setSendTransaction(true)}
                             className={styles.field + ' ' + styles.button}>Send transaction
                        </div>

                        <div onClick={this.props.logout}
                             className={styles.field + ' ' + styles.button + ' ' + styles.red}>Logout
                        </div>

                    </div>
                </div>
            )
    }
}