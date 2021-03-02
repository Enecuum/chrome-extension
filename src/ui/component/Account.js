import React from "react";
import styles from "../index.module.css";
import {Transaction} from "./Transaction";

export default class Account extends React.Component {
    constructor(props) {
        super(props)
        this.state = {isTransaction: false, amount: 0}
        this.setTransaction = this.setTransaction.bind(this)
        this.balance = this.balance.bind(this)
        this.copyPublicKey = this.copyPublicKey.bind(this)
        console.log(this)

        this.balance()
    }

    setTransaction(value) {
        this.setState({isTransaction: value});
    }

    copyPublicKey() {
        navigator.clipboard.writeText(this.props.user.publicKey)
    }

    balance() {
        // console.log(this.props)
        ENQWeb.Enq.provider = this.props.user.net
        let token = ENQWeb.Enq.token[ENQWeb.Enq.provider]
        console.log(token)
        ENQWeb.Net.get.getBalance(this.props.user.publicKey, token).then(res => {
            this.setState({amount: res.amount / 1e10})
            console.log(res.amount / 1e10)
        }).catch(err => {
            console.log(err)
        })
    }

    render() {

        if (this.state.isTransaction)
            return <Transaction setTransaction={this.setTransaction}
                                amount={this.state.amount}
                                publicKey={this.props.user.publicKey}/>
        else
            return (
                <div className={styles.main}>

                    <div className={styles.header}>

                        <div className={styles.field + ' ' + styles.balance}>{this.state.amount.toFixed(2)} ENQ</div>
                        <div className={styles.field + ' ' + styles.usd}>0.0 USD</div>
                        <div className={styles.field + ' ' + styles.address}>{this.props.user.publicKey}</div>
                        <div className={styles.field + ' ' + styles.copy} onClick={() => this.copyPublicKey()}>COPY</div>

                    </div>

                    <div className={styles.form}>

                        <div onClick={() => {}} className={styles.field + ' ' + styles.button + ' ' + styles.disabled}>Change network</div>

                        <div onClick={() => {}} className={styles.field + ' ' + styles.button + ' ' + styles.disabled}>Transactions history</div>

                        <div onClick={() => this.setTransaction(true)}
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