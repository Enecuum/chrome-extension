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

    async allow() {
        await global.asyncRequest({allow: true, taskId: this.state.taskId})
        this.props.back()
    }

    async disallow() {
        await global.asyncRequest({disallow: true, taskId: this.state.taskId})
        this.props.back()
    }

    render() {

        return (
            <div className={styles.main}>

                <div className={styles.content}>

                    <div className={styles.field + ' ' + styles.text}>This website is requesting access to your account
                        address
                    </div>
                    <div className={styles.field}>{this.state.url}</div>
                </div>

                <div className={styles.form}>

                    {/*<div onClick={this.allow}*/}
                    {/*     className={styles.field}>{this.state.website}*/}
                    {/*</div>*/}

                    <div onClick={this.allow}
                         className={styles.field + ' ' + styles.button + ' ' + styles.green}>Allow
                    </div>

                    <div onClick={this.disallow}
                         className={styles.field + ' ' + styles.button + ' ' + styles.red}>Disallow
                    </div>

                    <div onClick={() => this.props.back()}
                         className={styles.field + ' ' + styles.button + ' ' + styles.back}>Back
                    </div>

                </div>

            </div>
        )
    }
}