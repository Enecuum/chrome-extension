import React from "react";
import styles from "../../index.module.css";

export default class PublicKeyRequests extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            url: 'www.example.com',
            type: '',
            taskId: ''
        }
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
            this.state.taskId = ids[0]
            this.state.type = task[ids[0]].type
        }
    }

    allow() {
        Port.postMessage({allow: true, taskId: this.state.taskId})
        this.props.setRequests(false)
    }

    disallow() {
        Port.postMessage({disallow: true, taskId: this.state.taskId})
        this.props.setRequests(false)
    }

    render() {

        return (
            <div className={styles.main}>

                <div className={styles.form + ' ' + styles.header}>
                    <div className={styles.field + ' ' + styles.text}>{this.state.url}</div>
                    <div className={styles.field + ' ' + styles.text}>{this.state.type}</div>
                </div>

                <div className={styles.form}>

                    {/*<div onClick={this.allow}*/}
                    {/*     className={styles.field}>{this.state.website}*/}
                    {/*</div>*/}

                    <div onClick={this.allow}
                         className={styles.field}>This website request access to your public key
                    </div>

                    <div onClick={this.allow}
                         className={styles.field + ' ' + styles.button}>Allow
                    </div>

                    <div onClick={() => {
                        this.props.setRequests(false)
                        this.disallow()
                    }}
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