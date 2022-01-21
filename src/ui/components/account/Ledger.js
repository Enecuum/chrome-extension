import React, {useEffect, useState} from 'react'
import styles from '../../css/index.module.css'
import Separator from '../../elements/Separator'
import {
    explorerAddress,
    getMnemonicPrivateKeyHex,
    ledgerPath,
    regexToken,
    shortHash,
    toggleFullScreen
} from '../../Utils'
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
    let [userAccounts, setUserAccounts] = useState([])
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

    let buildAccountsArray = async (ledgerAccountsArray) => {

        // console.log(account)

        // accounts = []

        // const mainPublicKey = account.type === 2 || account.privateKey < 3 ? account.publicKey : ENQWeb.Utils.Sign.getPublicKey(account.privateKey, true)

        for (let i = 0; i < ledgerAccountsArray.length; i++) {
            let publicKey = ledgerAccountsArray[i]
            let current = '' === publicKey
            let added = userAccounts.includes(publicKey)
            accounts.push({
                privateKey: i,
                publicKey: publicKey,
                amount: balance[publicKey],
                current,
                added,
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
            setUserAccounts(account.ledgerAccountsArray)
        })
    }

    let addLedgerAccount = async (ledgerPublicKey) => {

        let account = (await userStorage.user.loadUser())
        let data = generateLedgerAccountData(account.ledgerAccountsArray.length, account)

        data.publicKey = ledgerPublicKey
        data.ledgerAccountsArray.push(ledgerPublicKey)
        // data.ledger = ''

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

    let renderCards = (accounts) => {

        // let accounts1 = accounts.filter(item => item.type === 0)
        // let accounts2 = accounts.filter(item => item.type === 1)
        let accounts3 = accounts.filter(item => item.type === 2)

        // setCards1(generateCards(accounts1))
        // setCards2(generateCards(accounts2))

        console.log(accounts3.length)

        setCards3(generateCards(accounts3))
    }

    let generateCards = (accounts) => {

        let cards = []

        for (let i = 0; i < accounts.length; i++) {

            let account = accounts[i]
            let current = account.current

            // let name = getType(account.type).charAt(0).replace('S', '')
            //     + (account.groupIndex + 1)

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
                             onClick={(!account.added ? async () => {
                                 await addLedgerAccount(account.publicKey)
                             } : () => {})}>
                            {(account.added ? 'REMOVE' : 'ADD')}
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

    let connectLedger = () => {

        if (getUrlVars().popup) {
            createTabWindow('?type=ledger')
        } else

            userStorage.user.loadUser().then(async account => {

                let Transport = !props.ledgerTransport ? await TransportWebHID.create() : props.ledgerTransport
                if (!props.ledgerTransport) {
                    props.setTransport(Transport)
                }

                await getPublicKey(0, Transport).then(() => {
                    setLedger(true)
                })

                let accounts = await buildAccountsArray([
                    await getPublicKey(0, Transport),
                    await getPublicKey(1, Transport),
                    await getPublicKey(2, Transport),
                    await getPublicKey(3, Transport),
                    await getPublicKey(4, Transport),
                    ]
                )
                renderCards(accounts)

            })
    }

    // console.log(getUrlVars())

    return (
        <div className={styles.main}>

            {/*<Back setFalse={() => props.setLedger(false)}/>*/}

            {!ledger ? <div className={styles.content}>
                <img className={styles.login_logo} src="./images/ledger.png"/>
                <div className={styles.welcome1}>Connect</div>
                <div className={styles.welcome1}>to Ledger</div>
                <div className={styles.welcome2}>Connect your wallet to your computer</div>
                <div className={styles.welcome2}>Unlock Ledger and open the ENQ App</div>
            </div> : ''}

            {ledger ? <div className={styles.content}>
                <img className={styles.login_logo} style={{filter: 'invert(100%)'}}  src="./images/ledger.png"/>
                <div className={styles.welcome1}>Select</div>
                <div className={styles.welcome1}>an Account</div>
                <div className={styles.welcome2}>You can add or remove</div>
                <div className={styles.welcome2}>at any time</div>
            </div> : ''}

            {ledger ? <div className={styles.cards_container}>
                <div className={styles.cards}>
                    {cards3}
                </div>
                <Separator/>
            </div> : ''}

            <div className={styles.form}>
                {!ledger && <div className={styles.field + ' ' + styles.button}
                                 onClick={connectLedger}>Continue</div>}

                {getUrlVars().popup ? <div className={styles.field + ' ' + styles.text + ' ' + styles.text_help}>
                    There will be separate window for Ledger connection instead of popup.
                </div> : ''}

                <Separator/>
            </div>

            {/*{ledger ? <div className={`${styles.card_buttons}`}>*/}

            {/*    <div onClick={() => {props.setLedger(false)}}*/}
            {/*         className={`${styles.field} ${styles.button} ${styles.button_blue}`}>*/}
            {/*        Back*/}
            {/*    </div>*/}

            {/*    <div onClick={() => {}}*/}
            {/*         className={`${styles.field} ${styles.button}`}>*/}
            {/*        Unlock*/}
            {/*    </div>*/}

            {/*    <Separator/>*/}

            {/*</div> : ''}*/}

        </div>
    )
}
