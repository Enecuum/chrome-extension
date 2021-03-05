import React from "react";
import styles from "../index.module.css";

let names = {
    enable: 'Share account address',
    tx: 'Sign transaction'
}

export default class Network extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            keys: [],
            requests: {}
        }

        this.getRequests = this.getRequests.bind(this)
    }

    getRequests() {
        let requests = disk.task.loadTask()
        let keys = Object.keys(requests)

        // console.log(tasks)
        // console.log(keys)

        // this.state.keys = keys
        // this.state.requests = tasks

        this.setState({
            keys,
            requests
        })


    }

    render() {

        this.getRequests()

        const items = []

        for (const key of this.state.keys) {
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
                    <div onClick={() => {}}>{items}</div>
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
