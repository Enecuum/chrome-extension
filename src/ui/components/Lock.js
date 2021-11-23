import React from "react";
import styles from "../css/index.module.css";
import Separator from "../elements/Separator";
import {toggleFullScreen} from "../Utils";
import Input from "../elements/Input";

export default class Lock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            incorrect: false
        }
        this.handleChangePassword = this.handleChangePassword.bind(this)
        this.submit = this.submit.bind(this)
        this.logout = this.logout.bind(this)
        // this.setConfirm = props.setConfirm
        window.scrollTo(0, 0);
    }

    handleChangePassword(e) {
        this.setState({password: e.target.value});
    }

    async logout() {
        await this.props.logout()
        // await disk.promise.sendPromise({account: true, logout: true})
    }

    async submit() {
        // let hash = ENQWeb.Utils.crypto.strengthenPassword('salt*/-+^' + this.state.password)
        // if (disk.lock.unlock(hash)) {
        //     hash = ENQWeb.Utils.crypto.strengthenPassword('salt*/-+^' + hash)
        //     let us = JSON.parse(ENQWeb.Utils.crypto.decrypt(disk.user.loadUserNotJson(), hash))
        //     console.log(us)
        //     disk.user.changeUser(us, true)
        //     this.props.unlock()
        //     window.location.reload(false);
        // }
        let user = await disk.promise.sendPromise({account: true, unlock: true, password: this.state.password})
        // console.log(user)
        if (user)
            this.props.unlock(user)
        else
            this.setState({incorrect:true});
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

                    <Input type="password"
                           spellCheck={false}
                           onChange={this.handleChangePassword}
                           value={this.state.password}
                           className={styles.field + ' ' + styles.password + ' ' + (this.state.incorrect ? styles.field_incorrect : '')}
                           placeholder={'Password'}
                    />

                    <div onClick={this.submit}
                         className={`${styles.field} ${styles.button} ${styles.button_blue}`}>Unlock
                    </div>

                    <div onClick={() => this.props.setConfirm(true)}
                         className={`${styles.field} ${styles.button}`}>Logout
                    </div>

                    <Separator/>

                </div>
            </div>
        )
    }
}
