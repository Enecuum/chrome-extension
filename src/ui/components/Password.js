import React from "react";
import styles from "../index.module.css";
import TransactionSend from "./TransactionSend";

export default class Password extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            password1: '',
            password2: '',
        }
        this.handleChangePassword1 = this.handleChangePassword1.bind(this)
        this.handleChangePassword2 = this.handleChangePassword2.bind(this)
        this.save = this.save.bind(this)
    }

    handleChangePassword1(e) {
        this.setState({password1: e.target.value});
    }

    handleChangePassword2(e) {
        this.setState({password2: e.target.value});
    }

    save() {
        console.log(this.state.password1)
        console.log(this.state.password2)
    }

    render() {

        return (

            <div className={styles.main}>

                <div className={styles.form}>

                    <input type="text"
                           spellCheck={false}
                           onChange={this.handleChangePassword1}
                           value={this.state.password1}
                           className={styles.field}
                           placeholder={'Password'}
                    />

                    <input type="text"
                           spellCheck={false}
                           onChange={this.handleChangePassword2}
                           value={this.state.password2}
                           className={styles.field}
                           placeholder={'Password one more time'}
                    />

                    <div onClick={this.save}
                         className={styles.field + ' ' + styles.button}>Save
                    </div>

                </div>

                <div className={styles.form}>

                    <div onClick={() => this.props.setPassword(false)}
                         className={styles.field + ' ' + styles.button + ' ' + styles.back}>Back
                    </div>

                </div>
            </div>
        )

    }
}