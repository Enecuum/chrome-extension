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
        this.props.unlock()
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
                         className={styles.field + ' ' + styles.button}>Unlock
                    </div>

                </div>
            </div>
        )
    }
}