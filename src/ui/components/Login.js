import React from "react";
import styles from "../index.module.css";
import Network from "./Network"

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            isNetwork: false,
            net: 'bit'
        }
        this.handleChange = this.handleChange.bind(this)
        this.submit = this.submit.bind(this)
        this.generate = this.generate.bind(this)
        this.network = this.network.bind(this)
        this.setNetwork = this.setNetwork.bind(this)
        this.setNet = this.setNet.bind(this)
    }

    handleChange(e) {
        this.setState({value: e.target.value});
    }

    setNetwork(value) {
        this.setState({isNetwork: value})
    }

    setNet(value) {
        this.setState({net: value})
    }

    async submit() {
        let publicKey = ENQWeb.Utils.Sign.getPublicKey(this.state.value, true)
        if (publicKey) {
            console.log(publicKey)
            let user = global.disk.user.addUser(publicKey, this.state.value, this.state.net)
            this.props.login(user)
            ENQWeb.Net.provider = this.state.net
        }
    }

    generate() {
        // this.props.login()
    }

    network() {
        this.setState({isNetwork: true})
    }

    render() {
        if (this.state.isNetwork) {
            return <Network setNetwork={this.setNetwork} setNet={this.setNet} net={this.state.net}/>
        } else {
            return (
                <div className={styles.main}>

                    {/*<div className={styles.header}>*/}
                    {/*    <div className={styles.title}>Enecuum Network</div>*/}
                    {/*</div>*/}

                    {/*<div></div>*/}

                    {/*<div className={styles.title}>Enecuum Network</div>*/}
                    {/*<div className={styles.text}>Devices connect to the Enecuum blockchain and share untapped data*/}
                    {/*    processing capacity. The more devices connected, the higher the network speed, with uncapped*/}
                    {/*    scalability potential. Connecting millions of distributed devices will create a truly decentralized,*/}
                    {/*    secure and stable system.*/}
                    {/*</div>*/}

                    <div className={styles.form}>

                        <input type="text"
                               spellCheck={false}
                               onChange={this.handleChange}
                               value={this.state.value}
                               className={styles.field}
                               placeholder={'Private Key'}
                        />

                        <div onClick={this.submit}
                             className={styles.field + ' ' + styles.button}>Login
                        </div>

                        <div onClick={this.generate}
                             className={styles.field + ' ' + styles.button}>Generate
                        </div>

                        <div onClick={this.network}
                             className={styles.field + ' ' + styles.button}>Network: {this.state.net}
                        </div>

                    </div>
                </div>
            )
        }

    }
}