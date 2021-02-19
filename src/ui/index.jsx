import React from 'react'
import {render} from 'react-dom'
import styles from './index.module.css'

function App() {
    return <Main/>
}

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isLogin: false}
        this.login = this.login.bind(this)
        this.logout = this.logout.bind(this)
    }

    login() {
        this.setState({isLogin: true});
    }


    logout() {
        this.setState({isLogin: false});
    }

    render() {
        if (this.state.isLogin)
            return <Account logout={this.logout}/>
        else
            return <Login login={this.login}/>
    }
}

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this)
        this.submit = this.submit.bind(this)
        this.state = {
            value: '',
        }
    }

    handleChange(e) {
        this.setState({value: e.target.value});
    }

    submit() {
        this.props.login()
    }

    render() {
        return (
            <div>
                <input type="text"
                       onChange={this.handleChange}
                       value={this.state.value}
                       className={styles.field}
                       placeholder={'Private Key'}
                />

                {/*<div className={styles.title}>Enecuum Network</div>*/}
                {/*<div className={styles.text}>Devices connect to the Enecuum blockchain and share untapped data*/}
                {/*    processing capacity. The more devices connected, the higher the network speed, with uncapped*/}
                {/*    scalability potential. Connecting millions of distributed devices will create a truly decentralized,*/}
                {/*    secure and stable system.*/}
                {/*</div>*/}

                <div onClick={this.submit}
                     className={styles.field + ' ' + styles.button}>Login
                </div>
            </div>
        )
    }
}

class Account extends React.Component {
    constructor(props) {
        super(props)
        this.state = {isSend: false}
        this.setSend = this.setSend.bind(this)
    }

    setSend(value) {
        this.setState({isSend: value});
    }

    render() {

        if (this.state.isSend)
            return <Transaction setSend={this.setSend}/>
        else
            return (
                <div>
                    <div
                        className={styles.field + ' ' + styles.text}>02c3143abeb50e4153da372868490277c14b2877f05b477e4671722152b0112473
                    </div>
                    <div className={styles.field + ' ' + styles.text}><b>638.31 ENQ</b></div>

                    <div onClick={() => this.setSend(true)}
                         className={styles.field + ' ' + styles.button}>Send transaction
                    </div>

                    <div onClick={this.props.logout}
                         className={styles.field + ' ' + styles.button + ' ' + styles.red}>Logout
                    </div>
                </div>
            )
    }
}

class Transaction extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: '',
        }
    }

    handleChangeAddress(e) {
        this.setState({address: e.target.value});
    }

    handleChangeAmount(e) {
        this.setState({amount: e.target.value});
    }

    render() {
        return (
            <div>
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
                     className={styles.field + ' ' + styles.button}>Send
                </div>

                <div onClick={() => this.props.setSend(false)}
                     className={styles.field + ' ' + styles.button}>Back
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