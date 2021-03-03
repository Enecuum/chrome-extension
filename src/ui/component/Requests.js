import React from "react";
import styles from "../index.module.css";

export default class Requests extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            website: 'www.example.com'
        }
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
                         className={styles.field}>{this.state.website}
                    </div>

                    <div onClick={this.allow}
                         className={styles.field}>This website request access to your public key
                    </div>

                    <div onClick={this.allow}
                         className={styles.field + ' ' + styles.button}>Allow
                    </div>

                    <div onClick={() => {
                        this.props.setRequests(false)
                    }}
                         className={styles.field + ' ' + styles.button}>Disallow
                    </div>

                </div>

            </div>
        )
    }
}