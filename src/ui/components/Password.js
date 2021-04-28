import React from "react";
import styles from "../css/index.module.css";
import TransactionSend from "./TransactionSend";
import Separator from "../elements/Separator";

export default class Password extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            password1: '',
            password2: '',
            allow: false
        }
        this.handleChangePassword1 = this.handleChangePassword1.bind(this)
        this.handleChangePassword2 = this.handleChangePassword2.bind(this)
        this.setAllow = this.setAllow.bind(this)
        this.save = this.save.bind(this)
    }

    handleChangePassword1(e) {
        this.setState({password1: e.target.value}, this.setAllow);
    }

    handleChangePassword2(e) {
        this.setState({password2: e.target.value}, this.setAllow);
    }

    setAllow() {
        if (this.state.password1 === this.state.password2) {
            this.setState({allow: true})
        } else {
            this.setState({allow: false})
        }
    }

    save() {
        if (this.state.password1 === this.state.password2) {
            let checkPass = disk.lock.getHashPassword()

            disk.lock.setPassword(ENQWeb.Utils.crypto.strengthenPassword('salt*/-+^' + this.state.password1))
            disk.lock.setLock(false)
            if (checkPass) {
                disk.promise.sendPromise({account: true, encrypt: true, again: true})
            } else {
                // disk.promise.sendPromise({account: true, encrypt: true})
            }

            this.props.setPassword(false)
            this.props.login()
        } else {

        }
    }

    render() {

        return (

            <div className={styles.main}>

                <div className={styles.content}>
                    <img className={styles.login_logo} src="./images/logo_white.png"/>

                    <div className={styles.welcome1}>Create</div>
                    <div className={styles.welcome1}>Password</div>

                </div>

                <div className={styles.form}>

                    <input type="password"
                           spellCheck={false}
                           onChange={this.handleChangePassword1}
                           value={this.state.password1}
                           className={styles.field + ' ' + styles.password}
                           placeholder={'New password'} // (min 8 chars)
                    />

                    <input type="password"
                           spellCheck={false}
                           onChange={this.handleChangePassword2}
                           value={this.state.password2}
                           className={styles.field + ' ' + styles.password}
                           placeholder={'Confirm password'}
                    />

                    <div onClick={this.state.allow ? this.save : this.save}
                         className={styles.field + ' ' + styles.button + ' ' + (this.state.allow ? '' : styles.button_disabled)}>Save
                    </div>

                    {this.props.publicKey && <div onClick={() => this.props.setPassword(false)} className={styles.field + ' ' + styles.button}>Back</div>}

                    <Separator/>

                </div>
            </div>
        )

    }
}
