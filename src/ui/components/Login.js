import React from 'react'
import styles from '../css/index.module.css'
import Network from './Network'
import Header from '../elements/Header'

let net = localStorage.getItem('net')
if (!net) net = 'bit'

ENQWeb.Net.provider = net

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
        const publicKey = ENQWeb.Utils.Sign.getPublicKey(this.state.privateKey, true)
        if (publicKey) {
            console.log(publicKey)
            const user = global.disk.user.addUser(publicKey, this.state.privateKey, ENQWeb.Net.provider)
            this.props.login(user)
        }
    }

    generate() {
        const privateKey = ENQWeb.Utils.generateKey.getByNumber(1)[0].prvkey
        this.setState({privateKey: privateKey})
    }

    render() {
        if (this.state.isNetwork) {
            return <Network setNetwork={this.setNetwork}/>
        }

        return (
            <div className={styles.main}>

                <div className={styles.content}>
                    <img className={styles.login_logo} src="./images/logo_white.png"/>

                    <div className={styles.welcome1}>Welcome</div>
                    <div className={styles.welcome1}>to Enecuum</div>

                    <div className={styles.welcome2}>Connecting you to network and the</div>
                    <div className={styles.welcome2}>Decentralized Web.</div>
                </div>

                <div className={styles.form}>

                    <input
                        type="text"
                        spellCheck={false}
                        onChange={this.handleChangePrivateKey}
                        value={this.state.privateKey}
                        className={styles.field}
                        placeholder="Private Key"
                    />

                    <div
                        onClick={this.submit}
                        className={`${styles.field} ${styles.button}`}
                    >
                        Login
                    </div>

                    <div
                        onClick={this.generate}
                        className={`${styles.field} ${styles.button} ${styles.button_blue}`}
                    >
                        Generate
                    </div>

                    {/* <div onClick={() => this.setNetwork(true)} */}
                    {/*     className={styles.field + ' ' + styles.button + ' ' + styles.button_blue}>Network: {ENQWeb.Net.currentProvider.toUpperCase()} */}
                    {/* </div> */}

                </div>
            </div>
        )
    }
}
