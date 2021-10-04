import React from 'react'
import styles from '../css/index.module.css'

import Header from '../elements/Header'
import Separator from '../elements/Separator'
import {regexAddress, regexToken, toggleFullScreen} from "../Utils";
import Input from "../elements/Input";

export default class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            privateKey: '',
            isNetwork: false,
        }
        this.handleChangePrivateKey = this.handleChangePrivateKey.bind(this)

        this.submit = this.submit.bind(this)
        this.generate = this.generate.bind(this)
        this.setNetwork = this.setNetwork.bind(this)
    }

    handleChangePrivateKey(e) {
        this.setState({privateKey: e.target.value})
    }

    setNetwork(value) {
        this.setState({isNetwork: value})
    }

    async submit() {

        if (this.state.privateKey.length !== 64 && !regexAddress.test(this.state.privateKey)) {
            console.error('Incorrect private key')
            return
        }

        const publicKey = ENQWeb.Utils.Sign.getPublicKey(this.state.privateKey, true)
        if (publicKey) {
            // console.log(publicKey)
            let data = {
                publicKey: publicKey,
                privateKey: this.state.privateKey,
                net: ENQWeb.Net.provider,
                token: ENQWeb.Enq.ticker
            }
            await global.disk.promise.sendPromise({
                account: true,
                set: true,
                data: data
            })
            this.props.login(data)
        }
    }

    generate() {
        const privateKey = ENQWeb.Utils.generateKey.getByNumber(1)[0].prvkey
        this.setState({privateKey: privateKey})
    }

    render() {
        return (
            <div className={styles.main}>

                <div className={styles.content}>
                    <img className={styles.login_logo} src="./images/logo_white.png" onClick={toggleFullScreen}/>

                    <div className={styles.welcome1}>Welcome</div>
                    <div className={styles.welcome1}>to Enecuum</div>

                    <div className={styles.welcome2}>Connecting you to network and the</div>
                    <div className={styles.welcome2}>Decentralized Web.</div>
                </div>

                <div className={styles.form}>

                    <Input
                        type="text"
                        spellCheck={false}
                        onChange={() => {}}
                        value={''}
                        className={styles.field}
                        placeholder="Seed phrase"
                    />

                    <Input
                        type="text"
                        spellCheck={false}
                        onChange={this.handleChangePrivateKey}
                        value={this.state.privateKey}
                        className={styles.field + ' ' + (regexToken.test(this.state.privateKey) ? styles.field_correct : '')}
                        placeholder="Private Key"
                    />

                    <div
                        onClick={this.submit}
                        className={`${styles.field} ${styles.button} ${(regexToken.test(this.state.privateKey) ? styles.button_blue : '')}`}
                    >
                        Login
                    </div>

                    <div
                        onClick={this.generate}
                        className={`${styles.field} ${styles.button} ${(!regexToken.test(this.state.privateKey) ? styles.button_blue : '')}`}
                    >
                        Generate
                    </div>

                    {/* <div onClick={() => this.setNetwork(true)} */}
                    {/*     className={styles.field + ' ' + styles.button + ' ' + styles.button_blue}>Network: {ENQWeb.Net.currentProvider.toUpperCase()} */}
                    {/* </div> */}

                    <Separator/>

                </div>

            </div>
        )
    }
}
