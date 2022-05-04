import React, {useEffect, useState} from "react";
import styles from "../css/index.module.css";
import Separator from "../elements/Separator";
import {regexToken, shortHash} from "../Utils";
import Input from "../elements/Input";
import {NET, NETWORKS} from "../../utils/names";
import {startPoa} from "../../utils/poa";

export default function Mining(props) {

    let [mining, setMining] = useState(false)
    // let [host, setHost] = useState('')
    // let [hostCorrect, setHostCorrect] = useState(false)
    // let [token, setToken] = useState('')
    // let [tokenCorrect, setTokenCorrect] = useState(false)

    // let [networks, setNetworks] = useState()
    // let [libNetworks, setLibNetworks] = useState([...Object.entries(ENQWeb.Enq.urls)])
    // let [localNetworks, setLocalNetworks] = useState(JSON.parse(localStorage.getItem('networks')) || [])

    // let [showAdd, setShowAdd] = useState(false)

    let startMining = async () => {
        setMining(true)
        let account = await userStorage.user.loadUser()
        console.log(account)
        startPoa(account, account.token, 'test')
    }

    let stopMining = () => {
        setMining(false)
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

            <div onClick={mining ? stopMining : startMining}
                 className={styles.button_round + ' ' + (mining ? styles.mining : '')}>{!mining ? 'START' : 'STOP'}
            </div>

            <Separator/>

        </div>
    )
}
