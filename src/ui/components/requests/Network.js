import React from "react";
import styles from "../../css/index.module.css";
import Separator from "../../elements/Separator";
import {regexAddress, shortHash, shortHashLong} from "../../Utils";

export default class Network extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            host: ''
        }
        this.handleChangeNetwork = this.handleChangeNetwork.bind(this)
    }

    setNet = async () => {

        let value = this.state.host
        // console.log(value)

        localStorage.setItem('net', value)
        ENQWeb.Net.provider = value


        await disk.user.loadUser()
            .then(async account => {
                account.net = value
                account.token = ENQWeb.Enq.ticker
                await disk.promise.sendPromise({
                    account: true,
                    set: true,
                    data: account
                })
            })

        cacheTokens().then(() => {
            location.reload(false)
        })
    }

    handleChangeNetwork(e) {
        this.setState({host: e.target.value}, function () {
            // this.checkURL()
        });
    }

    checkURL() {
        // console.log(this.state.url)
        // ENQWeb.Net.provider = this.state.url
        // disk.user.setNet(ENQWeb.Net.currentProvider)

        // let connect = false
        // if (connect) {
        //     console.log('')
        // }
    }

    render() {

        return (
            <div className={styles.main}>

                <div>

                    <div className={styles.field}>
                        Network: {ENQWeb.Net.currentProvider.toUpperCase()}
                    </div>

                    <div className={styles.field}>
                        Token: {shortHash(ENQWeb.Enq.token[ENQWeb.Net.provider])}
                    </div>

                </div>

                <div className={styles.form}>

                    <input type="text"
                           spellCheck={false}
                           onChange={this.handleChangeNetwork}
                           value={this.state.host}
                           className={styles.field}
                           placeholder={'Host'}
                    />

                    <div onClick={this.setNet}
                         className={styles.field + ' ' + styles.button + ' ' + (regexAddress.test(this.state.address) ? styles.button_blue : '')}>Set
                    </div>

                    <div onClick={() => {this.props.setNetwork(false)}}
                         className={styles.field + ' ' + styles.button + ' ' + styles.button_blue}>Back
                    </div>

                    <Separator/>

                </div>

            </div>
        )
    }
}
