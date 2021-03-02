import React from "react";
import styles from "../index.module.css";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
        }
        this.handleChange = this.handleChange.bind(this)
        this.submit = this.submit.bind(this)
        this.generate = this.generate.bind(this)
    }

    handleChange(e) {
        this.setState({value: e.target.value});
    }

    async submit() {
        let publicKey = ENQWeb.Utils.Sign.getPublicKey(this.state.value, true)
        if (publicKey) {
            console.log(publicKey)
            let user = global.disk.user.addUser(publicKey, this.state.value, 'bit')
            this.props.login(user)
        }
    }

    generate() {
        // this.props.login()
    }

    render() {
        return (
            <div className={styles.main}>

                {/*<div className={styles.header}>*/}
                {/*    <div className={styles.title}>Enecuum Network</div>*/}
                {/*</div>*/}

                {/*<div></div>*/}

                {/*<div className={styles.title}>Enecuum Network</div>*/}
                {/*<div className={styles.text}>Devices connect to the Enecuum blockchain and share untapped data*/}
                {/*    processing capacity. The more devices connected, the higher the network speed, with uncapped*/}
                {/*    scalability potential. Connecting millions of distributed devices will create a truly decentralized,*/}
                {/*    secure and stable system.*/}
                {/*</div>*/}

                <div className={styles.form}>

                    <input type="text"
                           onChange={this.handleChange}
                           value={this.state.value}
                           className={styles.field}
                           placeholder={'Private Key'}
                    />

                    <div onClick={this.submit}
                         className={styles.field + ' ' + styles.button}>Login
                    </div>

                    <div onClick={this.props.generate}
                         className={styles.field + ' ' + styles.button}>Generate
                    </div>

                </div>
            </div>
        )
    }
}