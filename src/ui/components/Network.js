import React, { useEffect, useState } from 'react'
import styles from '../css/index.module.css'
import Separator from '../elements/Separator'
import { regexToken, shortHash } from '../Utils'
import Input from '../elements/Input'
import { NET, NETWORKS } from '../../utils/names'
import {chains} from "../../user";
import Checkbox from "../elements/Checkbox";

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

    const [customPoa, setCustomPoa] = useState(false)
    const [customPoaAddress, setCustomPoaAddress] = useState('')
    const [poaServerCorrect, setPoaServerCorrect] = useState(false)

    const [useCustomPoaPort, setUseCustomPoaPort] = useState(false)
    const [customPoaPort, setCustomPoaPort] = useState('')
    const [customPoaPortCorrect, setCustomPoaPortCorrect] = useState(false)

    const validationPoa = ()=>{
        let valid = true;

        if(useCustomPoaPort){
            valid = valid && customPoaPortCorrect
        }

        if(customPoa){
            valid = valid && poaServerCorrect
        }

        return valid
    }

    let checkHost = (url) => {

        url = url[url.length - 1] === '/' ? url.substr(0, url.length - 1) : url

        setHostCorrect(false)
        setTokenCorrect(false)

        let urlObject
        try {
            urlObject = new URL(url)
        } catch (_) {
            return false
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

            new URL(url)

            if (validURL(url)) {
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

                                    if (regexToken.test(token)) {
                                        setTokenCorrect(true)
                                    }
                                }
                            })
                            .catch(e => {
                            })
                    })
            }
        } catch (e) {
        }
    }

    let addNet = async () => {

        if (!showAdd) {
            setShowAdd(true)
            console.warn('Console settings > Hide network messages')
            return
        }

        if (hostCorrect && name.length > 0 && tokenCorrect && validationPoa()) {
        } else {
            return
        }

        setShowAdd(false)
        let found = false

        // for(let i = 0; i < localNetworks.length; i++){
        //     if(localNetworks[i].host === host){
        //         found = true
        //         console.log("DUPLICATE HOST")
        //     }
        // }

        if (!found) {
            if(!customPoa){
                localNetworks.push({
                    name,
                    host,
                    token,
                    'poa':false,
                    'port':'3000'
                })
            }else{
                localNetworks.push({
                    name,
                    host,
                    token,
                    'poa':customPoaAddress,
                    'port': customPoaPort.length > 0 ? customPoaPort : '3000'
                })
            }
            localStorage.setItem(NETWORKS, JSON.stringify(localNetworks))
        }

        setLocalNetworks(localNetworks)
        renderCards()

        setName('')
        setHost('')
        setToken('')
        setCustomPoaAddress(false)
        setUseCustomPoaPort(false)

        setHostCorrect(false)
        setTokenCorrect(false)
        setPoaServerCorrect(false)
        setCustomPoa(false)
        setCustomPoaPort('')
        setCustomPoaPortCorrect(false)

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

    let setNet = async (value, chain = chains.ENECUUM) => {

        // console.log(value)

        localStorage.setItem(NET, value)
        ENQWeb.Net.provider = value

        // if (chain === chains.ETHEREUM) {
        //     account.type = 3
        // }

        await userStorage.user.loadUser()
            .then(async account => {

                account.net = value
                account.chain = chain
                account.token = ENQWeb.Enq.token[value]

                await userStorage.promise.sendPromise({
                    account: true,
                    set: true,
                    data: account
                })
                    .then(async () => {
                        renderCards()
                        props.updateUserData().then()
                        await asyncRequest({ reject_all: true })
                    })
            })

        //TODO
        // await cacheTokens()
        //     .then(async () => {
                // location.reload(false)
                // props.setNetwork(false)
            // })
    }


    let validURL = (str) => {
        // console.log(str)
        let pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i') // fragment locator

        console.log(!!pattern.test(str))

        return !!pattern.test(str)
    }

    let validWsURL = (str) => {
        // console.log(str)
        let pattern = new RegExp('^(ws[s]?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*')// port and path

        console.log(!!pattern.test(str))

        return !!pattern.test(str)
    }

    let validWsPort = (str) => {
        // console.log(str)
        let pattern = new RegExp('(\\d)')// port

        console.log(!!pattern.test(str))

        return !!pattern.test(str)
    }

    let renderCards = () => {

        // TODO have to fix this in lib

        let cards = []

        // let currentIndex = libNetworks.findIndex(element => element[1] === ENQWeb.Enq.provider)

        // libNetworks.unshift(libNetworks.splice(currentIndex, 1)[0])

        // for (let i = 0; i < libNetworks.length; i++) {
        //


        for (let i = 0; i < 2; i++) {
            let current = ENQWeb.Enq.provider === libNetworks[i][1]
            cards.push(
                <div key={'bit' + 'card' + i} className={styles.card + ' ' + (current ? '' : styles.card_select)}>
                    <div className={styles.card_field}>{libNetworks[i][1].replace('https://', '')
                        .replace('.enecuum.com', '')
                        .toUpperCase()}</div>
                    <div className={styles.card_field}>{libNetworks[i][1]}</div>
                    <div className={styles.card_field}>{shortHash(ENQWeb.Enq.token[libNetworks[i][1]])}</div>
                    <div className={styles.card_field_right_bottom} onClick={(current ? () => {
                    } : () => setNet(libNetworks[i][1]))}>{current ? 'CURRENT' : 'SELECT'}</div>
                </div>
            )
        }


        // }

        for (let i = 0; i < localNetworks.length; i++) {

            let current = ENQWeb.Enq.provider === localNetworks[i].host
            if(localNetworks[i].poa !== undefined && localNetworks[i].poa !== false){
                cards.push(
                    <div key={i + 'card'} className={styles.card + ' ' + (current ? '' : styles.card_select)}>
                        <div className={styles.card_field}><b>{localNetworks[i].name}</b></div>
                        <div className={styles.card_field}>{localNetworks[i].host}</div>
                        <div className={styles.card_field}>{localNetworks[i].poa}:{localNetworks[i].port !== undefined ? localNetworks[i].port:"3000"}</div>
                        <div className={styles.card_field}>{shortHash(localNetworks[i].token)}</div>
                        <div className={styles.card_field_right_bottom} onClick={(current ? () => {
                        } : () => setNet(localNetworks[i].host))}>{current ? 'CURRENT' : 'SELECT'}</div>
                        <div className={styles.card_field_delete}
                             onClick={() => removeNet(localNetworks[i].name)}>&#x2715;</div>
                    </div>
                )
            }else{
                cards.push(
                    <div key={i + 'card'} className={styles.card + ' ' + (current ? '' : styles.card_select)}>
                        <div className={styles.card_field}><b>{localNetworks[i].name}</b></div>
                        <div className={styles.card_field}>{localNetworks[i].host}</div>
                        <div className={styles.card_field}>{shortHash(localNetworks[i].token)}</div>
                        <div className={styles.card_field_right_bottom} onClick={(current ? () => {
                        } : () => setNet(localNetworks[i].host))}>{current ? 'CURRENT' : 'SELECT'}</div>
                        <div className={styles.card_field_delete}
                             onClick={() => removeNet(localNetworks[i].name)}>&#x2715;</div>
                    </div>
                )
            }
        }

        setNetworks(cards)
    }

    let [isEth, setIsEth] = useState(false)
    let [ethNetworks, setEthNetworks] = useState([
        ['GoerliETH', 'https://goerli.infura.io/v3/'],
        ['ETH', 'https://mainnet.infura.io/v3/']
    ])

    useEffect(() => {
        renderCards()
    }, [])

    return (
        <div className={styles.main}>

            <div className={styles.field + ' ' + styles.pointer} onClick={() => {

                if (showAdd) {
                    setShowAdd(false)
                    return
                }
                props.setNetwork(false)
                userStorage.promise.sendPromise({
                    poa: true,
                    update: true,
                    pull: true
                })
                    .then()
            }}>❮ Back</div>

            <div className={styles.welcome3}>ENECUUM NETWORKS</div>

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

                <Checkbox
                    className={styles.smallCheckboxField}
                    placeholder={"Use custom PoA server"}
                    onChange={(e)=>{
                        // console.log(e.target.checked)
                        setCustomPoa(e.target.checked)
                    }}
                />

                {customPoa &&
                    <div>
                        <Input type="text"
                               spellCheck={false}
                               onChange={(e) => {
                                   setPoaServerCorrect(validWsURL(e.target.value))
                                   setCustomPoaAddress((e.target.value))
                                   // setTokenCorrect(regexToken.test(e.target.value))
                               }}
                            // disabled={tokenCorrect}
                               className={styles.field + ' ' + (poaServerCorrect ? styles.field_correct : styles.field_incorrect)}
                               placeholder={'Address of PoA server like 0.0.0.0 or example.com'}
                        />

                        <Checkbox
                            className={styles.smallCheckboxField}
                            placeholder={"Use custom PoA port"}
                            onChange={(e)=>{
                                // console.log(e.target.checked)
                                setUseCustomPoaPort(e.target.checked)
                            }}
                        />

                        {useCustomPoaPort &&
                            <Input type="text"
                                   spellCheck={false}
                                   onChange={(e) => {
                                       setCustomPoaPortCorrect(validWsPort(e.target.value))
                                       setCustomPoaPort((e.target.value))
                                       // setTokenCorrect(regexToken.test(e.target.value))
                                   }}
                                // disabled={tokenCorrect}
                                   className={styles.field + ' ' + (customPoaPortCorrect ? styles.field_correct : styles.field_incorrect)}
                                   placeholder={'Port of PoA server'}
                            />
                        }
                    </div>

                }

            </div>}

            {!showAdd && <div className={styles.cards_container}>
                <div className={styles.cards}>
                    {networks}
                </div>
            </div>}

            <div onClick={addNet}
                 className={styles.field + ' ' + styles.button + ' ' + ((hostCorrect && name.length > 0 && tokenCorrect && validationPoa()) ? styles.button_blue : '')}>Add
            </div>

            {/*<div className={styles.welcome3}>ETHEREUM NETWORKS / INFURA </div>*/}

            {/*<div className={styles.cards_container}>*/}
            {/*    <div className={styles.cards}>*/}

            {/*        <div key={'eth' + 'card'} className={styles.card + ' ' + ((ENQWeb.Enq.provider === ethNetworks[0][1]) ? '' : styles.card_select)}>*/}
            {/*            <div className={styles.card_field}>{ethNetworks[0][1].replace('https://', '').split('.')[0]*/}
            {/*                .toUpperCase()}</div>*/}
            {/*            <div className={styles.card_field}>{ethNetworks[0][1]}</div>*/}
            {/*            <div className={styles.card_field}>{ethNetworks[0][0]}</div>*/}
            {/*            <div className={styles.card_field_right_bottom} onClick={((ENQWeb.Enq.provider === ethNetworks[0][1]) ? () => {} : async () => {*/}
            {/*                setNet(ethNetworks[0][1], chains.ETHEREUM)*/}
            {/*            })}>{(ENQWeb.Enq.provider === ethNetworks[0][1]) ? 'CURRENT' : 'SELECT'}</div>*/}
            {/*        </div>*/}

            {/*        <div key={'eth' + 'card'} className={styles.card + ' ' + ((ENQWeb.Enq.provider === ethNetworks[1][1]) ? '' : styles.card_select)}>*/}
            {/*            <div className={styles.card_field}>{ethNetworks[1][1].replace('https://', '').split('.')[0]*/}
            {/*                .toUpperCase()}</div>*/}
            {/*            <div className={styles.card_field}>{ethNetworks[1][1]}</div>*/}
            {/*            <div className={styles.card_field}>{ethNetworks[1][0]}</div>*/}
            {/*            <div className={styles.card_field_right_bottom} onClick={((ENQWeb.Enq.provider === ethNetworks[1][1]) ? () => {} : async () => {*/}
            {/*                setNet(ethNetworks[1][1], chains.ETHEREUM)*/}
            {/*            })}>{(ENQWeb.Enq.provider === ethNetworks[1][1]) ? 'CURRENT' : 'SELECT'}</div>*/}
            {/*        </div>*/}

            {/*    </div>*/}
            {/*</div>*/}

            {/*<div className={styles.welcome3}>POLYGON NETWORKS / ALCHEMY</div>*/}

            <Separator/>

        </div>
    )
}
