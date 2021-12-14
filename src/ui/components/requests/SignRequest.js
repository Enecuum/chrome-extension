import React, {useState, useEffect} from 'react'
import styles from '../../css/index.module.css'
import Separator from '../../elements/Separator'


import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import Eth from "@ledgerhq/hw-app-eth";

export default function SignRequest(props) {

    //TODO
    // const [taskId, setTaskId] = useState(props.request.cb.taskId)
    const [taskId, setTaskId] = useState(props.request.cb.taskId)
    const [url, setUrl] = useState(props.request.cb.url)
    const [msg, setMsg] = useState(props.request.data.msg)
    const [hash, setHash] = useState(props.request.data.hash)

    const closeModalWindow = () => {
        let params = getUrlVars()
        if (params.type === 'sign') {
            window.close()
        }
    }


    const allow = () => {
        props.setSignRequest(false);
        closeModalWindow();
    }

    const ledgerAllow = async () => {

        let transport = await props.getLedgerTransport();
        const eth = new Eth(transport);
        let signedMsg = await eth.signPersonalMessage("44'/60'/0'/0/0", hash).then(result => {
            let v = result['v'] - 27;
            v = v.toString(16);
            if (v.length < 2) {
                v = "0" + v;
            }
            let signature = "0x" + result['r'] + result['s'] + v
            return {signature: signature, r: result['r'], s: result['s'], v: v}
        })
        signedMsg.msg = msg;
        signedMsg.hash = hash;
        console.log(signedMsg)
        userStorage.task.resultTask(taskId, signedMsg)
        props.setSignRequest(false);
        await asyncRequest({allow: true, taskId: taskId})
        closeModalWindow();
    }

    const disallow = async () => {
        await asyncRequest({
            disallow: true,
            taskId: taskId
        })
        props.setSignRequest(false);
        closeModalWindow();
    }

    useEffect(() => {
        console.log(props)
    }, [])

    return (
        <div className={styles.main}>

            <div className={styles.content}>

                <div className={styles.request_header} onClick={() => props.setSignRequest(false)}></div>

                <img className={styles.request_logo} src="./images/enq.png"/>

                <div className={styles.field + ' ' + styles.request_text_gray}>{url}</div>

                <div className={styles.request_text1}>
                    <div>This website is requesting</div>
                    <div>sign message:</div>
                </div>
                <div className={styles.request_text2}>
                    <div>{msg}</div>
                </div>
            </div>

            <div className={styles.form}>

                {/*<div onClick={this.allow}*/}
                {/*     className={styles.field}>{this.state.website}*/}
                {/*</div>*/}

                {/*<div onClick={allow}*/}
                {/*     className={styles.field + ' ' + styles.button}>Sign*/}
                {/*</div>*/}

                <div className={styles.buttons_field}>

                    {/*<div onClick={() => this.props.setPublicKeyRequest(false)}*/}
                    {/*     className={styles.field + ' ' + styles.button}>Back*/}
                    {/*</div>*/}


                </div>

                <div onClick={ledgerAllow}
                     className={styles.field + ' ' + styles.button}>Sign use ledger
                </div>

                <div onClick={disallow}
                     className={styles.field + ' ' + styles.button + ' ' + styles.button_blue}>Disallow
                </div>

                <Separator/>

            </div>

        </div>
    )
}
