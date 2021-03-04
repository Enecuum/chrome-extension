import React from "react";
import styles from "../index.module.css";

export default class Network extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {

        return (
            <div className={styles.main}>

                <div className={styles.form}>

                    <div onClick={() => {}} className={styles.field + ' ' + styles.button}>Public key request</div>

                    <div onClick={() => {}} className={styles.field + ' ' + styles.button}>Transaction request</div>

                </div>

            </div>
        )
    }
}