import React from "react";
import styles from "../css/index.module.css";
import TransactionSend from "./TransactionSend";
import Separator from "../elements/Separator";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import Eth from "@ledgerhq/hw-app-eth";

const rsasign = require('jsrsasign');
const crypto = require('crypto')
import {Transaction as tx} from 'ethereumjs-tx'
import TransactionHistory from "./requests/TransactionHistory";

const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/c6ffc7b60a174cf6817cd3b56e6019e2'));

export default class Transaction extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isTransactionSend: false,
            address: '',
            amount: '0.0',
            txHash: '',
            data: '',
            unlock: false,
            getLedgerTransport: this.props.getLedgerTransport
        }
        this.handleChangeAddress = this.handleChangeAddress.bind(this)
        this.handleChangeAmount = this.handleChangeAmount.bind(this)
        this.handleChangeData = this.handleChangeData.bind(this)
        this.setTransactionSend = this.setTransactionSend.bind(this)
        this.submit = this.submit.bind(this)

        this.hash_tx_fields = this.hash_tx_fields.bind(this)
        this.ecdsa_sign = this.ecdsa_sign.bind(this)
        this.signWithLedger = this.signWithLedger.bind(this)
        console.log(props.user)
        // this.setTransactionSend = this.getLedgerTransport.bind(this)
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
            data: this.state.data,
            tokenHash: this.props.user.token
        }

        console.log(data)

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

        console.log(tx)

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

        let transport = await this.props.getLedgerTransport()

        console.log(transport)

        const eth = new Eth(transport)
        console.log(eth)

        eth.getAddress("44'/60'/0'/0/0").then(async o => {

            console.log(o.address)
            this.setState({
                address: o.address
            })

            let user = await disk.user.loadUser()
            let enqTX = {
                amount: Number(this.state.amount) * 1e10,
                data: this.state.data,
                from: user.publicKey,
                nonce: Math.floor(Math.random() * 1e10),
                ticker: await ENQWeb.Enq.ticker,
                to: '029ca56f6af280ce7fa6383006a669299e9c4f44d899ccfd466fb29f1a2440400c',
            };

            let hex = this.raw_tx_hex(enqTX)
            console.log(enqTX)
            console.log(hex)

            enqTX.hash = await this.hash_tx_fields(tx)
            console.log(enqTX)

            // enqTX.sign = await this.ecdsa_sign(user.privateKey, enqTX.hash)
            // console.log(enqTX)

            // let rawTx = {
            //     nonce: web3.utils.toHex(1),
            //     gasPrice: web3.utils.toHex(20000000000),
            //     gasLimit: web3.utils.toHex(30000000000),
            //     to: '',
            //     value: web3.utils.toHex(1000000),
            //     data: '0xc0de',
            //     networkId: 3
            // };
            // console.log(rawTx)

            // let gasPrice = await web3.eth.gasPrice
            // console.log(gasPrice, typeof gasPrice);

            // let testData = '0x7f4e616d65526567000000000000000000000000000000000000000000000000003057307f4e616d6552656700000000000000000000000000000000000000000000000000573360455760415160566000396000f20036602259604556330e0f600f5933ff33560f601e5960003356576000335700604158600035560f602b590033560f60365960003356573360003557600035335700'
            // let testData = '0x'

            // let resultGas = await web3.eth.estimateGas({
            //     to: this.state.address,
            //     data: this.state.data
            // });
            // console.log(resultGas)

            // let gas = 500 * 1e9
            // let gas = 15092388
            // console.log(gas)
            // let value = web3.utils.toWei(this.state.amount, 'ether').toString()
            // console.log(value)

            // console.log(web3.eth.gasPrice, typeof web3.eth.gasPrice);
            // const txMain = new tx({
            //     nonce: web3.utils.toHex(1048576),
            //     from: this.state.address,
            //     to: this.state.address,
            //     gasPrice: web3.utils.toHex(20e9),
            //     gasLimit: web3.utils.toHex(21000),
            //     value: web3.utils.toHex(web3.utils.toWei(this.state.amount, 'ether')), // 1 eth
            //     data: this.state.data,
            //     chainId: '0x03'
            // }, {chain: 'ropsten', hardfork: 'petersburg'})

            // 0x029ca56f6af280ce7fa6383006a669299e9c4f44d899ccfd466fb29f1a2440400c
            // 0x3ff9d7b3d4767175ed7c5190a4c37a07555061b0a1406a33eeac3aa75d4e9d84

            // console.log(txMain)
            // const txMain = new tx(rawTx)

            // let serializedTx = enqTX.serialize().toString('hex')
            // console.log(serializedTx)

            // eth.signTransaction("44'/60'/0'/0/0", serializedTx).then(transaction => {
            //
            //     console.log(transaction)
            //
            //     txMain.v = '0x' + transaction.v
            //     txMain.r = '0x' + transaction.r
            //     txMain.s = '0x' + transaction.s
            //
            //     console.log(txMain)
            //
            //     const signedTx = new tx(txMain)
            //     const signedSerializedTx = signedTx.serialize().toString('hex')
            //
            //     web3.eth.sendSignedTransaction('0x' + signedSerializedTx).then(txHash => {
            //         console.log('tx hash: ', {txHash})
            //     })
            //
            // }).catch(e => {
            //     console.log(e)
            // })

            eth.signEIP712HashedMessage("44'/60'/0'/0/0", '0x', enqTX.hash).then(transaction => {

                console.log(transaction)
            })

            // eth.signPersonalMessage("44'/60'/0'/0/0", '').then(transaction => {
            //
            //     console.log(transaction)

            // txMain.v = '0x' + transaction.v
            // txMain.r = '0x' + transaction.r
            // txMain.s = '0x' + transaction.s
            //
            // console.log(txMain)
            //
            // const signedTx = new tx(txMain)
            // const signedSerializedTx = signedTx.serialize().toString('hex')
            //
            // web3.eth.sendSignedTransaction('0x' + signedSerializedTx).then(txHash => {
            //     console.log('tx hash: ', {txHash})
            // })

            // }).catch(e => {
            //     console.log(e)
            // })


        }).catch(e => {
            console.log(e)
            // this.setState({unlock: false});
        })

        // TransportWebUSB.create().then(transport => {})
    }

    getTicker(hash){
        let tokens = (disk.tokens.getTokens()).tokens
        return tokens[hash] ? tokens[hash] : 'COIN'
    }

    render() {
        if (this.state.isTransactionSend) {
            return <TransactionSend setTransaction={this.props.setTransaction} txHash={this.state.txHash}/>
            // return <TransactionHistory setTransaction={this.props.setTransaction} txHash={this.state.txHash}/>
        } else {
            return (
                <div className={styles.main}>

                    <div className={styles.transaction_network}>
                        Network: {ENQWeb.Net.currentProvider.toUpperCase()}
                    </div>

                    <div className={styles.transaction_network}>
                        Token: {this.getTicker(this.props.user.token)}
                    </div>

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

                        {/*<div onClick={this.signWithLedger}*/}
                        {/*     className={styles.field + ' ' + styles.button + ' ' + styles.button_blue}>Sign with*/}
                        {/*    Ledger {this.state.unlock ? '' : ''}*/}
                        {/*</div>*/}

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
