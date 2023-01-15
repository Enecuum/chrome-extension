import React from 'react'
import styles from '../css/index.module.css'
import Separator from '../elements/Separator'
import { toggleFullScreen } from '../Utils'
import Input from '../elements/Input'

export default class Password extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            password1: '',
            password2: '',
            allow: false,
            oldPassword: '',
            incorrectOld: false,
            incorrectNew: false
        }
        this.handleChangePassword1 = this.handleChangePassword1.bind(this)
        this.handleChangePassword2 = this.handleChangePassword2.bind(this)
        this.handleChangeOldPassword = this.handleChangeOldPassword.bind(this)
        this.setAllow = this.setAllow.bind(this)
        this.save = this.save.bind(this)
    }

    handleChangePassword1(e) {
        this.setState({ password1: e.target.value }, this.setAllow)
    }

    handleChangePassword2(e) {
        this.setState({ password2: e.target.value }, this.setAllow)
    }

    handleChangeOldPassword(e) {
        this.setState({ oldPassword: e.target.value })
    }

    setAllow() {
        if (this.state.password1 === this.state.password2) {
            this.setState({ allow: true })
        } else {
            this.setState({ allow: false })
        }
    }

    save() {
        if (this.state.password1 === this.state.password2) {
            if (this.props.publicKey) {
                if (this.state.oldPassword.length === 0) {
                    this.setState({ oldPassword: true })
                    return
                }
                userStorage.promise.sendPromise({
                    account: true,
                    unlock: true,
                    password: this.state.oldPassword
                })
                    .then(data => {
                        if (data) {
                            userStorage.promise.sendPromise({
                                account: true,
                                encrypt: true,
                                set: this.state.password1
                            })
                                .then(() => {
                                    userStorage.lock.setPassword(true)
                                    userStorage.lock.setLock(false)
                                    userStorage.promise.sendPromise({
                                        account: true,
                                        encrypt: true,
                                        again: true,
                                        data: this.props.user
                                    })
                                    this.props.setPassword(false)
                                })
                        } else {
                            this.setState({ incorrectOld: true })
                        }
                    })
            } else {
                userStorage.lock.setPassword(true)
                userStorage.promise.sendPromise({
                    account: true,
                    encrypt: true,
                    set: this.state.password1
                })
                userStorage.lock.setLock(false)
                this.props.setPassword(false)
            }
        } else {
            this.setState({ incorrectNew: true })
        }
    }

    render() {

        return (

            <div className={styles.main}>

                <div className={styles.content}>
                    <img className={styles.login_logo} src="./images/logo_white.png" onClick={toggleFullScreen}/>

                    {!this.props.publicKey &&
                    <div className={styles.welcome1}>Create</div>
                    }
                    {!this.props.publicKey &&
                    <div className={styles.welcome1}>Password</div>
                    }

                    {!this.props.publicKey &&
                    <div className={styles.welcome2}>Please set a Password to initialize</div>
                    }
                    {!this.props.publicKey &&
                    <div className={styles.welcome2}> the application.</div>
                    }

                </div>

                <div className={styles.form}>

                    {this.props.publicKey && <Input type="password"
                                                    spellCheck={false}
                                                    onChange={this.handleChangeOldPassword}
                                                    value={this.state.oldPassword}
                                                    className={styles.field + ' ' + styles.password + ' ' + (this.state.incorrectOld ? styles.field_incorrect : '')}
                                                    placeholder={'Old password'}
                                                    autoFocus={true}
                    />}

                    <Input type="password"
                           spellCheck={false}
                           onChange={this.handleChangePassword1}
                           value={this.state.password1}
                           className={styles.field + ' ' + styles.password}
                           placeholder={'New password'}
                           autoFocus={true}
                    />

                    <Input type="password"
                           spellCheck={false}
                           onChange={this.handleChangePassword2}
                           value={this.state.password2}
                           className={styles.field + ' ' + styles.password + ' ' + (this.state.incorrectNew ? styles.field_incorrect : '')}
                           placeholder={'Confirm password'}
                    />

                    <div onClick={this.state.allow ? this.save : this.save}
                         className={styles.field + ' ' + styles.button + ' ' + (this.state.allow ? '' : styles.button_disabled)}>Save
                    </div>

                    {this.props.publicKey && <div onClick={() => this.props.setPassword(false)}
                                                  className={styles.field + ' ' + styles.button}>Back</div>}

                    <Separator/>

                </div>
            </div>
        )

    }
}
