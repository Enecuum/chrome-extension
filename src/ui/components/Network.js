import React, {useEffect, useState} from "react";
import styles from "../css/index.module.css";
import Separator from "../elements/Separator";
import {regexToken, shortHash} from "../Utils";
import Input from "../elements/Input";
import {NET, NETWORKS} from "../../utils/names";

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

    let checkHost = (url) => {

        url = url[url.length - 1] === '/' ? url.substr(0, url.length - 1) : url;

        setHostCorrect(false)
        setTokenCorrect(false)

        let urlObject
        try {
            urlObject = new URL(url);
        } catch (_) {
            return false;
        }

        // let xhr = new XMLHttpRequest()
        // xhr.open('GET', url + '/api/v1/native_token', true)
        // xhr.onload = () => {
        //     if (xhr.readyState === 4) {
        //         if (xhr.status === 200) {
        //             let data = JSON.parse(xhr.responseText)
        //             if (data.hash && data.hash.length > 0) {
        //                 setHostCorrect(true)
        //                 setHost(url)
        //                 setTokenCorrect(true)
        //                 setToken(data.hash)
        //             }
        //         } else {
        //             let xhr2 = new XMLHttpRequest()
        //             xhr2.open('GET', url + '/api/v1/stats', true)
        //             xhr2.onload = () => {
        //                 if (xhr2.readyState === 4) {
        //                     if (xhr2.status === 200) {
        //                         let data = JSON.parse(xhr2.responseText)
        //                         if (data.network_hashrate) {
        //                             setHostCorrect(true)
        //                             setHost(url)
        //                             if (regexToken.test(token))
        //                                 setTokenCorrect(true)
        //                         }
        //                     }
        //                 }
        //             }
        //             xhr2.send(null)
        //         }
        //     }
        // }
        // xhr.onerror = () => {}
        // xhr.send(null)

        try {
            fetch(url + '/api/v1/native_token')
                .then(response => response.json())
                .then(data => {
                    if (data.hash && data.hash.length > 0) {
                        setHostCorrect(true)
                        setHost(url)
                        setTokenCorrect(true)
                        setToken(data.hash)
                    }
                })
                .catch(e => {
                    setHostCorrect(false)
                    fetch(url + '/api/v1/stats')
                        .then(response => response.json())
                        .then(data => {
                            if (data.network_hashrate) {
                                setHostCorrect(true)
                                setHost(url)

                                if (regexToken.test(token))
                                    setTokenCorrect(true)
                            }
                        })
                        .catch(e => {})
                })
        } catch (e) {}
    }

    let addNet = async () => {

        if (!showAdd) {
            setShowAdd(true)
            console.warn('Console settings > Hide network messages')
            return
        }

        if (hostCorrect && name.length > 0 && tokenCorrect) {
        } else {
            return
        }

        setShowAdd(false)

        localNetworks.push({name, host, token})
        localStorage.setItem(NETWORKS, JSON.stringify(localNetworks))
        setLocalNetworks(localNetworks)
        renderCards()

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
        localStorage.setItem(NETWORKS, JSON.stringify(localNetworks))
        renderCards()
    }

    let setNet = async (value) => {

        // console.log(value)

        localStorage.setItem(NET, value)
        ENQWeb.Net.provider = value

        await userStorage.user.loadUser().then(async account => {

                account.net = value
                account.token = token

                await userStorage.promise.sendPromise({
                    account: true,
                    set: true,
                    data: account
                })
            })

        cacheTokens().then(() => {
            location.reload()
        })
    }

    let renderCards = () => {

        // TODO have to fix this in lib

        let cards = []

        // let currentIndex = libNetworks.findIndex(element => element[1] === ENQWeb.Enq.provider)

        // libNetworks.unshift(libNetworks.splice(currentIndex, 1)[0])

        // for (let i = 0; i < libNetworks.length; i++) {
        //
            let current = ENQWeb.Enq.provider === libNetworks[0][1]

            cards.push(
                <div key={'bit' + 'card'} className={styles.card + ' ' + (current ? '' : styles.card_select)}>
                    <div
                        className={styles.card_field}>{libNetworks[0][1].replace('https://', '').replace('.enecuum.com', '').toUpperCase()}</div>
                    <div className={styles.card_field}>{libNetworks[0][1]}</div>
                    <div className={styles.card_field}>{shortHash(ENQWeb.Enq.token[libNetworks[0][1]])}</div>
                    <div className={styles.card_field_select} onClick={(current ? () => {
                    } : () => setNet(libNetworks[0][1]))}>{current ? 'CONNECTED' : 'SELECT'}</div>
                </div>
            )
        // }

        for (let i = 0; i < localNetworks.length; i++) {

            let current = ENQWeb.Enq.provider === localNetworks[i].host

            cards.push(
                <div key={i + 'card'} className={styles.card + ' ' + (current ? '' : styles.card_select)}>
                    <div className={styles.card_title}>{localNetworks[i].name}</div>
                    <div className={styles.card_field}>{localNetworks[i].host}</div>
                    <div className={styles.card_field}>{shortHash(localNetworks[i].token)}</div>
                    <div className={styles.card_field_select} onClick={(current ? () => {
                    } : () => setNet(localNetworks[i].host))}>{current ? 'CURRENT' : 'SELECT'}</div>
                    <div className={styles.card_field_delete}
                         onClick={() => removeNet(localNetworks[i].name)}>&#x2715;</div>
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

            }}>❮ Back
            </div>

            {showAdd && <div>

                <Input type="text"
                       spellCheck={false}
                       onChange={(e) => setName(e.target.value)}
                       value={name}
                       className={styles.field + ' ' + (name.length > 0 ? styles.field_correct : '')}
                       placeholder={'Network short name'}
                />

                <Input type="text"
                       spellCheck={false}
                       onChange={async (e) => {
                           setHost(e.target.value)
                           checkHost(e.target.value)
                       }}
                       value={host}
                       className={styles.field + ' ' + (hostCorrect ? styles.field_correct : '')}
                       placeholder={'Host name, start with https://'}
                />

                <Input type="text"
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
