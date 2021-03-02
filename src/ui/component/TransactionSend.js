import React from "react";
import styles from "../index.module.css";

export class TransactionSend extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            url: "https://bit.enecuum.com/#!/tx/" + this.props.txHash
        }
    }

    render() {

        return (
            <div className={styles.main}>

                <div className={styles.form}>
                    <div className={styles.field}><a href={this.state.url}>{this.props.txHash}</a></div>
                </div>

                <div className={styles.form}>
                    <div onClick={() => this.props.setTransaction(false)} className={styles.field + ' ' + styles.button}>&laquo; Back</div>
                </div>
            </div>
        )
    }
}