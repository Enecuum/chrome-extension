import React from 'react'
import styles from '../../css/index.module.css'
import Separator from '../../elements/Separator'

export default class PublicKeyRequest extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            url: 'enecuum.com',
            type: '',
            taskId: '',
            remember: true
        }
        this.allow = this.allow.bind(this)
        this.disallow = this.disallow.bind(this)
        // console.log(this)


        this.syncRequest()

        let sites = userStorage.sites.getSites()
        if (sites[this.state.url] === true) {
            this.allow().then()
        }
    }

    syncRequest() {
        let task = userStorage.task.loadTask()
        let ids = Object.keys(task)
        if (ids.length > 0) {
            this.state.url = this.props.request.cb.url
            this.state.taskId = this.props.request.cb.taskId
            this.state.type = this.props.request.type
        }
    }

    async allow() {

        await asyncRequest({
            allow: true,
            taskId: this.state.taskId
        }).then(data=>{
            this.props.setBufferMsg(data)
        })

        // let remember = (document.getElementById('checkbox'))

        if (this.state.remember === true) {
            let sites = userStorage.sites.getSites()
            sites[this.state.url] = true
            userStorage.sites.setSites(sites)
        }
        console.log('Remember: ' + this.state.remember)

        this.props.setPublicKeyRequest(false)
        await this.closeModalWindow()

        console.log('TODO bug')
    }

    async disallow() {
        await asyncRequest({
            disallow: true,
            taskId: this.state.taskId
        }).then(data=>{
            this.props.setBufferMsg(data)
        })
        this.props.setPublicKeyRequest(false)
        await this.closeModalWindow()
    }

    closeModalWindow() {
        let params = getUrlVars()
        if (params.type === 'enable') {
            window.close()
        }
    }

    render() {

        return (
            <div className={styles.main}>

                <div className={styles.content}>

                    <div className={styles.request_header} onClick={() => this.props.setPublicKeyRequest(false)}></div>

                    <img className={styles.request_logo} src="./images/enq.png"/>

                    <div className={styles.field + ' ' + styles.request_text_gray}>{this.state.url}</div>

                    <div className={styles.request_text1}>
                        <div>This website is requesting</div>
                        <div>access to your account</div>
                        <div>address</div>
                    </div>
                    <div className={styles.field + ' ' + styles.request_text_gray}>Allow this site to:</div>

                    <div className={styles.request_text2 + ' ' + styles.checkbox}>
                        <img src={'./images/icons/checkbox2.png'}/>
                        <div>View the address of your permitted accounts (required)</div>
                    </div>

                    <div className={styles.request_text2 + ' ' + styles.checkbox}>
                        <img src={'./images/icons/checkbox2.png'}/>
                        <div>View selected network (required)</div>
                    </div>

                    <div className={styles.request_text2 + ' ' + styles.checkbox} onClick={() => {
                        this.setState({remember: !this.state.remember})
                    }}>
                        {/*<input id="checkbox" type="checkbox"/>*/}
                        {this.state.remember ? <img src={'./images/icons/checkbox2.png'}/> : <img src={'./images/icons/checkbox1.png'}/>}
                        <div>Remember this site</div>
                    </div>

                </div>

                <div className={styles.form}>

                    {/*<div onClick={this.allow}*/}
                    {/*     className={styles.field}>{this.state.website}*/}
                    {/*</div>*/}

                    <div onClick={this.disallow}
                         className={styles.field + ' ' + styles.button}>Disallow
                    </div>

                    <div onClick={this.allow}
                         className={styles.field + ' ' + styles.button + ' ' + styles.button_blue}>Allow
                    </div>

                    <div className={styles.buttons_field}>

                        {/*<div onClick={() => this.props.setPublicKeyRequest(false)}*/}
                        {/*     className={styles.field + ' ' + styles.button}>Back*/}
                        {/*</div>*/}

                    </div>

                    <Separator/>

                </div>

            </div>
        )
    }
}
