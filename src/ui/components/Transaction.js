import React from "react";
import styles from "../css/index.module.css";
import TransactionSend from "./TransactionSend";
import Separator from "../elements/Separator";

//TODO decimals to tokens

export default class Transaction extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isTransactionSend: false,
            decimals: 1e10,
            address: '',
            amount: 0.0,
            txHash: '',
            data: '',
            unlock: false,
            getLedgerTransport: this.props.getLedgerTransport,
            fee: Number(0.0)
        }
        this.handleChangeAddress = this.handleChangeAddress.bind(this)
        this.handleChangeAmount = this.handleChangeAmount.bind(this)
        this.handleChangeData = this.handleChangeData.bind(this)
        this.setTransactionSend = this.setTransactionSend.bind(this)
        this.submit = this.submit.bind(this)

        this.feeCount = this.feeCount.bind(this)
        this.decimalsSearch = this.decimalsSearch.bind(this)

        this.feeCount()
        this.decimalsSearch()
    }

    setTransactionSend(value) {
        this.setState({isTransactionSend: value})
    }

    handleChangeAddress(e) {
        this.setState({address: e.target.value});
    }

    handleChangeAmount(e) {
        // console.log(e.target.value)
        // console.log(typeof e.target.value)
        let amount = Number(e.target.value)
        if (amount.countDecimals() > 9)
            amount = amount.toFixed(10)

        this.setState({amount: amount});
        this.feeCount()
    }

    handleChangeData(e) {
        let data = e.target.value
        this.setState({data: data});
    }

    async submit() {

        //TODO
        let user = await disk.user.loadUser()
        // console.log(user)
        let wallet = {pubkey: user.publicKey, prvkey: user.privateKey}
        ENQWeb.Net.provider = user.net

        let data = {
            from: wallet,
            amount: Number(this.state.amount) * 1e10,
            to: this.state.address,
            data: '',
            tokenHash: user.token
        }

        // console.log(data)

        let response
        try {
            response = await ENQWeb.Net.post.tx_fee_off(data)
        } catch (e) {

        }

        if (response) {
            this.setState({
                txHash: response.hash
            })
        }

        this.setTransactionSend(true)
    }

    feeCount() {
        ENQweb3lib.fee_counter(this.props.isTransaction.token, BigInt(Math.floor(this.state.amount * 1e10))).then(fee => {
            console.log(typeof fee)
            console.log(fee)
            let currentFee = Number(fee) / this.state.decimals
            console.log(currentFee)
            this.setState({fee: currentFee})
        })
    }

    decimalsSearch() {
        ENQWeb.Net.get.token_info(this.props.isTransaction.token).then(info => {
            if (info.length === 0) {
                console.warn('Token not found.')
            } else {
                let decimals = 10 ** info[0].decimals
                this.setState({decimals: decimals})
            }
        })
    }

    render() {


        if (this.state.isTransactionSend) {

            return <TransactionSend setTransaction={this.props.setTransaction} txHash={this.state.txHash}/>

        } else {

            let balanceAfter = this.props.isTransaction.balance ?

                (
                    Number(
                        this.props.isTransaction.balance
                        - BigInt(Math.floor(this.state.amount * this.state.decimals))
                        - BigInt(Math.floor(this.state.fee * this.state.decimals))
                    )
                    / this.state.decimals
                ).toFixed(4)

                : "0.0"

            balanceAfter += this.props.isTransaction.ticker ? this.props.isTransaction.ticker : "COIN"

            return (
                <div className={styles.main}>

                    <div className={styles.content}>

                        <input type="text"
                               spellCheck={false}
                               onChange={this.handleChangeAddress}
                               value={this.state.address}
                               className={styles.field}
                               placeholder={'Address'}
                        />

                        <input type="number"
                               onChange={this.handleChangeAmount}
                               value={this.state.amount}
                               className={styles.field}
                               placeholder={'Amount'}
                        />

                        <div
                            className={styles.field_ticker}>{this.props.isTransaction.ticker ? this.props.isTransaction.ticker : "COIN"}</div>

                        <input type="text"
                               onChange={this.handleChangeData}
                               value={this.state.data}
                               className={styles.field}
                               placeholder={'Data'}
                        />

                    </div>


                    <div>

                        <div className={styles.field}>
                            Network: {ENQWeb.Net.currentProvider.toUpperCase()}
                        </div>

                        <div className={styles.field}>
                            Fee: {this.state.fee + ' ' + (this.props.isTransaction.ticker ? this.props.isTransaction.ticker : "COIN")}
                        </div>

                        <div className={styles.field}>
                            Balance after: {balanceAfter}
                        </div>

                    </div>

                    <div className={styles.form}>

                        <div onClick={this.submit}
                             className={styles.field + ' ' + styles.button + ' ' + styles.button_blue}>Send
                        </div>

                        <div onClick={() => this.props.setTransaction(false)}
                             className={styles.field + ' ' + styles.button + ' ' + styles.button_blue}>Back
                        </div>

                        <Separator/>

                    </div>
                </div>
            )
        }
    }
}

String.prototype.hexEncode = function () {
    let hex, i;
    let result = "";
    for (i = 0; i < this.length; i++) {
        hex = this.charCodeAt(i).toString(16);
        result += ("000" + hex).slice(-4);
    }
    return result
}

Number.prototype.countDecimals = function () {
    if (Math.floor(this.valueOf()) === this.valueOf()) return 0;
    return this.toString().split(".")[1].length || 0;
}
