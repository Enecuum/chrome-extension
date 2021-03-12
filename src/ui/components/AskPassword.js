import React from "react";
import styles from "../index.module.css";
import Network from "./Network"

export default class AskPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            password: ''
        }
        this.handleChangePassword = this.handleChangePassword.bind(this)
        this.submit = this.submit.bind(this)
    }

    handleChangePassword(e) {
        this.setState({password: e.target.value});
    }

    async submit() {
        // let publicKey = ENQWeb.Utils.Sign.getPublicKey(this.state.value, true)
        // if (publicKey) {
        //     console.log(publicKey)
        //     let user = global.disk.user.addUser(publicKey, this.state.value, this.state.net)
        //     this.props.login(user)
        //     ENQWeb.Net.provider = this.state.net
        // }
    }

    render() {
        return (
            <div className={styles.main}>

                <div className={styles.form}>

                    <input type="text"
                           spellCheck={false}
                           onChange={this.handleChangePassword}
                           value={this.state.password}
                           className={styles.field}
                           placeholder={'Password'}
                    />

                    <div onClick={this.submit}
                         className={styles.field + ' ' + styles.button}>Login
                    </div>

                </div>
            </div>
        )
    }
}