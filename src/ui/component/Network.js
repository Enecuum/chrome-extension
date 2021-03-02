import React from "react";
import {Transaction} from "./Transaction";
import styles from "../index.module.css";

export default class Network extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {

        return (
            <div className={styles.main}>

                <div className={styles.form}>

                    <div onClick={() => this.selectNetwork('PULSE')} className={styles.field + ' ' + styles.button}>PULSE</div>

                    <div onClick={() => this.selectNetwork(true)} className={styles.field + ' ' + styles.button}>F3</div>

                    <div onClick={() => this.selectNetwork(true)} className={styles.field + ' ' + styles.button}>BIT</div>

                    <div onClick={() => this.props.setNetwork(false)}
                         className={styles.field + ' ' + styles.button}>&laquo; Back
                    </div>

                </div>
            </div>
        )
    }
}