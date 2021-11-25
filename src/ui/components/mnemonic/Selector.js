import React, {useEffect, useState} from "react";
import styles from "../../css/index.module.css";
import Separator from "../../elements/Separator";
import {getMnemonicPrivateKeyHex, regexToken, shortHash} from "../../Utils";
import Input from "../../elements/Input";
import * as bip39 from "bip39";
import * as bip32 from "bip32";
import {createPopupWindow} from "../../../handler";

export default function userSelector(props) {

    let [accountsList, setAccountsList] = useState()

    let [name, setName] = useState('')
    let [host, setHost] = useState('')
    let [hostCorrect, setHostCorrect] = useState(false)
    let [token, setToken] = useState('')
    let [tokenCorrect, setTokenCorrect] = useState(false)

    let [keys, setKeys] = useState()
    let [cards, setCards] = useState([])

    let [showAdd, setShowAdd] = useState(false)

    let [seed, setSeed] = useState(false)
    let [ledger, setLedger] = useState(false)

    useEffect(() => {
        loadUser()
    }, [])

    let loadUser = () => {
        disk.user.loadUser().then(async account => {
            let hex = account.seed
            let accounts = []
            if (hex) {
                setSeed(true)
                for (let i = 0; i < 2; i++) {
                    let privateKey = getMnemonicPrivateKeyHex(hex, i)
                    let current = account.privateKey === privateKey
                    const publicKey = ENQWeb.Utils.Sign.getPublicKey(privateKey, true)
                    await ENQWeb.Net.get.getBalanceAll(publicKey).then((res) => {
                        accounts.push({i: i, privateKey, publicKey, amount: res[0] ? res[0].amount : 0, current})
                    })
                }
                renderCards(accounts, hex)
            } else {
                accounts.push({i: 0, privateKey: '', publicKey: account.publicKey, amount: account.amount, current: true})
                renderCards(accounts, null, true)
            }
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
    //         global.disk.promise.sendPromise({
    //             account: true,
    //             set: true,
    //             data: data
    //         }).then(r => {
    //             this.props.login(data)
    //         })
    //     }
    // }

    let renderCards = (accounts, hex, old = false) => {

        let cards = []

        for (let i = 0; i < accounts.length; i++) {

            let current = accounts[i].current
            cards.push(
                <div key={i} className={styles.card + (current ? '' : ' ' + styles.card_select) + ' ' + styles.small}>

                    <div className={styles.row}>
                        <div>Account {i + 1}</div>
                        <div>{old ? 'OLD TYPE' : ''}</div>
                    </div>

                    <div className={styles.card_field}>{shortHash(accounts[i].publicKey)}</div>
                    <div className={styles.card_field}>{accounts[i].amount > 0 ? accounts[i].amount / 1e10 : '0.0'}</div>
                    <div className={styles.card_field_select + ' ' + (current ? '' : 'select')} onClick={(current ? () => {} : () => {
                        let data = {
                            publicKey: accounts[i].publicKey,
                            privateKey: accounts[i].privateKey,
                            net: ENQWeb.Net.provider,
                            token: ENQWeb.Enq.ticker,
                            seed: hex,
                        }
                        global.disk.promise.sendPromise({
                            account: true,
                            set: true,
                            data: data
                        }).then(r => {
                            props.login(data)
                        })
                    })}>{current ? 'CURRENT' : 'SELECT'}</div>
                </div>
            )
        }

        setCards(cards)
    }

    return (
        <div className={styles.main}>

            <div className={styles.field} onClick={() => {props.setAccountSelector(false)}}>❮ Back</div>

            <div className={styles.cards_container}>
                <div className={styles.cards}>
                    {cards}
                </div>
            </div>

            {seed && <div onClick={() => {}} className={styles.field + ' ' + styles.button}>Add mnemonic account</div>}

            <div onClick={() => {}} className={styles.field + ' ' + styles.button}>Import account</div>

            {!seed && <div className={styles.field + ' ' + styles.button} onClick={props.setMnemonic}>Generate Mnemonic</div>}

            {!seed && <div className={styles.field + ' ' + styles.button} onClick={props.setImportMnemonic}>Import Mnemonic</div>}

            {!ledger && <div className={styles.field + ' ' + styles.button}
                 onClick={() => {
                     // createPopupWindow('index.html?type=connectLedger')
                     setLedger(true)
                 }}>Connect Ledger</div>}

            {ledger && <div className={styles.field + ' ' + styles.button}
                            onClick={() => {
                                // createPopupWindow('index.html?type=connectLedger')
                                let _cards = JSON.parse(JSON.stringify(cards))
                                _cards.push({i: -1, privateKey: '', publicKey: 'KEY', amount: 0, current: false})
                                setCards(_cards)

                            }}>Add Ledger account</div>}

            <Separator/>

        </div>
    )
}
