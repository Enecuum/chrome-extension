import React, {useEffect, useState} from "react";
import styles from "../css/index.module.css";
import Separator from "../elements/Separator";
import {regexToken, shortHash} from "../Utils";

export default function Network(props) {

    let [name, setName] = useState('')
    let [host, setHost] = useState('')
    let [hostCorrect, setHostCorrect] = useState(false)
    let [token, setToken] = useState('')
    let [tokenCorrect, setTokenCorrect] = useState(false)

    let [networks, setNetworks] = useState()
    let [libNetworks, setLibNetworks] = useState([...Object.entries(ENQWeb.Enq.urls)])
    let [localNetworks, setLocalNetworks] = useState(JSON.parse(localStorage.getItem('networks')) || [])

    let [showAdd, setShowAdd] = useState(false)

    let checkHost = (host) => {

        setHostCorrect(false)
        setTokenCorrect(false)

        let url
        try {
            url = new URL(host);
        } catch (_) {
            return false;
        }

        try {
            fetch(host + '/api/v1/native_token')
                .then(response => response.json())
                .then(data => {
                    if (data.hash && data.hash.length > 0) {
                        setToken(data.hash)
                        setHostCorrect(true)
                        setTokenCorrect(true)
                    }
                })
                .catch(e => {
                    setHostCorrect(false)
                    fetch(host + '/api/v1/stats')
                        .then(response => response.json())
                        .then(data => {
                            if (data.network_hashrate) {
                                setHostCorrect(true)

                                if (regexToken.test(token))
                                    setTokenCorrect(true)
                            }
                        })
                })
        } catch (e) {
        }
    }

    let addNet = async () => {

        if (!showAdd) {
            setShowAdd(true)
            return
        }

        if (hostCorrect && name.length > 0 && tokenCorrect) {
        } else {
            return
        }

        localNetworks.push({name, host, token})
        localStorage.setItem('networks', JSON.stringify(localNetworks))
        setLocalNetworks(localNetworks)
        renderCards()

        setShowAdd(false)

        setName('')
        setHost('')
        setToken('')

        setHostCorrect(false)
        setTokenCorrect(false)

        let divCards = document.getElementById('network_cards')
        divCards.scrollLeft = divCards.scrollWidth - divCards.clientWidth
    }

    let removeNet = async (name) => {

        let index = localNetworks.findIndex(element => element.name === name)
        localNetworks.splice(index, 1)
        setLocalNetworks(localNetworks)
        localStorage.setItem('networks', JSON.stringify(localNetworks))
        renderCards()
    }

    let setNet = async (value) => {

        console.log(value)

        localStorage.setItem('net', value)
        ENQWeb.Net.provider = value


        await disk.user.loadUser()
            .then(async account => {
                account.net = value
                account.token = ENQWeb.Enq.ticker
                await disk.promise.sendPromise({
                    account: true,
                    set: true,
                    data: account
                })
            })

        cacheTokens().then(() => {
            location.reload(false)
        })
    }

    let renderCards = () => {

        let cards = []

        let currentIndex = libNetworks.findIndex(element => element[1] === ENQWeb.Enq.provider)

        libNetworks.unshift(libNetworks.splice(currentIndex, 1)[0])

        for (let i = 0; i < libNetworks.length; i++) {

            let current = ENQWeb.Enq.provider === libNetworks[i][1]

            cards.push(
                <div key={i + 'lib'} className={styles.card + ' ' + (current ? '' : styles.card_select)}>
                    <div
                        className={styles.card_title}>{libNetworks[i][1].replace('https://', '').replace('.enecuum.com', '').toUpperCase()}</div>
                    <div className={styles.card_field}>{libNetworks[i][1]}</div>
                    <div className={styles.card_field}>{shortHash(ENQWeb.Enq.token[libNetworks[i][1]])}</div>
                    <div className={styles.card_field_select} onClick={(current ? () => {} : () => setNet(libNetworks[i][1]))}>{current ? 'CURRENT' : 'SELECT'}</div>
                </div>
            )
        }

        for (let i = 0; i < localNetworks.length; i++) {

            let current = ENQWeb.Enq.provider === localNetworks[i].host

            cards.push(
                <div key={i + 'local'} className={styles.card + ' ' + (current ? '' : styles.card_select)}>
                    <div className={styles.card_title}>{localNetworks[i].name}</div>
                    <div className={styles.card_field}>{localNetworks[i].host}</div>
                    <div className={styles.card_field}>{shortHash(localNetworks[i].token)}</div>
                    <div className={styles.card_field_select} onClick={(current ? () => {} : () => setNet(localNetworks[i].host))}>{current ? 'CURRENT' : 'SELECT'}</div>
                    <div className={styles.card_field_delete} onClick={() => removeNet(localNetworks[i].name)}>&#x2715;</div>
                </div>
            )
        }

        setNetworks(cards)
    }

    useEffect(() => {
        renderCards()
    }, [])

    return (
        <div className={styles.main}>

            <div className={styles.field} onClick={() => {

                if (showAdd) {
                    setShowAdd(false)
                    return
                }
                props.setNetwork(false)

            }}>❮ Back</div>

            {showAdd && <div className={styles.content}>

                <input type="text"
                       spellCheck={false}
                       onChange={(e) => setName(e.target.value)}
                       value={name}
                       className={styles.field + ' ' + (name.length > 0 ? styles.field_correct : '')}
                       placeholder={'Network short name'}
                />

                <input type="text"
                       spellCheck={false}
                       onChange={async (e) => {
                           setHost(e.target.value)
                           await checkHost(e.target.value)
                       }}
                       value={host}
                       className={styles.field + ' ' + (hostCorrect ? styles.field_correct : '')}
                       placeholder={'Host name, start with https://'}
                />

                <input type="text"
                       spellCheck={false}
                       onChange={(e) => {
                           setToken((e.target.value))
                           setTokenCorrect(regexToken.test(e.target.value))
                       }}
                       value={token}
                    // disabled={tokenCorrect}
                       className={styles.field + ' ' + (tokenCorrect ? styles.field_correct : '')}
                       placeholder={'Token, something like 00000...'}
                />

            </div>}

            {!showAdd && <div className={styles.cards_container}>
                <div className={styles.cards}>
                    {networks}
                </div>
            </div>}

            <div onClick={addNet}
                 className={styles.field + ' ' + styles.button + ' ' + ((hostCorrect && name.length > 0 && tokenCorrect) ? styles.button_blue : '')}>Add
            </div>

            <Separator/>

        </div>
    )
}
