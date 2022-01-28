import React, { useEffect, useState } from 'react'
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

// let balance = {}

export default function Ledger(props) {

    let [ledgerAccounts, setLedgerAccounts] = useState([])
    let [userAccounts, setUserAccounts] = useState([])

    let [mainPublicKey, setMainPublicKey] = useState([])

    let [accounts, setAccounts] = useState([])

    let [ledger, setLedger] = useState(false)

    let [balance, setBalance] = useState({})

    let [copied, setCopied] = useState()

    const [ledgerTransport, setLedgerTransport] = useState(false)

    useEffect(async () => {

        // if (!ledgerTransport) {
        //     TransportWebHID.create().then(transport => {
        //         setLedgerTransport(transport)
        //     })
        // }

        // Transport = !this.props.ledgerTransport ? await TransportWebHID.create() : this.props.ledgerTransport
        // if (!this.props.ledgerTransport) {
        //     this.props.setLedgerTransport(Transport)
        // }

        // if (!ledgerTransport) {
        //     props.ledgerTransportController()
        //         .then(transport => {
        //             setLedgerTransport(transport)
        //         })
        // }


        userStorage.user.loadUser()
            .then(account => {
                setMainPublicKey(account.type === 2 ? account.publicKey : ENQWeb.Utils.Sign.getPublicKey(account.privateKey, true))
                setUserAccounts(account.ledgerAccountsArray.map(a => a.publicKey))
            })

    }, [balance, copied])

    let buildAccountsArray = async () => {

        let ledgerPublicKeys = []
        let accounts = []

        for (let i = 0; i < 5; i++) {

            let publicKey = ledgerAccounts[i] ? ledgerAccounts[i] : await getPublicKey(i, ledgerTransport)

            ledgerPublicKeys.push(publicKey)

            setLedger(true)

            let current = '' === publicKey
            // console.log(userAccounts)

            accounts.push({
                privateKey: i,
                publicKey: publicKey,
                amount: balance[publicKey],
                current,
                groupIndex: i,
                type: 2
            })

            // So here react fuck me in ass... Fuck you react and all react developers!
            setAccounts([...accounts])
            requestBalance(publicKey)
                .then(r => {
                })
        }

        // console.log(ledgerPublicKeys)
        setLedgerAccounts([...ledgerPublicKeys])
        // console.log(ledgerAccounts)
    }

    // let loadUser = () => {
    //     userStorage.user.loadUser()
    //         .then(async account => {
    //             // console.log(account)
    //             let accountsArray = []
    //             for (let i = 0; i < account.ledgerAccountsArray.length; i++) {
    //                 accountsArray.push(account.ledgerAccountsArray[i].publicKey)
    //             }
    //             setUserAccounts(accountsArray)
    //         })
    // }

    let addLedgerAccount = async (ledgerPublicKey, index) => {

        // console.log('ADD: ' + ledgerPublicKey)
        // console.log(userAccounts)

        let account = (await userStorage.user.loadUser())
        // let data = generateLedgerAccountData(index, account)
        account.ledgerAccountsArray.push({
            publicKey: ledgerPublicKey,
            index: index
        })

        await userStorage.promise.sendPromise({
            account: true,
            set: true,
            data: account
        })

        setMainPublicKey(ledgerPublicKey)
        userAccounts.push(ledgerPublicKey)
        setUserAccounts([...userAccounts])
        buildAccountsArray()
            .then(r => {
            })
    }

    let removeLedgerAccount = async (ledgerPublicKey) => {

        // console.log('REMOVE: ' + ledgerPublicKey)
        // console.log(userAccounts)

        let account = (await userStorage.user.loadUser())
        let ledgerAccounts = account.ledgerAccountsArray
        if (ledgerPublicKey === account.publicKey) {

            console.error('Change account')

        } else {

            let array = []
            for (let i = 0; i < ledgerAccounts.length; i++) {
                if (ledgerAccounts[i].publicKey !== ledgerPublicKey) {
                    array.push(ledgerAccounts[i])
                }
            }
            console.log(array)
            account.ledgerAccountsArray = array
            await userStorage.promise.sendPromise({
                account: true,
                set: true,
                data: account
            })

            array = []
            for (let i = 0; i < userAccounts.length; i++) {
                if (userAccounts[i] !== ledgerPublicKey) {
                    array.push(userAccounts[i])
                }
            }
            setUserAccounts(array)
            buildAccountsArray()
                .then(r => {
                })
        }

    }

    let cards = () => {

        let cards = []

        for (let i = 0; i < accounts.length; i++) {

            let account = accounts[i]
            let current = account.publicKey === mainPublicKey

            let name = 'L' + (account.groupIndex + 1)

            cards.push(
                <div key={i} className={styles.card + (current ? '' : ' ' + styles.card_select) + ' ' + styles.small}>

                    <div className={styles.row}>
                        <div>Account {name}</div>
                        <div>{'LEDGER'}</div>
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

                    <div className={styles.card_buttons}>

                        <div className={current ? styles.card_button_current : ''}
                             onClick={
                                 account.publicKey === mainPublicKey ? () => {
                                     } :
                                     (!userAccounts.includes(account.publicKey) ?
                                             () => addLedgerAccount(account.publicKey, i)
                                             :
                                             () => removeLedgerAccount(account.publicKey)
                                     )}>
                            {account.publicKey === mainPublicKey ? 'CURRENT' :
                                (userAccounts.includes(account.publicKey) ? 'REMOVE' : 'ADD')}
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

    let connectLedger = async (type = false) => {

        if(type){
            if (!ledgerTransport) {
                await props.ledgerTransportController(type)
                    .then(transport => {
                        setLedgerTransport(transport)
                    })
            }
        }else{
            if (!ledgerTransport) {
                await props.ledgerTransportController()
                    .then(transport => {
                        setLedgerTransport(transport)
                    })
            }
        }
        if (getUrlVars().popup) {
            createTabWindow('?type=ledger')

        } else {

            userStorage.user.loadUser()
                .then(async account => {
                    await buildAccountsArray()
                })
        }
    }

    let requestBalance = async (publicKey) => {
        // if (!balance[publicKey] && balance[publicKey] !== 0) {
        //     await ENQWeb.Net.get.getBalanceAll(publicKey).then((res) => {
        //         balance[publicKey] = res[0] ? res[0].amount : 0
        //         setBalance({...balance})
        //         // console.log(balance)
        //
        //         if (balance[publicKey] > 0) {
        //             buildAccountsArray()
        //         }
        //     })
        // }
    }

    return (
        <div className={styles.main}>

            <Back setFalse={() => props.setLedger(false)}/>

            {!ledger ? <div className={styles.content}>
                <img className={styles.login_logo} src="./images/ledger.png"/>
                <div className={styles.welcome1}>Connect</div>
                <div className={styles.welcome1}>to Ledger</div>
                <div className={styles.welcome2}>Connect your wallet to your computer</div>
                <div className={styles.welcome2}>Unlock Ledger and open the ENQ App</div>
            </div> : ''}

            {ledger ? <div className={styles.content + ' ' + styles.ledger}>
                <img className={styles.login_logo} style={{ filter: 'invert(100%)' }} src="./images/ledger.png"/>
                <div className={styles.welcome1}>Select</div>
                <div className={styles.welcome1}>an Account</div>
                <div className={styles.welcome2}>You can add or remove at any time</div>
                {/*<div className={styles.welcome2}></div>*/}
            </div> : ''}

            {ledger ? <div className={styles.cards_container}>
                <div className={styles.cards}>
                    {cards()}
                </div>
                <Separator/>
            </div> : ''}

            <div className={styles.form}>
                {/*{!ledger && <div className={styles.field + ' ' + styles.button}*/}
                {/*                 onClick={connectLedger}>Continue</div>}*/}

                {!ledger && <div className={styles.field + ' ' + styles.button}
                                 onClick={()=>connectLedger("ble")}>Connect bluetooth</div>}

                {!ledger && <div className={styles.field + ' ' + styles.button}
                                 onClick={()=>connectLedger('usb')}>Connect usb</div>}

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
