import React from "react";
import styles from "../index.module.css";
import TransactionSend from "./TransactionSend";

export default class Receive extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {

        return (

            <div className={styles.main}>

                <div className={styles.form}>

                </div>

                <div className={styles.form}>

                    <div onClick={() => this.props.setReceive(false)}
                         className={styles.field + ' ' + styles.button + ' ' + styles.back}>Back
                    </div>

                </div>
            </div>
        )

    }
}