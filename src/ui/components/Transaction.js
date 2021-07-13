import React from "react";
import styles from "../css/index.module.css";
import TransactionSend from "./TransactionSend";
import Separator from "../elements/Separator";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import Eth from "@ledgerhq/hw-app-eth";

const rsasign = require('jsrsasign');
const crypto = require('crypto')

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
        this.handleChangeData = this.handleChangeData.bind(this)
        this.setTransactionSend = this.setTransactionSend.bind(this)
        this.submit = this.submit.bind(this)

        this.hash_tx_fields = this.hash_tx_fields.bind(this)
        this.ecdsa_sign = this.ecdsa_sign.bind(this)
        this.signWithLedger = this.signWithLedger.bind(this)
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

    handleChangeData(e) {
        let data = e.target.value
        this.setState({data: data});
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

    async hash_tx_fields(tx) {
        if (!tx)
            return undefined;
        let model = ['amount', 'data', 'from', 'nonce', 'ticker', 'to'];
        let str;
        try {
            str = model.map(v =>
                crypto.createHash('sha256')
                    .update(tx[v].toString().toLowerCase())
                    .digest('hex')
            ).join('');
        } catch (e) {
            if (e instanceof TypeError) {
                console.warn('Old tx format, skip new fields...');
                return undefined;
            }
        }
        return crypto.createHash('sha256').update(str).digest('hex');
    }

    raw_tx_hex(tx) {
        if (!tx)
            return undefined;
        let model = ['amount', 'data', 'from', 'nonce', 'ticker', 'to'];
        let str = '';
        try {
            model.map(v => {
                // console.log(tx[v])
                // console.log(tx[v].toString())
                // console.log(tx[v].toString().hexEncode())
                str += tx[v].toString().hexEncode()
            })
        } catch (e) {
            if (e instanceof TypeError) {
                console.warn(e);
                return undefined;
            }
        }
        return str;
    }

    ecdsa_sign(skey, msg) {
        let sig = new rsasign.Signature({'alg': 'SHA256withECDSA'});
        try {
            sig.init({d: skey, curve: 'secp256k1'});
            sig.updateString(msg);
            return sig.sign();
        } catch (err) {
            console.error('Signing error: ', err);
            return null;
        }
    }

    async signWithLedger() {

        TransportWebUSB.create().then(transport => {
            const eth = new Eth(transport)
            console.log(eth)

            eth.getAddress("44'/60'/0'/0/0").then(async o => {

                console.log(o.address)

                let user = await disk.user.loadUser()
                let tx = {
                    amount: Number(this.state.amount) * 1e10,
                    data: this.state.data,
                    from: user.publicKey,
                    nonce: Math.floor(Math.random() * 1e10),
                    ticker: await ENQWeb.Enq.ticker,
                    to: this.state.address,
                };

                let hex = this.raw_tx_hex(tx)
                console.log(tx)
                console.log(hex)

                tx.hash = await this.hash_tx_fields(tx)
                console.log(tx)
                tx.sign = await this.ecdsa_sign(user.privateKey, tx.hash);
                console.log(tx)

                eth.signTransaction("44'/60'/0'/0/0", hex).then(transaction => {
                    console.log(transaction)
                }).catch(e => {
                    console.log(e)
                })

            }).catch(e => {
                console.log(e)
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
                               onChange={this.handleChangeData}
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

                        <div onClick={this.signWithLedger}
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

String.prototype.hexEncode = function () {
    let hex, i;
    let result = "";
    for (i = 0; i < this.length; i++) {
        hex = this.charCodeAt(i).toString(16);
        result += ("000" + hex).slice(-4);
    }
    return result
}
