import React from "react";
import styles from "../css/index.module.css";
import Separator from "../elements/Separator";
import {explorerTX} from "../Utils";

export default class TransactionSend extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            url: `${ENQWeb.Net.provider}/#!/tx/` + this.props.txHash
        }
    }

    copyHash() {
        navigator.clipboard.writeText(this.props.txHash)
    }

    render() {
        // console.log(`${ENQWeb.Net.provider}/#!/tx/`)
        return (
            <div className={styles.main}>

                <div className={styles.content}>

                    <div className={styles.request_header} onClick={() => this.props.setTransaction(false)}>❮ Back</div>

                    <div className={styles.balance}>TX</div>

                    <div className={styles.field}>{shortHash(this.props.txHash)}</div>


                    {/*<div className={styles.field}>From: {this.state.from}</div>*/}
                    {/*<div className={styles.field}>To: {this.state.to}</div>*/}
                    {/*<div className={styles.field}>Amount: {this.state.amount}</div>*/}
                    {/*<div className={styles.field}>Date: {this.state.date}</div>*/}
                    {/*<div className={styles.field}>Net: {this.state.net}</div>*/}

                </div>

                <div className={styles.form}>

                    <div className={styles.field + ' ' + styles.button}
                         onClick={() => explorerTX(this.props.txHash)}>Open transaction page
                    </div>

                    <div className={styles.field + ' ' + styles.button}
                         onClick={() => this.copyHash()}>Copy transaction hash
                    </div>

                    <div onClick={() => this.props.setTransaction(false)}
                         className={styles.field + ' ' + styles.button}>Back
                    </div>

                    <Separator/>

                </div>
            </div>
        )
    }
}

const shortHash = (address) => {
    return address.substring(0, 10) + '...' + address.substring(address.length - 3, address.length - 1)
}
