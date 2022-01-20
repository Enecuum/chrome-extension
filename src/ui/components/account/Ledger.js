import React, {useEffect, useState} from 'react'
import styles from '../../css/index.module.css'
import Separator from '../../elements/Separator'
import {explorerAddress, getMnemonicPrivateKeyHex, ledgerPath, regexToken, shortHash} from '../../Utils'
import Input from '../../elements/Input'
import * as bip39 from 'bip39'
import * as bip32 from 'bip32'
import {createPopupWindow, createTabWindow} from '../../../handler'
// import eventBus from "../../../utils/eventBus";
import {signHash, getVersion, getPublicKey} from '../../../utils/ledgerShell'
import TransportWebHID from '@ledgerhq/hw-transport-webhid'
import {generateAccountData, generateLedgerAccountData} from '../../../user'
import TransportWebUSB from '@ledgerhq/hw-transport-webusb'
import Eth from '@ledgerhq/hw-app-eth'
import elements from '../../css/elements.module.css'
import {copyText} from '../../../utils/names'
import Back from "../../elements/Back";

// let balance = {}

export default function Ledger(props) {

    let [accountsList, setAccountsList] = useState()

    let [name, setName] = useState('')
    let [host, setHost] = useState('')
    let [hostCorrect, setHostCorrect] = useState(false)

    let [token, setToken] = useState('')
    let [tokenCorrect, setTokenCorrect] = useState(false)

    let [keys, setKeys] = useState()
    let [accounts, setAccounts] = useState([])
    let [cards1, setCards1] = useState([])
    let [cards2, setCards2] = useState([])
    let [cards3, setCards3] = useState([])

    let [showAdd, setShowAdd] = useState(false)

    let [seed, setSeed] = useState(false)
    let [ledger, setLedger] = useState(false)

    let [balance, setBalance] = useState({})

    let [copied, setCopied] = useState()

    useEffect(() => {
        loadUser()
    }, [balance, copied])

    let requestBalance = async (publicKey) => {
        if (!balance[publicKey] && balance[publicKey] !== 0)
            await ENQWeb.Net.get.getBalanceAll(publicKey).then((res) => {
                balance[publicKey] = res[0] ? res[0].amount : 0
                setBalance(balance)
                // console.log(balance)

                if (balance[publicKey] > 0)
                    loadUser()
            })
    }

    let buildAccountsArray = async (account) => {

        // console.log(account)

        const mainPublicKey = account.type === 2 || account.privateKey < 3 ? account.publicKey : ENQWeb.Utils.Sign.getPublicKey(account.privateKey, true)

        for (let i = 0; i < account.ledgerAccountsArray.length; i++) {
            let publicKey = account.ledgerAccountsArray[i]
            let current = account.publicKey === publicKey
            accounts.push({
                privateKey: i,
                publicKey: publicKey,
                amount: balance[publicKey],
                current,
                groupIndex: i,
                type: 2
            })
            requestBalance(publicKey).then(r => {
            })
        }

        setAccounts(accounts)

        return accounts
    }

    let loadUser = () => {
        userStorage.user.loadUser().then(async account => {
            // console.log(account)
            let accounts = await buildAccountsArray(account)
            renderCards(accounts, null)
        })
    }

    let addLedgerAccount = async (ledgerPublicKey) => {

        let account = (await userStorage.user.loadUser())
        let data = generateLedgerAccountData(account.ledgerAccountsArray.length, account)

        data.publicKey = ledgerPublicKey
        data.ledgerAccountsArray.push(ledgerPublicKey)
        data.ledger = ''

        await userStorage.promise.sendPromise({
            account: true,
            set: true,
            data: data
        })

        loadUser()
    }

    let getType = (type) => {
        if (type === 0) {
            return 'SIMPLE'
        }
        if (type === 1) {
            return 'MNEMONIC'
        }
        if (type === 2) {
            return 'LEDGER'
        }
    }

    let renderCards = (accounts, hex) => {

        // let accounts1 = accounts.filter(item => item.type === 0)
        // let accounts2 = accounts.filter(item => item.type === 1)
        let accounts3 = accounts.filter(item => item.type === 2)

        // setCards1(generateCards(accounts1))
        // setCards2(generateCards(accounts2))
        setCards3(generateCards(accounts3))
    }

    let generateCards = (accounts) => {

        let cards = []

        for (let i = 0; i < accounts.length; i++) {

            let account = accounts[i]
            let current = account.current

            let name = getType(account.type).charAt(0).replace('S', '')
                + (account.groupIndex + 1)

            cards.push(
                <div key={i}
                     className={styles.card + (current ? '' : ' ' + styles.card_select) + ' ' + styles.small}>

                    <div className={styles.row}>
                        <div>Account {name}</div>
                        <div>{getType(account.type)}</div>
                    </div>

                    {/*<div className={styles.card_field + ' ' + styles.buttonLink}*/}
                    {/*     onClick={() => explorerAddress(account.publicKey)}>{shortHash(account.publicKey)}</div>*/}

                    <div
                        className={styles.card_field + ' ' + (copied && account.publicKey === copied ? styles.card_field_copied : styles.card_field_not_copied)}
                        onClick={() => copyPublicKey(account.publicKey)}
                        title={account.publicKey + copyText}>{shortHash(account.publicKey)}</div>

                    <div className={styles.card_field + ' ' + styles.card_field_amount}
                         title={Number(account.amount) / 1e10 + ''}>
                        {(account.amount > 0 ?
                                (Number(account.amount) / 1e10).toFixed(4)
                                :
                                '0.0')

                            + ' BIT'}
                    </div>

                    {/*<div className={styles.card_field_select + ' ' + (current ? '' : 'select')}*/}
                    {/*     onClick={(current ? () => {*/}
                    {/*         props.setKeys(true)*/}
                    {/*     } : () => selectAccount(account))}>{current ? 'CURRENT' : ''}</div>*/}

                    <div className={styles.card_buttons}>

                        <div className={current ? styles.card_button_current : ''}
                             onClick={(current ? () => {} : () => selectAccount(account))}>
                            {current ? 'CURRENT' : 'SELECT'}
                        </div>

                        <div onClick={() => {
                            props.setKeys(account)
                        }}>
                            DETAILS
                        </div>

                    </div>

                </div>
            )
        }

        return cards
    }

    const copyPublicKey = (publicKey) => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(publicKey)
            setCopied(publicKey)
        } else {
            console.error('navigator.clipboard: ' + false)
        }
    }

    // let connectLedgerEth = async () => {
    //
    //     // TransportWebUSB.list().then(devices => {
    //     //     console.log(devices)
    //     //     let output = devices.length > 0 && devices.find(device => device.manufacturerName === 'Ledger')
    //     //     console.log(!!output)
    //     //     setUsbDevice(!!output)
    //     // })
    //
    //     return await TransportWebUSB.create()
    //         .then(async transport => {
    //
    //             const eth = new Eth(transport)
    //
    //             console.log(eth)
    //
    //             let account = (await userStorage.user.loadUser())
    //
    //             eth.getAddress(ledgerPath + account.ledgerAccountsArray.length)
    //                 .then(o => {
    //
    //                     if (!ledger) {
    //                         setLedger(true)
    //                     } else {
    //                         addLedgerAccount(o.address)
    //                     }
    //                     console.log(o.address)
    //
    //                 })
    //                 .catch(e => {
    //                     setLedger(false)
    //                 })
    //         })
    // }

    let connectLedger = () => {

        if (getUrlVars().popup) {
            createTabWindow('?type=ledger')
        } else

            userStorage.user.loadUser().then(async account => {

                // TODO global transport object. may be in app.js. need do save new model.
                let Transport = !props.ledgerTransport ? await TransportWebHID.create() : props.ledgerTransport
                if (!props.ledgerTransport) {
                    props.setTransport(Transport)
                }
                await getPublicKey(account.ledgerAccountsArray.length, Transport).then(async data => {

                    console.log(data)
                    // account.ledger = true
                    // console.log(ledger)

                    // TODO HERE WE GET PUBLIC KEYS FROM LEDGER
                    // TODO This one is test

                    // account.ledgerAccountsArray = [data.substr(0, 66)]

                    // await userStorage.promise.sendPromise({
                    //     account: true,
                    //     set: true,
                    //     data: account
                    // })

                    await addLedgerAccount(data)

                    console.log('Ledger worked')
                    setLedger(true)

                }).catch(msg => {

                    console.error('Ledger error')
                    console.log(msg)
                    setLedger(false)
                })

            })
    }

    // console.log(getUrlVars())

    return (
        <div className={styles.main}>

            <Back setFalse={() => props.setLedger(false)}/>

            <div className={styles.cards_container}>
                <div className={styles.cards}>
                    {cards3}
                </div>
            </div>

            {!ledger && <div className={styles.field + ' ' + styles.button}
                             onClick={connectLedger}>Connect Ledger</div>}

            {getUrlVars().popup ? <div className={styles.field + ' ' + styles.text}>
                There will be separate window for Ledger connection instead of popup.
            </div> : ''}

            <Separator/>

        </div>
    )
}
