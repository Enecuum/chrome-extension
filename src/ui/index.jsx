import React from 'react'
import {render} from 'react-dom'
import styles from './index.module.css'
import storage from "../utils/localStorage";

function App(background) {
    return <Main background={background}/>
}


class Main extends React.Component {
    constructor(props) {
        super(props);
        this.background = props.background.background
        this.state = {
            user: global.disk.user.loadUser(),
            isLogin: global.disk.user.loadUser().publicKey,
        }
        this.login = this.login.bind(this)
        this.logout = this.logout.bind(this)

        console.log(global.disk.user.loadUser())
    }

    login(user) {
        this.setState({isLogin: true, user: user});
    }


    logout() {
        global.disk.user.removeUser()
        this.setState({isLogin: false});
    }

    render() {
        if (this.state.isLogin)
            return <Account logout={this.logout} user={this.state.user} background={this.background}/>
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

    async submit() {
        let publicKey = ENQWeb.Utils.Sign.getPublicKey(this.state.value, true)
        if (publicKey) {
            console.log(publicKey)
            let user = global.disk.user.addUser(publicKey, this.state.value, 'f3')
            this.props.login(user)
        }
    }

    generate() {
        // this.props.login()
    }

    render() {
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
        this.state = {isSendTransaction: false, value: 0}
        this.setSendTransaction = this.setSendTransaction.bind(this)
        this.balance = this.balance.bind(this)
        console.log(this)

        this.balance()
    }

    setSendTransaction(value) {
        this.setState({isSendTransaction: value});
    }

    balance() {
        // console.log(this.props)
        ENQWeb.Enq.provider = this.props.user.net
        let token = ENQWeb.Enq.token[ENQWeb.Enq.provider]
        ENQWeb.Net.get.getBalance(this.props.user.publicKey, token).then(res => {
            this.setState({value: res.amount / 1e10})
            console.log(res.amount / 1e10)
        }).catch(err => {
            console.log(err)
        })

    }

    render() {

        if (this.state.isSendTransaction)
            return <Transaction setSend={this.setSendTransaction} value={this.state.value}
                                background={this.props.background} publicKey={this.props.user.publicKey}/>
        else
            return (
                <div className={styles.main}>

                    <div className={styles.header}>

                        <div className={styles.field + ' ' + styles.balance}>{this.state.value.toFixed(2)} ENQ</div>
                        <div className={styles.field + ' ' + styles.usd}>12.31 USD</div>
                        <div className={styles.field + ' ' + styles.address}>{this.props.user.publicKey}</div>
                        <div className={styles.field + ' ' + styles.copy}>COPY</div>

                    </div>

                    <div className={styles.form}>

                        <div onClick={() => {
                        }}
                             className={styles.field + ' ' + styles.button + ' ' + styles.disabled}>Transactions
                        </div>

                        <div onClick={() => this.setSendTransaction(true)}
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
        console.log(this.props)
        this.state = {
            isCheckTransaction: false,
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
        this.setCheckTransaction(true)
        console.log('tx btn')
    }

    render() {
        if (this.state.isCheckTransaction) {
            return <CheckTransaction background={this.props.background} setCheckTransaction={this.setCheckTransaction}
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
                             className={styles.field + ' ' + styles.button}>Sign
                        </div>

                    </div>

                    <div className={styles.header}>

                        <div className={styles.balance}>{this.state.left.toFixed(2)} ENQ left</div>
                        <div className={styles.field + ' ' + styles.usd}>0.1 ENQ commission</div>

                    </div>

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

class CheckTransaction extends React.Component {
    constructor(props) {
        super(props);
        this.submit = this.submit.bind(this)
        console.log(props)
    }

    submit() {
        console.log('submit work')
        console.log(this.props.amount, this.props.address)
        let data = {
            amount: Number(this.props.amount),
            to: this.props.address
        }
        this.props.background.postMessage({popup: true, type: 'tx', data: data})
    }

    render() {
        console.log(this.props.background)
        this.props.background.postMessage({test: '123'})
        return (
            <div className={styles.main}>

                <div className={styles.form}>
                    <input type="text"
                           value={this.props.myAddress}
                           className={styles.field}
                           placeholder={'Address'}
                    />

                    <input type="text"
                           value={this.props.address}
                           className={styles.field}
                           placeholder={'Address'}
                    />

                    <input type="text"
                           value={this.props.amount}
                           className={styles.field}
                           placeholder={'Amount'}
                    />

                    <div onClick={this.submit}
                         className={styles.field + ' ' + styles.button}>Send
                    </div>

                </div>


                <div className={styles.form}>

                    <div onClick={() => this.props.setCheckTransaction(false)}
                         className={styles.field + ' ' + styles.button}>&laquo; Back
                    </div>

                </div>
            </div>
        )
    }
}

export async function initApp(background) {
    render(
        <App background={background}/>,
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