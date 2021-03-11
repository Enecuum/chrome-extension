import React from "react";
import styles from "../index.module.css";
import Transaction from "./Transaction";
import Requests from "./Requests"
import Password from "./Password";
import Network from "./Network";

export default class Account extends React.Component {
    constructor(props) {
        super(props)
        this.state = {isTransaction: false, isRequests: false, isPassword: false, isNetwork: false, amount: 0, usd: 0, ticker: '', net: ENQWeb.Net.provider}
        this.setTransaction = this.setTransaction.bind(this)
        this.setRequests = this.setRequests.bind(this)
        this.setPassword = this.setPassword.bind(this)
        this.setNetwork = this.setNetwork.bind(this)
        this.setNet = this.setNet.bind(this)
        this.balance = this.balance.bind(this)
        this.copyPublicKey = this.copyPublicKey.bind(this)
        // console.log(this)

        this.balance()
    }

    setTransaction(value) {
        this.setState({isTransaction: value});
    }

    setRequests(value) {
        this.setState({isRequests: value})
    }

    setPassword(value) {
        this.setState({isPassword: value})
    }

    setNetwork(value) {
        this.setState({isNetwork: value})
    }

    setNet(value) {
        this.setState({net: value})
        ENQWeb.Net.provider = value
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
            this.setState({ticker: res.ticker})
            if (this.props.user.net === 'pulse') {
                ENQWeb.Enq.sendRequest('https://api.coingecko.com/api/v3/simple/price?ids=enq-enecuum&vs_currencies=USD')
                    .then(answer => {
                        if (answer['enq-enecuum'] !== undefined) {
                            let usd = answer['enq-enecuum'].usd * this.state.amount
                            this.setState({usd: usd})
                        }
                    })
            }
            console.log(res.amount / 1e10)
        }).catch(err => {
            console.log(err)
        })
    }

    render() {

        if (this.state.isRequests) {
            return <Requests setRequests={this.setRequests}/>
        }

        if (this.state.isTransaction) {
            return <Transaction setTransaction={this.setTransaction}
                                amount={this.state.amount}
                                publicKey={this.props.user.publicKey}/>
        }

        if (this.state.isPassword) {
            return <Password setPassword={this.setPassword}/>
        }

        if (this.state.isPassword) {
            return <Password setPassword={this.setPassword}/>
        }

        if (this.state.isNetwork) {
            return <Network setNetwork={this.setNetwork} setNet={this.setNet} net={this.state.net}/>
        }

        return (
            <div className={styles.main}>

                <div className={styles.header}>

                    <div
                        className={styles.field + ' ' + styles.balance}>{this.state.amount.toFixed(2)} {this.state.ticker}</div>
                    <div className={styles.field + ' ' + styles.usd}>{this.state.usd.toFixed(2)} USD</div>
                    <div className={styles.field + ' ' + styles.address}>{this.props.user.publicKey}</div>
                    <div className={styles.field + ' ' + styles.copy} onClick={() => this.copyPublicKey()}>COPY
                    </div>

                </div>

                <div className={styles.form}>

                    <div onClick={() => {
                        (disk.list.listOfTask().length > 0 ? this.setRequests(true) : null)
                    }}
                         className={styles.field + ' ' + styles.button + ' ' + (disk.list.listOfTask().length > 0 ? styles.green : styles.disabled)}>Requests
                    </div>

                    {/*<div onClick={() => {*/}
                    {/*}} className={styles.field + ' ' + styles.button + ' ' + styles.disabled}>Transactions history*/}
                    {/*</div>*/}

                    <div onClick={() => this.setTransaction(true)}
                         className={styles.field + ' ' + styles.button}>Send transaction
                    </div>

                    <div onClick={() => this.setPassword(true)}
                         className={styles.field + ' ' + styles.button}>Set password
                    </div>

                    <div onClick={() => this.setNetwork(true)}
                         className={styles.field + ' ' + styles.button}>Network: {this.state.net}
                    </div>

                    <div onClick={this.props.logout}
                         className={styles.field + ' ' + styles.button + ' ' + styles.red}>Logout
                    </div>

                </div>
            </div>
        )
    }
}