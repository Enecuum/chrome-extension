import React from "react";
import styles from "../index.module.css";

export default class Network extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            keys: ['one', 'two'],
            request: ''
        }
    }

    getRequests() {
        let tasks = disk.task.loadTask()
        let keys = Object.keys(tasks)
        console.log(tasks)
    }

    render() {

        this.getRequests()

        const items = []

        for (const key of this.state.keys) {
            items.push(<div onClick={() => {
            }} className={styles.field + ' ' + styles.button}>Transaction</div>)
        }

        return (
            <div className={styles.main}>

                <div className={styles.header}>
                    <div className={styles.field + ' ' + styles.text}>List of requests</div>
                    <div onClick={() => {}}>{items}</div>
                </div>

                <div className={styles.form}>
                    <div onClick={() => {
                        this.props.setNetwork(false)
                    }}
                         className={styles.field + ' ' + styles.button}>Back
                    </div>
                </div>


            </div>
        )
    }
}