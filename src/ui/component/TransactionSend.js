import React from "react";
import styles from "../index.module.css";

export class TransactionSend extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            url: `${ENQWeb.Net.provider}/#!/tx/` + this.props.txHash
        }
    }

    render() {
        console.log(`${ENQWeb.Net.provider}/#!/tx/`)
        return (
            <div className={styles.main}>

                <div className={styles.form}>
                    <div className={styles.field}><a href={this.state.url} target="_blank">{this.props.txHash}</a></div>
                </div>

                <div className={styles.form}>
                    <div onClick={() => this.props.setTransaction(false)} className={styles.field + ' ' + styles.button}>&laquo; Back</div>
                </div>
            </div>
        )
    }
}