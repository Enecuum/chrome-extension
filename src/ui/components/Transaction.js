import React from "react";
import styles from "../css/index.module.css";
import TransactionSend from "./TransactionSend";
import Separator from "../elements/Separator";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import Eth from "@ledgerhq/hw-app-eth";

export default class Transaction extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isTransactionSend: false,
            address: '',
            amount: '',
            txHash: '',
            data: ''
        }
        this.handleChangeAddress = this.handleChangeAddress.bind(this)
        this.handleChangeAmount = this.handleChangeAmount.bind(this)
        this.setTransactionSend = this.setTransactionSend.bind(this)
        this.submit = this.submit.bind(this)
    }

    setTransactionSend(value) {
        this.setState({isTransactionSend: value})
    }

    handleChangeAddress(e) {
        this.setState({address: e.target.value});
    }

    handleChangeAmount(e) {
        let amount = e.target.value
        this.setState({amount: amount});
    }

    async submit() {

        // console.log(this.state.amount, this.state.address)
        // let data = {
        //     amount: Number(this.state.amount),
        //     to: this.state.address
        // }
        // this.props.background.postMessage({popup: true, type: 'tx', data: data})

        // 'amount','data','from','nonce','ticker','to'

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

    async connectLedger() {

        TransportWebUSB.create().then(transport => {
            const eth = new Eth(transport)
            console.log(eth)

            eth.getAddress("44'/60'/0'/0/0").then(async o => {

                console.log(o.address)

                let user = await disk.user.loadUser()
                // console.log(user)
                let wallet = {pubkey: user.publicKey, prvkey: user.privateKey}
                ENQWeb.Net.provider = user.net

                let data = {
                    from: wallet,
                    amount: Number(this.state.amount) * 1e10,
                    to: this.state.address,
                    data: this.state.data,
                }

                let tx = {
                    to: data.to,
                    from: data.from.pubkey,
                    ticker: data.tokenHash || web.Enq.token[web.Enq.provider],
                    amount: data.amount,
                    nonce: data.nonce || Math.floor(Math.random() * 1e10)
                };

                tx.hash = await web.Utils.Sign.hash_tx_fields(tx)
                tx.sign = await web.Utils.Sign.ecdsa_sign(data.from.prvkey, tx.hash);

                eth.signTransaction("44'/60'/0'/0/0", "").then(transaction => {
                    console.log(transaction)
                })
            })
        })
    }

    render() {
        if (this.state.isTransactionSend) {
            return <TransactionSend setTransaction={this.props.setTransaction}
                                    txHash={this.state.txHash}/>
        } else {
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

                        <input type="text"
                               onChange={this.handleChangeAmount}
                               value={this.state.amount}
                               className={styles.field}
                               placeholder={'Amount'}
                        />

                        <input type="text"
                               onChange={this.handleChangeAmount}
                               value={this.state.data}
                               className={styles.field}
                               placeholder={'Data'}
                        />

                    </div>

                    {/*<div className={styles.header}>*/}

                    {/*    <div className={styles.field}>{this.state.left.toFixed(2)} ENQ left</div>*/}
                    {/*    <div className={styles.field + ' ' + styles.usd}>0.1 ENQ fee</div>*/}

                    {/*</div>*/}

                    <div className={styles.form}>

                        <div onClick={this.submit}
                             className={styles.field + ' ' + styles.button + ' ' + styles.button_blue}>Send
                        </div>

                        <div onClick={this.connectLedger}
                             className={styles.field + ' ' + styles.button + ' ' + styles.button_blue}>Sign with Ledger
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
