import React from 'react'
import {render} from 'react-dom'
import styles from './index.module.css'
import storage from "../utils/localStorage";

function App() {
    return <Main/>
}

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLogin: false,
            privateKey: ''
        }
        this.login = this.login.bind(this)
        this.logout = this.logout.bind(this)
    }

    login(privateKey) {
        this.setState({isLogin: true, privateKey});
    }


    logout() {
        this.setState({isLogin: false});
    }

    render() {
        if (this.state.isLogin)
            return <Account logout={this.logout} privateKey={this.state.privateKey}/>
        else
            return <Login login={this.login}/>
    }
}

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
        }
        this.handleChange = this.handleChange.bind(this)
        this.submit = this.submit.bind(this)
        this.generate = this.generate.bind(this)
    }

    handleChange(e) {
        this.setState({value: e.target.value});
    }

    submit() {
        console.log(ENQWeb.Utils.Sign.getPublicKey(this.state.value, true))
        this.props.login(ENQWeb.Utils.Sign.getPublicKey(this.state.value, true))
    }

    generate() {
        // this.props.login()
    }

    render() {
        return (
            <div className={styles.main}>

                <div className={styles.header}>
                    <div className={styles.title}>Enecuum Network</div>
                </div>

                {/*<div className={styles.circle}></div>*/}

                {/*<div className={styles.title}>Enecuum Network</div>*/}
                {/*<div className={styles.text}>Devices connect to the Enecuum blockchain and share untapped data*/}
                {/*    processing capacity. The more devices connected, the higher the network speed, with uncapped*/}
                {/*    scalability potential. Connecting millions of distributed devices will create a truly decentralized,*/}
                {/*    secure and stable system.*/}
                {/*</div>*/}

                <div className={styles.form}>

                    <input type="text"
                           onChange={this.handleChange}
                           value={this.state.value}
                           className={styles.field}
                           placeholder={'Private Key'}
                    />

                    <div onClick={this.submit}
                         className={styles.field + ' ' + styles.button}>Login
                    </div>

                    <div onClick={this.props.generate}
                         className={styles.field + ' ' + styles.button}>Generate
                    </div>

                </div>
            </div>
        )
    }
}

class Account extends React.Component {
    constructor(props) {
        super(props)
        this.state = {isSend: false, value: 638.31}
        this.setSend = this.setSend.bind(this)
    }

    setSend(value) {
        this.setState({isSend: value});
    }

    render() {

        if (this.state.isSend)
            return <Transaction setSend={this.setSend} value={this.state.value} />
        else
            return (
                <div className={styles.main}>

                    <div className={styles.header}>

                        <div className={styles.field + ' ' + styles.balance}>{this.state.value} ENQ</div>
                        <div className={styles.field + ' ' + styles.usd}>12.31 USD</div>
                        <div className={styles.field + ' ' + styles.address}>{this.props.privateKey}</div>
                        <div className={styles.field + ' ' + styles.copy}>COPY</div>

                    </div>

                    <div className={styles.form}>

                        <div onClick={() => {}}
                             className={styles.field + ' ' + styles.button + ' ' + styles.disabled}>Transactions
                        </div>

                        <div onClick={() => this.setSend(true)}
                             className={styles.field + ' ' + styles.button}>Send transaction
                        </div>

                        <div onClick={this.props.logout}
                             className={styles.field + ' ' + styles.button + ' ' + styles.red}>Logout
                        </div>

                    </div>
                </div>
            )
    }
}

class Transaction extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: props.value,
            left: props.value,
        }
        this.handleChangeAddress = this.handleChangeAddress.bind(this)
        this.handleChangeAmount = this.handleChangeAmount.bind(this)
    }

    handleChangeAddress(e) {
        this.setState({address: e.target.value});
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
            left: left.toFixed(2),
        });

        console.log(this.state.value - e.target.value)
    }

    render() {
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

                </div>

                <div className={styles.header}>

                    <div className={styles.balance}>{this.state.left} ENQ left</div>
                    <div className={styles.field + ' ' + styles.copy}>0.1 ENQ commission</div>

                </div>

                <div className={styles.form}>

                    <div onClick={this.submit}
                         className={styles.field + ' ' + styles.button}>Send
                    </div>

                    <div onClick={() => this.props.setSend(false)}
                         className={styles.field + ' ' + styles.button}>&laquo; Back
                    </div>

                </div>
            </div>
        )
    }
}

export async function initApp(background) {
    render(
        <App/>,
        document.getElementById('app-content')
    );
}

// let styles = {
//     body: {
//
//     },
//     field: {
//         width: '80%',
//         background: 'ghostwhite',
//         padding: '10px'
//     }
// }