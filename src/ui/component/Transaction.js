import React from "react";
import styles from "../index.module.css";
import {TransactionSend} from "./TransactionSend";

export class Transaction extends React.Component {
    constructor(props) {
        super(props)
        console.log(this.props)
        this.state = {
            isTransactionSend: false,
            value: props.value,
            left: props.value,
            address: '',
            amount: '',
        }
        this.background = props.background
        this.handleChangeAddress = this.handleChangeAddress.bind(this)
        this.handleChangeAmount = this.handleChangeAmount.bind(this)
        this.setCheckTransaction = this.setCheckTransaction.bind(this)
        this.submit = this.submit.bind(this)
    }

    setCheckTransaction(value) {
        this.setState({isCheckTransaction: value})
    }

    handleChangeAddress(e) {
        this.setState({address: e.target.value});
        this.state.address = e.target.value
    }

    handleChangeAmount(e) {

        let left = this.state.value - e.target.value - 0.1
        let amount = e.target.value

        if (this.state.value - amount < 0) {
            console.log('BIG')
            amount = e.target.value
            left = 0.00
        }

        this.setState({
            amount: amount,
            left: left,
        });
        this.state.amount = amount
        console.log(this.state.value - e.target.value)
    }

    submit() {
        // console.log(this.state.amount, this.state.address)
        // let data = {
        //     amount: Number(this.state.amount),
        //     to: this.state.address
        // }
        // this.props.background.postMessage({popup: true, type: 'tx', data: data})

        let data = {
            amount: Number(this.props.amount),
            to: this.props.address
        }
        this.props.background.postMessage({popup: true, type: 'tx', data: data})
        this.setCheckTransaction(true)
        console.log('tx btn')
    }

    render() {
        if (this.state.isCheckTransaction) {
            return <TransactionSend background={this.props.background}
                                    setCheckTransaction={this.setCheckTransaction}
                                    address={this.state.address} amount={this.state.amount}
                                    myAddress={this.props.publicKey}/>
        } else {
            return (
                <div className={styles.main}>

                    <div className={styles.form}>

                        <input type="text"
                               onChange={this.handleChangeAddress}
                               value={this.state.address}
                               className={styles.field}
                               placeholder={'Address'}
                        />

                        <input type="text"
                               onChange={this.handleChangeAmount}
                               value={this.state.amount}
                               className={styles.field}
                               placeholder={'Amount'}
                        />

                        <div onClick={this.submit}
                             className={styles.field + ' ' + styles.button}>Send
                        </div>

                    </div>

                    {/*<div className={styles.header}>*/}

                    {/*    <div className={styles.field}>{this.state.left.toFixed(2)} ENQ left</div>*/}
                    {/*    <div className={styles.field + ' ' + styles.usd}>0.1 ENQ fee</div>*/}

                    {/*</div>*/}

                    <div className={styles.form}>

                        <div onClick={() => this.props.setSend(false)}
                             className={styles.field + ' ' + styles.button}>&laquo; Back
                        </div>

                    </div>
                </div>
            )
        }
    }
}