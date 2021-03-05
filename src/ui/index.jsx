import React from 'react'
import {render} from 'react-dom'
import Login from './components/Login'
import Account from './components/Account'
import styles from './index.module.css'

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

        // console.log(global.disk.user.loadUser())
    }

    login(user) {
        this.setState({isLogin: true, user: user});
    }

    logout() {
        global.disk.user.removeUser()
        this.setState({isLogin: false});
    }

    render() {
        if (!this.state.isLogin)
            return <Login login={this.login}/>
        else
            return <Account logout={this.logout} user={this.state.user} background={this.background}/>

    }
}

export async function initApp(background) {
    render(
        <App background={background}/>,
        document.getElementById('app-content')
    );
}