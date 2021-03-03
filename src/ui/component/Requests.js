import React from "react";
import styles from "../index.module.css";

export default class Requests extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            url: '',
            type: '',
            taskId: ''
        }
        // this.syncRequest = this.syncRequest.bind(this)
        this.allow = this.allow.bind(this)
        this.disallow = this.disallow.bind(this)
        console.log(this)


        this.syncRequest()
    }

    syncRequest() {
        let task = disk.task.loadTask()
        let ids = Object.keys(task)
        if (ids.length > 0) {
            this.state.url = task[ids[0]].cb.url
            this.state.taskId = task[ids[0]].cb.taskId
            this.state.type = task[ids[0]].type
        }
    }

    allow() {

    }

    disallow() {

    }

    render() {
        // this.syncRequest()
        return (
            <div className={styles.main}>

                <div className={styles.form + ' ' + styles.header}>
                    <div className={styles.field + ' ' + styles.text}>{this.state.url}</div>

                    <div className={styles.field + ' ' + styles.text}>{this.state.type}</div>

                </div>

                <div className={styles.form}>

                    <div onClick={this.allow}
                         className={styles.field + ' ' + styles.button}>Allow
                    </div>

                    <div onClick={this.disallow}
                         className={styles.field + ' ' + styles.button}>Disallow
                    </div>

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