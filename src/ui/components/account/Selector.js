import React, { useEffect, useState } from 'react'
import styles from '../../css/index.module.css'
import Separator from '../../elements/Separator'
import { explorerAddress, getMnemonicPrivateKeyHex, ledgerPath, regexToken, shortHash } from '../../Utils'
import Input from '../../elements/Input'
import * as bip39 from 'bip39'
import * as bip32 from 'bip32'
import { createPopupWindow, createTabWindow } from '../../../handler'
// import eventBus from "../../../utils/eventBus";
import { signHash, getVersion, getPublicKey } from '../../../utils/ledgerShell'
import TransportWebHID from '@ledgerhq/hw-transport-webhid'
import { generateAccountData, generateLedgerAccountData } from '../../../user'
import TransportWebUSB from '@ledgerhq/hw-transport-webusb'
import Eth from '@ledgerhq/hw-app-eth'
import elements from '../../css/elements.module.css'
import { copyText } from '../../../utils/names'
import Back from '../../elements/Back'
import { apiController } from '../../../utils/apiController'

// let balance = {}

export default function Selector(props) {

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
        if (!balance[publicKey] && balance[publicKey] !== 0) {
            await apiController.getMainTokenBalance(publicKey)
                .then((res) => {
                    if (!balance[publicKey]) {
                        balance[publicKey] = res.amount ? res.amount : 0
                        setBalance(balance)
                    }

                    // console.log(balance)

                    if (balance[publicKey] > 0) {
                        loadUser()
                    }
                })
        }
    }

    let buildAccountsArray = async (account) => {

        // console.log(account)

        const mainPublicKey = account.type === 2 ? account.publicKey : ENQWeb.Utils.Sign.getPublicKey(account.privateKey, true)

        let accounts = []

        for (let i = 0; i < account.privateKeys.length; i++) {
            const publicKey = ENQWeb.Utils.Sign.getPublicKey(account.privateKeys[i], true)
            let current = mainPublicKey === publicKey
            accounts.push({
                privateKey: account.privateKeys[i],
                publicKey,
                amount: balance[publicKey],
                current,
                groupIndex: i,
                type: 0
            })

            requestBalance(publicKey)
                .then(r => {
                })
        }

        if (account.seed) {
            setSeed(true)
        }

        for (let i = 0; i < account.seedAccountsArray.length; i++) {
            let privateKey = getMnemonicPrivateKeyHex(account.seed, account.seedAccountsArray[i])
            const publicKey = ENQWeb.Utils.Sign.getPublicKey(privateKey, true)
            let current = mainPublicKey === publicKey
            accounts.push({
                privateKey,
                publicKey,
                amount: balance[publicKey],
                current,
                groupIndex: i,
                type: 1
            })

            requestBalance(publicKey)
                .then(r => {
                })
        }

        for (let i = 0; i < account.ledgerAccountsArray.length; i++) {
            let publicKey = account.ledgerAccountsArray[i]
            let current = account.publicKey === publicKey.publicKey
            accounts.push({
                privateKey: publicKey.index,
                publicKey: publicKey.publicKey,
                amount: balance[publicKey.publicKey],
                current,
                groupIndex: publicKey.index,
                type: 2
            })

            requestBalance(publicKey.publicKey)
                .then(r => {
                })
        }

        // setAccounts(accounts)

        return accounts
    }

    let loadUser = () => {
        userStorage.user.loadUser()
            .then(async account => {
                let accounts = await buildAccountsArray(account)
                renderCards(accounts)
            })
    }

    // let loginSeed = (i) => {
    //     let hex = bip39.mnemonicToSeedSync(this.state.seed)
    //     let node = bip32.fromSeed(hex, null)
    //     let child = node.derivePath("m/44'/2045'/0'/0")
    //     let privateKey0 = child.derive(i).privateKey.toString('hex')
    //     // loginAccount(privateKey0, account.seed, account)
    //     const publicKey0 = ENQWeb.Utils.Sign.getPublicKey(privateKey0, true)
    //     if (publicKey0) {
    //         let data = {
    //             publicKey: publicKey0,
    //             privateKey: privateKey0,
    //             net: ENQWeb.Net.provider,
    //             token: ENQWeb.Enq.ticker,
    //             seed: hex,
    //         }
    //         userStorage.promise.sendPromise({
    //             account: true,
    //             set: true,
    //             data: data
    //         }).then(r => {
    //             this.props.login(data)
    //         })
    //     }
    // }

    let selectAccount = async (selected) => {
        // console.log(selected)
        let account = (await userStorage.user.loadUser())
        let data
        if (selected.type === 2) {
            data = generateLedgerAccountData(selected.privateKey, account)
        } else {
            data = generateAccountData(selected.privateKey, account)
        }
        await userStorage.promise.sendPromise({
            account: true,
            set: true,
            data
        })

        props.login(data)

        loadUser()
    }

    let addMnemonicAccount = async () => {

        let account = (await userStorage.user.loadUser())
        let data = generateAccountData(account.privateKey, account)
        data.seedAccountsArray.push(account.seedAccountsArray.length)

        await userStorage.promise.sendPromise({
            account: true,
            set: true,
            data
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

    let renderCards = (accounts) => {

        let accounts1 = accounts.filter(item => item.type === 0)
        let accounts2 = accounts.filter(item => item.type === 1)
        let accounts3 = accounts.filter(item => item.type === 2)

        setCards1(generateCards(accounts1))
        setCards2(generateCards(accounts2))
        setCards3(generateCards(accounts3))
    }

    let generateCards = (accounts) => {

        let cards = []

        for (let i = 0; i < accounts.length; i++) {

            let account = accounts[i]
            let current = account.current

            let name = getType(account.type)
                    .charAt(0)
                    .replace('S', '')
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
                             onClick={(current ? () => {
                             } : () => selectAccount(account))}>
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
        } else {
            props.setLedger(true)
        }
    }

    // console.log(getUrlVars())

    return (
        <div className={styles.main}>

            <Back setFalse={() => props.updateUserData()
                .then(() => {
                    props.setAccountSelector(false)
                })}/>

            <div className={styles.welcome3}>List of single PRIVATE KEYS</div>

            <div className={styles.cards_container}>
                <div className={styles.cards}>
                    {cards1}
                </div>
            </div>

            <div className={styles.field + ' ' + styles.button} onClick={props.setImportKey}>
                Import Key
            </div>

            <Separator line={true}/>

            <div className={styles.welcome3}>MNEMONIC or SEED PHRASE</div>

            <div className={styles.cards_container}>
                <div className={styles.cards}>
                    {cards2}
                </div>
            </div>

            {/*<div className={styles.cards_container}>*/}
            {/*    <div className={styles.cards}>*/}
            {/*        {cards.filter(item => item.type === 0).map(item => item.div)}*/}
            {/*    </div>*/}
            {/*</div>*/}

            {seed && <div className={styles.field + ' ' + styles.button}
                          onClick={addMnemonicAccount}>Add Mnemonic Account</div>}

            {!seed && <div className={styles.field + ' ' + styles.button}
                           onClick={props.setMnemonic}>Generate Mnemonic</div>}

            {!seed && <div className={styles.field + ' ' + styles.button}
                           onClick={props.setImportMnemonic}>Import Mnemonic</div>}

            <Separator line={true}/>

            <div className={styles.welcome3}>LEDGER ACCOUNTS</div>

            <div className={styles.cards_container}>
                <div className={styles.cards}>
                    {cards3}
                </div>
            </div>

            {!ledger && <div className={styles.field + ' ' + styles.button}
                             onClick={() => connectLedger()}>Connect Ledger</div>}

            {getUrlVars().popup ? <div className={styles.field + ' ' + styles.text + ' ' + styles.text_help}>
                There will be separate window for Ledger connection instead of popup.
            </div> : ''}

            <Separator/>

        </div>
    )
}
