import React from "react";
import styles from "../index.module.css";

export default class Network extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            url: '',
            net: String(ENQWeb.Net.currentProvider)
        }
        this.handleChangeNetwork = this.handleChangeNetwork.bind(this)
    }

    setNet(value) {
        this.setState({net: value})
        localStorage.setItem('net', value)

        ENQWeb.Net.provider = value
        disk.user.setNet(value)

        // if (this.props.callback)
        //     this.props.callback()
    }

    handleChangeNetwork(e) {
        this.setState({url: e.target.value}, function () {
            this.checkURL()
        });
    }

    checkURL() {
        console.log(this.state.url)
        ENQWeb.Net.provider = this.state.url
        disk.user.setNet(ENQWeb.Net.currentProvider)
        // let connect = false
        // if (connect) {
        //     console.log('')
        // }
    }

    render() {

        return (
            <div className={styles.main}>

                <div className={styles.form}>

                    <div className={styles.field + ' ' + styles.balance}>Network: {this.state.net.toUpperCase()}</div>

                    {/*<div onClick={() => { this.props.setNet('pulse') }}*/}
                    {/*    className={styles.field + ' ' + styles.button}>PULSE</div>*/}

                    {/*<div onClick={() => {this.setNet('f3')}}*/}
                    {/*     className={styles.field + ' ' + styles.button}>F3</div>*/}

                    <div onClick={() => {
                        this.setNet('bit')
                    }}
                         className={styles.field + ' ' + styles.button}>BIT
                    </div>

                    <input type="text"
                           spellCheck={false}
                           onChange={this.handleChangeNetwork}
                           value={this.state.url}
                           className={styles.field}
                           placeholder={'Custom network url'}
                    />

                    <div onClick={() => {
                        this.props.setNetwork(false)
                    }}
                         className={styles.field + ' ' + styles.button + ' ' + styles.back}>Back
                    </div>

                </div>

            </div>
        )
    }
}