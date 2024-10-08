import React, { useState, useEffect } from 'react'
import elements from '../css/elements.module.css'
import { copyToClipboard, shortHash } from '../Utils'
import styles from '../css/index.module.css'
import { apiController } from '../../utils/apiController'

const copyText = ('\n\nCopy address to clipboard').toUpperCase()

export default function Address(props) {

    let [status, setStatus] = useState('')

    let [blockDate, setBlockDate] = useState(new Date(userStorage.block.getBlock().time !== undefined ? userStorage.block.getBlock().time * 1000 : 0))
    let [blockN, setBlockN] = useState(userStorage.block.getBlock().n || 0)

    let [accountName, setAccountName] = useState(localStorage.getItem('accountName') || 'M1')

    async function checkConnect(count) {
        // console.log(count)
        let tasks = userStorage.list.listOfTask()
        let found = false
        tasks.forEach(key => {
            if (key.type === 'enable') {
                setStatus('Await connect')
                found = true
            }
        })
        if (count === 0 && !found) {
            return setStatus(`Not connected`)
        } else if (count > 0 && !found) {
            return setStatus(`Connected ${count}`)
        }
    }

    let getBlock = async () => {
        let block = await apiController.getCurrentBlock()
        userStorage.block.setBlock(block)
        setBlockN(block.n)
        setBlockDate(new Date(block.time * 1000))
    }

    useEffect(() => {
        checkConnect(props.connectionsCounter)
            .then()
        // TODO
        let a = setInterval(() => {
            checkConnect(props.connectionsCounter)
                .then()
        }, 1000)
    })

    useEffect(() => {
        getBlock()
            .then()
    }, [props.token])

    const showConnections = async () => {

        if (status === 'Await connect') {

            let tasks = userStorage.list.listOfTask()

            //TODO rename enable please, allow website access or something
            tasks.forEach((task, request) => {
                // console.log(request)
                // console.log(task)
                if (task.type === 'enable') {
                    // console.log(task)
                    props.setPublicKeyRequest(task)
                }
            })
        }
        // const favorite = (await asyncRequest({favoriteList: true})).ports
        // if (status.startsWith('Connected') || favorite.length > 0) {
        //
        //     const ports = (await asyncRequest({connectionList: true})).ports
        //     props.setConnects(ports)
        // }
        const ports = (await asyncRequest({ connectionList: true })).ports
        props.setConnects(ports)
    }

    // const copyPublicKey = () => {
    //     if (navigator.clipboard) {
    //         navigator.clipboard.writeText(props.publicKey)
    //         props.setCopied(true)
    //     } else {
    //         console.error('navigator.clipboard: ' + false)
    //     }
    // }

    const copyPublicKey = () => {
        copyToClipboard(props.publicKey)
        props.setCopied(true)
    }

    const update = () => {
        props.getBalance()
            .then()
    }

    return (
        <div className={elements.address_row}>

            {!props.isMainToken ?
                <div onClick={props.setMainToken}>❮ Back</div> :
                <div className={elements.connect} onClick={showConnections}>·&nbsp;&nbsp;{status}</div>}

            {/*{console.log(props.isMainToken)}*/}

            <div>
                <div className={elements.account_name}>Account {accountName}</div>
                <div className={elements.address_string + ' ' + (props.isCopied ? elements.copied : '')}
                     onClick={copyPublicKey}
                     title={props.publicKey + copyText}>{shortHash(props.publicKey)}</div>
            </div>

            <div className={elements.block} onClick={update}>
                <div>{blockN}</div>
                <div>{blockDate.toLocaleDateString()}</div>
                <div>{blockDate.toLocaleTimeString()}</div>
            </div>

        </div>
    )
}
