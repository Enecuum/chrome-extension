import React from "react";
import styles from "../index.module.css";

export default class Requests extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
        this.allow = this.allow.bind(this)
    }

    allow() {
    }

    disallow() {
    }

    render() {

        return (
            <div className={styles.main}>

                <div className={styles.form}>

                    <div onClick={this.allow}
                         className={styles.field + ' ' + styles.button}>Allow
                    </div>

                    <div onClick={this.disallow}
                         className={styles.field + ' ' + styles.button}>Disallow
                    </div>

                </div>

            </div>
        )
    }
}