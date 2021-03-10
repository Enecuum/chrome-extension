import React from "react";
import styles from "../index.module.css";
import PublicKeyRequests from "./requests/PublicKeyRequest";
import TransactionRequest from "./requests/TransactionRequest";

let names = {
    enable: 'Share account address',
    tx: 'Sign transaction'
}

export default class Requests extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            requests: disk.list.listOfTask(), // массив самих объектов
            ids: disk.list.loadList(), // массив очереди идентификаторов
            publicKeyRequest: null,
            transactionRequest: null,
            taskId: null
        }

        this.back = this.back.bind(this)
    }

    back() {
        this.setState({
            publicKeyRequest: null,
            transactionRequest: null
        })
    }

    rejectAll() {
    }

    render() {

        if (this.state.publicKeyRequest) {
            return <PublicKeyRequests back={this.back} request={this.state.publicKeyRequest}
                                      taskId={this.state.taskId}/>
        }

        if (this.state.transactionRequest) {
            return <TransactionRequest back={this.back} request={this.state.transactionRequest}
                                       taskId={this.state.taskId}/>
        }

        const items = []

        for (let key in this.state.requests) {
            let item = this.state.requests[key]
            items.push(
                <div key={key} onClick={() => {

                    if (item.type === 'enable')
                        this.setState({publicKeyRequest: item, taskId: this.state.ids[key]})
                    else
                        this.setState({transactionRequest: item, taskId: this.state.ids[key]})

                }} className={styles.field + ' ' + styles.button}>
                    {names[item.type]}
                </div>
            )
        }

        return (
            <div className={styles.main}>

                <div className={styles.header}>

                    <div className={styles.field + ' ' + styles.text}>List of
                        requests: {Object.keys(this.state.requests).length}</div>

                    {items}

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
