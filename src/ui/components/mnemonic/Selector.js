import React, {useEffect, useState} from "react";
import styles from "../../css/index.module.css";
import Separator from "../../elements/Separator";
import {getMnemonicPrivateKeyHex, regexToken, shortHash} from "../../Utils";
import Input from "../../elements/Input";
import * as bip39 from "bip39";
import * as bip32 from "bip32";

export default function Selector(props) {

    let [name, setName] = useState('')
    let [host, setHost] = useState('')
    let [hostCorrect, setHostCorrect] = useState(false)
    let [token, setToken] = useState('')
    let [tokenCorrect, setTokenCorrect] = useState(false)

    let [keys, setKeys] = useState()
    let [cards, setCards] = useState()

    let [showAdd, setShowAdd] = useState(false)

    useEffect(() => {
        loadUser()
    })

    let loadUser = () => {
        disk.user.loadUser().then(async account => {
            let hex = account.seed
            if (hex) {

                let accounts = []
                for (let i = 0; i < 1; i++) {
                    let privateKey = getMnemonicPrivateKeyHex(hex, i)
                    let current = account.privateKey === privateKey
                    const publicKey = ENQWeb.Utils.Sign.getPublicKey(privateKey, true)
                    await ENQWeb.Net.get.getBalanceAll(publicKey).then((res) => {
                        accounts.push({i: i, privateKey, publicKey, amount: res[0] ? res[0].amount : 0, current})
                    })
                }
                renderCards(accounts, hex)
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

    let renderCards = (accounts, hex) => {

        let cards = []

        for (let i = 0; i < accounts.length; i++) {

            let current = accounts[i].current
            cards.push(
                <div key={i} className={styles.card + ' ' + (current ? '' : styles.card_select)}>
                    <div className={styles.card_title}>Account {i + 1}</div>
                    <div className={styles.card_field}>{shortHash(accounts[i].privateKey)}</div>
                    <div className={styles.card_field}>{accounts[i].amount > 0 ? accounts[i].amount / 1e10 : '0.0'}</div>
                    <div className={styles.card_field_select} onClick={(current ? () => {} : () => {
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

            <div onClick={() => {}}
                 className={styles.field + ' ' + styles.button + ' ' + ((hostCorrect && name.length > 0 && tokenCorrect) ? styles.button_blue : '')}>Add
            </div>

            <Separator/>

        </div>
    )
}
