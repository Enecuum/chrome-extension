import React, { useState } from 'react'
import styles from '../css/index.module.css'
import elements from '../css/elements.module.css'
import Separator from '../elements/Separator'
import { regexAddress } from '../Utils'
import Input from '../elements/Input'
import { signHash } from '../../utils/ledgerShell'
import TransportWebHID from '@ledgerhq/hw-transport-webhid'
import { apiController } from '../../utils/apiController'
import { logger } from 'workbox-core/_private'

//TODO decimals to tokens

export default class Transaction extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isTransactionSend: false,
            decimals: 1e10,
            feeDecimals: 1e10,
            address: '',
            amount: '',
            txHash: '',
            data: '',
            needPassword: false,
            unlock: false,
            getLedgerTransport: this.props.getLedgerTransport,
            fee: Number(0.0),
            localNetworks: JSON.parse(localStorage.getItem('networks')) || [],
            network: ENQWeb.Net.currentProvider.replace('https://', '')
                .replace('http://', '')
                .toUpperCase(),
            block: false,
            nonce:  Math.floor(Math.random() * 1e10),
            feeTicker: '',
            ticker: '',
            //TODO
            fee_type: 0
        }
        this.handleChangeAddress = this.handleChangeAddress.bind(this)
        this.handleChangeAmount = this.handleChangeAmount.bind(this)
        this.handleChangeData = this.handleChangeData.bind(this)
        this.setTransactionSend = this.setTransactionSend.bind(this)
        this.submit = this.submit.bind(this)

        this.feeCount = this.feeCount.bind(this)
        this.decimalsSearch = this.decimalsSearch.bind(this)
        this.feeDecimalsSearch = this.feeDecimalsSearch.bind(this)

        this.feeCount()
        this.decimalsSearch()

        this.setNetwork = this.setNetwork.bind(this)

        // this.setNetwork()
    }

    setNetwork() {
        this.setState({
            network: this.state.localNetworks.find(element => element.host === ENQWeb.Net.currentProvider) ?
                this.state.localNetworks.find(element => element.host === ENQWeb.Net.currentProvider).name : this.state.network

        })
    }

    setTransactionSend(user, hash) {
        return {
            data: {
                date: new Date().getTime(),
                feeTicker: this.state.feeTicker,
                feeDecimals: this.state.feeDecimals,
                decimals: this.state.decimals,
                ticker: this.state.ticker,
                fee_type: this.state.fee_type,
                fee: this.state.fee
            },
            rectype: 'iout',
            tx: {
                to: this.state.address,
                from: {
                    pubkey: user.publicKey
                },
                data: this.state.data,
                hash: hash,
                fee_value: this.state.fee * this.state.feeDecimals,
                tokenHash: '',
                // ticker: await findTickerInCache(history.records[id].token_hash) || false,
                ticker: '',
                value: this.state.amount * -1 * this.state.decimals
            },
            cb: {
                taskId: 0,
            },
            type: 'iout'
        }
    }

    handleChangeAddress(e) {
        this.setState({ address: e.target.value })
    }

    handleChangeAmount(e) {
        // console.log(e.target.value)
        // console.log(typeof e.target.value)

        if (e.target.value === '00') {
            //TODO
            this.setState({ amount: '0' })
            return
        }

        let amount = Number(e.target.value)
        if (amount < 0 || amount * this.state.decimals > this.props.isTransaction.balance) {
            return
        }

        if (amount.countDecimals() > 9) {
            amount = amount.toFixed(10)
        }

        this.setState({ amount: amount })
        this.feeCount()
    }

    handleChangeData(e) {
        let data = e.target.value
        this.setState({ data: data })
    }

    async submit() {
        if (!regexAddress.test(this.state.address) || this.state.amount < 0) {
            return
        }

        if (this.state.block) {
            return
        }

        //TODO
        let user = await userStorage.user.loadUser()
        // if (!user.privateKey && user.type !== 2) {
        //     user = await userStorage.promise.sendPromise({
        //         account: true,
        //         unlock: true,
        //         password: this.state.password
        //     })
        //     console.log(user)
        //     return
        // }

        let wallet = {
            pubkey: user.publicKey,
            prvkey: user.privateKey
        }
        ENQWeb.Net.provider = user.net
        console.log(user)
        let data = {
            from: user.type === 2 ? wallet.pubkey : wallet,
            amount: Number(this.state.amount) * this.state.decimals,
            to: this.state.address,
            data: this.state.data,
            tokenHash: user.token,
            nonce: this.state.nonce
        }

        console.log(data)
        console.log(user)

        let response
        try {
            this.setState({ block: true })
            if (user.type !== 2) {
                response = await apiController.postTransaction(data)
            } else {
                let Transport = await this.props.ledgerTransportController()
                data.nonce = data.nonce ? data.nonce : Math.floor(Math.random() * 1e10)
                data.ticker = data.tokenHash
                data.hash = ENQWeb.Utils.Sign.hash_tx_fields(data)
                data.sign = await signHash(ENQWeb.Utils.crypto.sha256(data.hash), user.privateKey, Transport)
                console.log({ sign: data.sign })
                response = await apiController.sendTransaction(data).then(data => {
                        if (data.hash) {
                            return data
                        }
                        console.warn(data)
                    })
                    .catch(er => {
                        console.error(er)
                    })
            }
        } catch (e) {
            this.setState({ block: false })
        }

        if (response) {
            this.setState({
                txHash: response.hash
            })
        }

        this.props.setTransactionHistory(this.setTransactionSend(user, response.hash))
        this.props.setTransaction(false)
    }

    feeCount() {
        apiController.getTokenInfo(this.props.isTransaction.token)
            .then(tokenInfo => {
                this.setState({ticker:tokenInfo[0]['ticker']})
                if (tokenInfo[0]['fee_type'] === 2) {
                    this.setState({fee_type:2})
                    apiController.getTokenInfo(ENQWeb.Enq.ticker)
                        .then(mainToken=>{
                            this.feeDecimalsSearch(mainToken)
                            this.setState({feeTicker:mainToken[0]['ticker']})
                            let currentFee = Number(tokenInfo[0]['fee_value']) / this.state.feeDecimals
                            this.setState({ fee: currentFee })
                        })
                } else {
                    ENQweb3lib.fee_counter(this.props.isTransaction.token, BigInt(Math.floor(this.state.amount * this.state.decimals)))
                        .then(fee => {
                            // console.log(typeof fee)
                            // console.log(fee)
                            let currentFee = Number(fee) / this.state.decimals
                            // console.log(currentFee)
                            this.setState({ fee: currentFee })
                        })
                }
            })

    }

    decimalsSearch() {
        apiController.getTokenInfo(this.props.isTransaction.token)
            .then(info => {
                if (info.length === 0) {
                    console.warn('Token not found.')
                } else {
                    let decimals = 10 ** info[0].decimals
                    console.log(decimals)
                    this.setState({ decimals: decimals })
                }
            })
    }

    feeDecimalsSearch(token) {
        let decimals = 10 ** token[0].decimals
        this.setState({feeDecimals:decimals})
    }

    // pending() {
    //
    //     for (const key in history.filter(item => item.tx.tokenHash === props.user.token || item.tx.data.includes(props.user.token))) {
    //         const item = history[key]
    //     }
    //
    //     if (item.type === 'iin') {
    //         props.setTransactionHistory(item)
    //     }
    //     if (item.type === 'iout') {
    //         props.setTransactionHistory(item)
    //     }
    // }

    render() {

        let balanceAfter =  this.state.fee_type !== 2 ? this.props.isTransaction.balance ?

            (
                Number(
                    this.props.isTransaction.balance
                    - BigInt(Math.floor(this.state.amount * this.state.decimals))
                    - BigInt(Math.floor(this.state.fee * this.state.decimals))
                )
                / this.state.decimals
            )

            : '0.0' : (Number(
                this.props.isTransaction.balance
                - BigInt(Math.floor(this.state.amount * this.state.decimals))
            )
            / this.state.decimals)

        balanceAfter += ' ' + (this.props.isTransaction.ticker ? this.props.isTransaction.ticker : 'COIN')

        return (
            <div className={styles.main}>

                <div className={styles.content}>

                    <Input type="text"
                           spellCheck={false}
                           onChange={this.handleChangeAddress}
                           value={this.state.address}
                           className={styles.field + ' ' + (regexAddress.test(this.state.address) ? styles.field_correct : '')}
                           placeholder={'Address'}
                    />

                    <Input type="number"
                           onChange={this.handleChangeAmount}
                           value={this.state.amount}
                           className={styles.field}
                           placeholder={'Amount'}
                    />

                    <div
                        className={styles.field_ticker}>{this.props.isTransaction.ticker ? this.props.isTransaction.ticker : 'COIN'}</div>

                    <Input type="text"
                           spellCheck={false}
                           onChange={this.handleChangeData}
                           value={this.state.data}
                           className={styles.field}
                           placeholder={'Data'}
                    />

                    {/*{this.state.needPassword && <Input type="password"*/}
                    {/*                        spellCheck={false}*/}
                    {/*                        onChange={(e) => this.setState({password: e.target.value})}*/}
                    {/*                        value={this.state.password}*/}
                    {/*                        className={styles.field}*/}
                    {/*                        placeholder={'Password'}*/}
                    {/*/>}*/}

                </div>


                <div className={styles.info}>

                    <div className={styles.field + ' ' + elements.rowLine}>
                        Network: <div className={elements.network_name}>{this.state.network}</div>
                    </div>

                    <div className={styles.field}>
                        Fee: {this.state.fee + ' ' + (this.state.fee_type === 0 ? this.props.isTransaction.ticker : this.state.feeTicker)}
                    </div>

                    <div className={styles.field}>
                        Balance after: {balanceAfter}
                    </div>

                    {/*{this.state.needPassword && <div className={styles.field}>*/}
                    {/*    You have to unlock account*/}
                    {/*</div>}*/}

                </div>

                <div className={styles.form}>

                    <div onClick={this.submit}
                         className={styles.field + ' ' + styles.button + ' ' + (regexAddress.test(this.state.address) && !this.state.block ? styles.button_blue : styles.button_disabled)}>Send
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

String.prototype.hexEncode = function () {
    let hex,
        i
    let result = ''
    for (i = 0; i < this.length; i++) {
        hex = this.charCodeAt(i)
            .toString(16)
        result += ('000' + hex).slice(-4)
    }
    return result
}

Number.prototype.countDecimals = function () {
    if (Math.floor(this.valueOf()) === this.valueOf()) return 0
    return this.toString()
        .split('.')[1].length || 0
}
