import React from "react";
import styles from "../css/index.module.css";
import Network from "./Network"
import Separator from "../elements/Separator";

export default class Lock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            password: ''
        }
        this.handleChangePassword = this.handleChangePassword.bind(this)
        this.submit = this.submit.bind(this)
        this.logout = this.logout.bind(this)
    }

    handleChangePassword(e) {
        this.setState({password: e.target.value});
    }

    async logout() {
        await this.props.logout()
        await disk.promise.sendPromise({account: true, logout: true})
    }

    async submit() {
        // let hash = ENQWeb.Utils.crypto.strengthenPassword('salt*/-+^' + this.state.password)
        // if (disk.lock.unlock(hash)) {
        //     console.log('its yes')
        //     hash = ENQWeb.Utils.crypto.strengthenPassword('salt*/-+^' + hash)
        //     let us = JSON.parse(ENQWeb.Utils.crypto.decrypt(disk.user.loadUserNotJson(), hash))
        //     console.log(us)
        //     disk.user.changeUser(us, true)
        //     this.props.unlock()
        //     window.location.reload(false);
        // }

        if (await disk.promise.sendPromise({account: true, unlock: true, password: this.state.password})) {
            this.props.unlock()
            window.location.reload(false)
        }
        console.log('TODO bug')
    }

    render() {
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

                    <input type="password"
                           spellCheck={false}
                           onChange={this.handleChangePassword}
                           value={this.state.password}
                           className={styles.field}
                           placeholder={'Password'}
                    />

                    <div onClick={this.submit}
                         className={`${styles.field} ${styles.button} ${styles.button_blue}`}>Unlock
                    </div>

                    <div onClick={this.logout}
                         className={`${styles.field} ${styles.button}`}>Logout
                    </div>

                    <Separator/>

                </div>
            </div>
        )
    }
}