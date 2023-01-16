import React from 'react'
import styles from '../css/index.module.css'
import Separator from '../elements/Separator'
import { toggleFullScreen } from '../Utils'
import Input from '../elements/Input'
import { NativeBiometric } from 'capacitor-native-biometric'
import { PASSWORD_VERSION } from '../../utils/names'

export default class Lock extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            password: '',
            incorrect: false
        }
        this.handleChangePassword = this.handleChangePassword.bind(this)
        this.submit = this.submit.bind(this)
        this.logout = this.logout.bind(this)
        this.bio = this.bio.bind(this)
        this.submitBiometry = this.submitBiometry.bind(this)
        // this.setConfirm = props.setConfirm
        window.scrollTo(0, 0)
    }

    handleChangePassword(e) {
        this.setState({ password: e.target.value })
    }

    async logout() {
        await this.props.logout()
        // await userStorage.promise.sendPromise({account: true, logout: true})
    }

    async bio() {
        try {
            NativeBiometric.isAvailable()
                .then(() => {
                    NativeBiometric.verifyIdentity({
                        reason: 'For easy log in',
                        title: 'Log in PWA Enecuum',
                        subtitle: '',
                        description: '',
                    })
                        .then(data => {
                                userStorage.promise.sendPromise({
                                    biometry: true,
                                    get: true
                                })
                                    .then(async data => {
                                        await this.submitBiometry(data.password)
                                    })
                                    .catch(e => {
                                        console.warn(e)
                                    })

                            }
                        )
                        .catch(() => {
                            console.warn('cancel')
                        })
                })
                .catch(() => {
                    console.warn('nio no support')
                })
        } catch (e) {
            console.warn(e)
        }
    }

    async submitBiometry(password) {
        let user = await userStorage.promise.sendPromise({
            account: true,
            unlock: true,
            password: password
        })

        if (user) {
            this.props.unlock(user)
        } else {
            console.warn('something wrong...')
        }
    }

    async submit() {

        // let hash = ENQWeb.Utils.crypto.strengthenPassword('salt*/-+^' + this.state.password)
        // if (userStorage.lock.unlock(hash)) {
        //     hash = ENQWeb.Utils.crypto.strengthenPassword('salt*/-+^' + hash)
        //     let us = JSON.parse(ENQWeb.Utils.crypto.decrypt(userStorage.user.loadUserNotJson(), hash))
        //     console.log(us)
        //     userStorage.user.changeUser(us, true)
        //     this.props.unlock()
        //     window.location.reload(false);
        // }
        let user = await userStorage.promise.sendPromise({
            account: true,
            unlock: true,
            password: this.state.password
        })

        if (user) {
            this.props.unlock(user)
        } else {
            this.setState({ incorrect: true })
            setTimeout(() => {
                this.setState({ incorrect: false })
            }, 1000)
        }
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
                           autoFocus={true}
                           enter={this.submit}
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

                    {this.props.getBiometry() ?
                        <div onClick={this.bio} className={`${styles.field} ${styles.button}`}>Bio</div> : ''}

                    <Separator/>

                </div>
            </div>
        )
    }
}
