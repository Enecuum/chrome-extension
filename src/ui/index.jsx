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

                <div className={styles.title}>Enecuum Network</div>
                <div className={styles.text}>Devices connect to the Enecuum blockchain and share untapped data
                    processing capacity. The more devices connected, the higher the network speed, with uncapped
                    scalability potential. Connecting millions of distributed devices will create a truly decentralized,
                    secure and stable system.
                </div>

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
        this.state = {
            value: 'test',
        }
    }

    render() {
        return (
            <div>
                <div className={styles.field + ' ' + styles.text}>Public key</div>
                <div className={styles.field + ' ' + styles.text}>KEY</div>
                <div className={styles.field + ' ' + styles.text}>Balance:</div>
                <div onClick={this.props.logout}
                     className={styles.field + ' ' + styles.button}>Logout
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