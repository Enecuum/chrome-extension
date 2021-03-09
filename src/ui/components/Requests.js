import React from "react";
import styles from "../index.module.css";

let names = {
    enable: 'Share account address',
    tx: 'Sign transaction'
}

export default class Requests extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            requests: disk.task.loadTask()
        }
    }

    rejectAll() {
    }

    render() {

        const items = []

        for (const key of Object.keys(this.state.requests)) {
            items.push(
                <div onClick={() => {}} className={styles.field + ' ' + styles.button}>
                    {names[this.state.requests[key].type]}
                </div>
            )
        }

        return (
            <div className={styles.main}>

                <div className={styles.header}>

                    <div className={styles.field + ' ' + styles.text}>List of requests</div>

                    {/*ORDER*/}
                    <div onClick={() => {}}>{items}</div>

                    <div onClick={() => this.rejectAll()}
                         className={styles.field + ' ' + styles.button}>Reject all
                    </div>

                </div>

                <div className={styles.form}>
                    <div onClick={() => {
                        this.props.setRequests(false)
                    }}
                         className={styles.field + ' ' + styles.button}>Back
                    </div>
                </div>


            </div>
        )
    }
}
