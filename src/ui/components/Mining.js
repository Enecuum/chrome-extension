import React, {useEffect, useState} from "react";
import styles from "../css/index.module.css";
import Separator from "../elements/Separator";
import {regexToken, shortHash} from "../Utils";
import Input from "../elements/Input";
import {NET, NETWORKS} from "../../utils/names";
import {startPoa} from "../../utils/poa";
import {Publisher} from "../../utils/poa/Publisher";

let status = {
    0: 'CONNECTING',
    1: 'MINING',
    2: 'CLOSING',
    3: 'CLOSED',
    10: 'DUPLICATE KEY',
}

export default function Mining(props) {

    let [readyState, setReadyState] = useState(global.publisher.ws.readyState)

    // let [connect, setConnect] = useState(false)

    // let [host, setHost] = useState('')
    // let [hostCorrect, setHostCorrect] = useState(false)
    // let [token, setToken] = useState('')
    // let [tokenCorrect, setTokenCorrect] = useState(false)

    // let [networks, setNetworks] = useState()
    // let [libNetworks, setLibNetworks] = useState([...Object.entries(ENQWeb.Enq.urls)])
    // let [localNetworks, setLocalNetworks] = useState(JSON.parse(localStorage.getItem('networks')) || [])

    // let [showAdd, setShowAdd] = useState(false)

    let startMining = () => {

        userStorage.user.loadUser().then(account => {

            global.publisher = new Publisher(account, account.token)

            console.log(global.publisher.ws)

            global.publisher.ws.addEventListener('open', function (event) {
                setReadyState(publisher.ws.readyState)
            })

            global.publisher.ws.addEventListener('close', function (event) {
                setReadyState(publisher.ws.readyState)
            })

            global.publisher.ws.addEventListener('error', function (event) {
                console.log(event)
                setReadyState(publisher.ws.readyState)

            })
        })
    }

    useEffect(() => {
    }, [])

    let stopMining = () => {
        global.publisher.ws.close()
    }

    useEffect(() => {

    }, [])

    return (
        <div className={styles.main}>

            <div className={styles.field + ' ' + styles.pointer} onClick={() => {
                props.setMining(false)
            }}>❮ Back
            </div>

            {/*<Separator/>*/}

            <div onClick={readyState === 1 ? stopMining : startMining}
                 className={styles.button_round + ' ' + (readyState === 1 ? styles.mining : '')}>{readyState === 1 ? 'STOP' : 'START'}
            </div>

            <div className={styles.mining_status}>{status[readyState]}</div>

            <Separator/>

        </div>
    )
}
