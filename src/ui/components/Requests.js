import React from "react";
import styles from "../css/index.module.css";
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
            taskId: null,
            items: []
        }

        this.back = this.back.bind(this)
        this.selectRequest = this.selectRequest.bind(this)
    }

    componentDidMount() {
        this.selectRequest()
    }

    selectRequest() {

        if (this.state.requests.length === 1) {
            if (this.state.requests[0].type === 'enable')
                this.selectPublicKeyRequest(this.state.requests[0], this.state.ids[0])
            else
                this.selectTransactionRequest(this.state.requests[0], this.state.ids[0])

            return
        }

        if (this.state.requests.length === 0) {
            this.props.setRequests(false)
        }

        const items = []

        for (let key in this.state.requests) {
            let item = this.state.requests[key]
            items.push(
                <div key={key} onClick={() => {

                    if (item.type === 'enable')
                        this.selectPublicKeyRequest(item, this.state.ids[key])
                    else
                        this.selectTransactionRequest(item, this.state.ids[key])

                }} className={styles.field + ' ' + styles.button}>
                    {names[item.type]}
                </div>
            )
        }

        this.setState({
            items
        })
    }

    back() {
        this.setState({
            requests: disk.list.listOfTask(),
            ids: disk.list.loadList(),
            publicKeyRequest: null,
            transactionRequest: null,
            taskId: null,
            items: []
        }, () => this.selectRequest())
    }

    async rejectAll() {
        await global.asyncRequest({reject_all: true})
        this.setState({
            requests: [],
            ids: [],
            publicKeyRequest: null,
            transactionRequest: null
        })
        window.location.reload(false);
    }

    selectPublicKeyRequest(request, taskId) {
        this.setState({publicKeyRequest: request, taskId: taskId})
    }

    selectTransactionRequest(request, taskId) {
        this.setState({transactionRequest: request, taskId: taskId})
    }

    render() {

        let back = this.state.requests.length === 1 ? () => this.props.setRequests(false) : this.back

        return (
            <div className={styles.main}>

                <div className={styles.content}>

                    <div className={styles.field + ' ' + styles.text}>List of
                        requests: {Object.keys(this.state.requests).length}</div>

                    {this.state.items}

                    <div onClick={() => this.rejectAll()}
                         className={styles.field + ' ' + styles.button + ' ' + styles.red}>Reject all
                    </div>

                </div>

                <div className={styles.form}>
                    <div onClick={() => {
                        this.props.setRequests(false)
                    }}
                         className={styles.field + ' ' + styles.button + ' ' + styles.back}>Back
                    </div>
                </div>


            </div>
        )
    }
}
