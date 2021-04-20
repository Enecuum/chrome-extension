import React from "react";
import styles from "../../css/index.module.css";
import Separator from "../../elements/Separator";

export default class PublicKeyRequest extends React.Component {
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
            this.state.url = this.props.request.cb.url
            this.state.taskId = this.props.request.cb.taskId
            this.state.type = this.props.request.type
        }
    }

    async allow() {
        await global.asyncRequest({allow: true, taskId: this.state.taskId})
        this.props.setPublicKeyRequest(false)
        await this.closeModalWindow()

    }

    async disallow() {
        await global.asyncRequest({disallow: true, taskId: this.state.taskId})
        this.props.setPublicKeyRequest(false)
        await this.closeModalWindow()
    }

    closeModalWindow() {
        let params = getUrlVars()
        if (params.enable) {
            window.close()
        }
    }

    render() {

        return (
            <div className={styles.main}>

                <div className={styles.content}>

                    <div className={styles.request_header} onClick={() => this.props.setPublicKeyRequest(false)}>❮
                        Back
                    </div>

                    <img className={styles.request_logo} src="./images/enq.png"/>

                    <div className={styles.field + ' ' + styles.request_text_gray}>{this.state.url}</div>

                    <div className={styles.request_text1}>
                        <div>This website is requesting</div>
                        <div>access to your account</div>
                        <div>address</div>
                    </div>
                    <div className={styles.field + ' ' + styles.request_text_gray}>Allow this site to:</div>

                    <div className={styles.request_text2}>
                        <img src={'./icons/13.png'}/>
                        <div>View the address of your permitted accounts (required)</div>
                    </div>
                    <div className={styles.request_text2}>
                        <img src={'./icons/13.png'}/>
                        <div>View selected network</div>
                    </div>

                </div>

                <div className={styles.form}>

                    {/*<div onClick={this.allow}*/}
                    {/*     className={styles.field}>{this.state.website}*/}
                    {/*</div>*/}

                    <div onClick={this.allow}
                         className={styles.field + ' ' + styles.button}>Allow
                    </div>

                    <div className={styles.buttons_field}>

                        <div onClick={() => this.props.setPublicKeyRequest(false)}
                             className={styles.field + ' ' + styles.button}>Back
                        </div>

                        <div onClick={this.disallow}
                             className={styles.field + ' ' + styles.button + ' ' + styles.button_blue}>Disallow
                        </div>

                    </div>

                    <Separator/>

                </div>

            </div>
        )
    }
}