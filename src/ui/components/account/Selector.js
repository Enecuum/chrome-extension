import React, {useEffect, useState} from 'react'
import styles from '../../css/index.module.css'
import Separator from '../../elements/Separator'
import {explorerAddress, getMnemonicPrivateKeyHex, regexToken, shortHash} from '../../Utils'
import Input from '../../elements/Input'
import * as bip39 from 'bip39'
import * as bip32 from 'bip32'
import {createPopupWindow} from '../../../handler'
// import eventBus from "../../../utils/eventBus";
import {signHash, getVersion, getPublicKey} from '../../../utils/ledgerShell'
import TransportWebHID from '@ledgerhq/hw-transport-webhid'
import {generateAccountData} from "../../../user";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import Eth from "@ledgerhq/hw-app-eth";
import elements from "../../css/elements.module.css";
import {copyText} from "../../../utils/names";

export default function Selector(props) {

    let [accountsList, setAccountsList] = useState()

    let [name, setName] = useState('')
    let [host, setHost] = useState('')
    let [hostCorrect, setHostCorrect] = useState(false)

    let [token, setToken] = useState('')
    let [tokenCorrect, setTokenCorrect] = useState(false)

    let [keys, setKeys] = useState()
    let [accounts, setAccounts] = useState([])
    let [cards, setCards] = useState([])

    let [showAdd, setShowAdd] = useState(false)

    let [seed, setSeed] = useState(false)
    let [ledger, setLedger] = useState(false)

    let [copied, setCopied] = useState()

    useEffect(() => {
        loadUser()
    }, [copied])

    let buildAccountsArray = async (account) => {

        let accounts = []

        for (let i = 0; i < account.privateKeys.length; i++) {
            const publicKey = ENQWeb.Utils.Sign.getPublicKey(account.privateKeys[i], true)
            await ENQWeb.Net.get.getBalanceAll(publicKey).then((res) => {
                accounts.push({
                    privateKey: account.privateKeys[i],
                    publicKey: publicKey,
                    amount: res[0] ? res[0].amount : 0,
                    current: account.privateKey === account.privateKeys[i],
                    groupIndex: i,
                    type: 0
                })
            })
        }

        let hex = account.seed

        if (hex) {
            setSeed(true)
            for (let i = 0; i < account.seedAccountsArray.length; i++) {
                let privateKey = getMnemonicPrivateKeyHex(hex, account.seedAccountsArray[i])
                let current = account.privateKey === privateKey
                const publicKey = ENQWeb.Utils.Sign.getPublicKey(privateKey, true)
                await ENQWeb.Net.get.getBalanceAll(publicKey).then((res) => {
                    accounts.push({
                        privateKey,
                        publicKey,
                        amount: res[0] ? res[0].amount : 0,
                        current,
                        groupIndex: i,
                        type: 1
                    })
                })
            }
        }

        if (account.ledger) {
            for (let i = 0; i < account.ledgerAccountsArray.length; i++) {
                let current = account.publicKey === account.ledgerAccountsArray[i]
                await ENQWeb.Net.get.getBalanceAll(account.ledgerAccountsArray[i]).then((res) => {
                    accounts.push({
                        privateKey: '',
                        publicKey: account.ledgerAccountsArray[i],
                        amount: res[0] ? res[0].amount : 0,
                        current,
                        groupIndex: i,
                        type: 2
                    })
                })
            }

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

        let account = (await userStorage.user.loadUser())
        let data = generateAccountData(selected.privateKey, account.seed, account)

        await userStorage.promise.sendPromise({
            account: true,
            set: true,
            data: data
        })

        props.login(data)

        loadUser()
    }

    let addMnemonicAccount = async () => {

        let account = (await userStorage.user.loadUser())
        let data = generateAccountData(account.privateKey, account.seed, account)
        data.seedAccountsArray.push(account.seedAccountsArray.length)

        await userStorage.promise.sendPromise({
            account: true,
            set: true,
            data: data
        })

        loadUser()
    }

    let addLedgerAccount = async (ledgerPublicKey) => {

        let account = (await userStorage.user.loadUser())
        let data = generateAccountData(account.privateKey, account.seed, account)
        data.ledgerAccountsArray.push(ledgerPublicKey)
        data.ledger = true

        await userStorage.promise.sendPromise({
            account: true,
            set: true,
            data: data
        })

        loadUser()
    }

    let getType = (type) => {
        if (type === 0)
            return 'SIMPLE'
        if (type === 1)
            return 'MNEMONIC'
        if (type === 2)
            return 'LEDGER'
    }

    let renderCards = (accounts, hex) => {

        let cards = []

        for (let i = 0; i < accounts.length; i++) {

            let account = accounts[i]
            let current = account.current
            let name = getType(account.type).charAt(0).replace('S', '') + (account.groupIndex + 1)
            cards.push(
                <div key={i} className={styles.card + (current ? '' : ' ' + styles.card_select) + ' ' + styles.small}>

                    <div className={styles.row}>
                        <div>Account {name}</div>
                        <div>{getType(account.type)}</div>
                    </div>

                    {/*<div className={styles.card_field + ' ' + styles.buttonLink}*/}
                    {/*     onClick={() => explorerAddress(account.publicKey)}>{shortHash(account.publicKey)}</div>*/}

                    <div className={styles.card_field + ' ' + (copied ? styles.card_field_copied : styles.card_field_not_copied)}
                         onClick={() => copyPublicKey(account.publicKey)}
                         title={account.publicKey + copyText}>{shortHash(account.publicKey)}</div>

                    <div className={styles.card_field}>{account.amount > 0 ? account.amount / 1e10 : '0.0'}</div>

                    <div className={styles.card_field_select + ' ' + (current ? '' : 'select')}
                         onClick={(current ? () => {props.setKeys(true)} : () => selectAccount(account))}>{current ? 'KEYS' : 'SELECT'}</div>
                </div>
            )
        }

        setCards(cards)
    }

    const copyPublicKey = (publicKey) => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(publicKey)
            setCopied(true)
            {console.log(copied)}
            // loadUser()
        } else
            console.error('navigator.clipboard: ' + false)
    }

    let connectLedgerEth = async () => {

        // TransportWebUSB.list().then(devices => {
        //     console.log(devices)
        //     let output = devices.length > 0 && devices.find(device => device.manufacturerName === 'Ledger')
        //     console.log(!!output)
        //     setUsbDevice(!!output)
        // })

        return await TransportWebUSB.create().then(async transport => {

            const eth = new Eth(transport)

            console.log(eth)

            let account = (await userStorage.user.loadUser())

            eth.getAddress("44'/60'/0'/0/" + account.ledgerAccountsArray.length).then(o => {

                if (!ledger) {
                    setLedger(true)
                } else {
                    addLedgerAccount(o.address)
                }
                console.log(o.address)

            }).catch(e => {
                setLedger(false)
            })
        })
    }

    let connectLedger = () => {

        // createPopupWindow('index.html?type=connectLedger')

        userStorage.user.loadUser().then(async account => {

            // TODO global transport object. may be in app.js. need do save new model.
            let Transport = await TransportWebHID.create()
            await getPublicKey(0, Transport).then(async data => {

                console.log(data)
                account.ledger = true
                console.log(ledger)

                // TODO HERE WE GET PUBLIC KEYS FROM LEDGER
                // TODO This one is test

                // account.ledgerAccountsArray = [data.substr(0, 66)]

                // await userStorage.promise.sendPromise({
                //     account: true,
                //     set: true,
                //     data: account
                // })

                console.log('Ledger worked')
                setLedger(true)
            })
                .catch(msg => {
                    console.error('Ledger error')
                    console.log(msg)
                    setLedger(false)
                })

        })
    }

    return (
        <div className={styles.main}>

            <div className={styles.field} onClick={() => {
                props.setAccountSelector(false)
            }}>❮ Back
            </div>

            <div className={styles.field + ' ' + styles.button}
                 onClick={props.setImportKey}>Import Key
            </div>

            <div className={styles.cards_container}>
                <div className={styles.cards}>
                    {cards}
                </div>
            </div>

            {seed && <div className={styles.field + ' ' + styles.button}
                          onClick={addMnemonicAccount}>Add Mnemonic Account</div>}

            {!seed && <div className={styles.field + ' ' + styles.button}
                           onClick={props.setMnemonic}>Generate Mnemonic</div>}

            {!seed && <div className={styles.field + ' ' + styles.button}
                           onClick={props.setImportMnemonic}>Import Mnemonic</div>}

            {!ledger && <div className={styles.field + ' ' + styles.button}
                             onClick={connectLedgerEth}>Connect Ledger</div>}

            {ledger && <div className={styles.field + ' ' + styles.button}
                            onClick={connectLedgerEth}>Add Ledger Account</div>}

            <Separator/>

        </div>
    )
}
