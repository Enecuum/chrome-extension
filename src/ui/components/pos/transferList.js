import React, {useEffect, useState} from 'react'
import styles from '../../css/index.module.css'
import Separator from '../../elements/Separator'
import {createInternalTx, shortHash} from "../../Utils";
import {globalState} from "../../../globalState";
import {apiController} from "../../../utils/apiController";
import {webBackground} from "../../../handler";

export default function TransferList(props) {

    const [cards, setCards] = useState([])
    const [ticker, setTicker] = useState(globalState.getTokenBalance(ENQWeb.Enq.provider, props.user.publicKey, props.user.token).ticker)


    let renderCards = async () => {


        // TODO have to fix this in lib
        try {
            let undelegateList = await apiController.getUndelegatedList(props.user.publicKey)
            console.log(undelegateList)
            let _cards = generateCard(undelegateList, ticker)

            setCards(_cards)
        } catch (e) {
            throw new Error(e)
        }
    }

    const sendTransfer = async (undelegate_hash) => {
        let tx = await (new ENQWeb.Utils.SmartContractGenerator.TransactionGenerator(ENQWeb.Net.provider))
        tx.from = props.user.publicKey
        tx.amount = tx.amount.toString()
        let data = new ENQWeb.Utils.SmartContractGenerator.SCGenerators.pos.SmartContractTransfer(undelegate_hash)
        tx.data = ENQWeb.Utils.dfo(data)
        let sendObj = createInternalTx(tx)
        let check = webBackground(sendObj, ENQWeb.Net.provider)
        if (check) {
            props.setTransactionRequest(sendObj)
            props.setTransferList(false)
            props.setPosCard(false)
            props.setPosList(false)
        } else {

        }
    }

    let generateCard = (list, ticker) => {
        let _cards = []
        list = list.reverse()
        for (let i in list) {
            if (list[i].pos_id === props.isTransferList) {
                _cards.push(
                    <div key={'transfer' + 'card' + i} className={styles.card + " " + styles.small}>
                        <div className={styles.card_field}>#{Number(i) + 1}</div>
                        <div
                            className={styles.card_field + ' ' + styles.card_field_amount}>{(list[i].amount / 1e10) + " " + ticker}</div>
                        <div className={styles.card_field}>{shortHash(list[i].pos_id)}</div>
                        <div
                            className={styles.card_field + ' ' + styles.card_field_amount_second}>{(list[i].height)}</div>
                        <div className={styles.card_field}>Height:</div>
                        {/*<div className={styles.card_field_right_bottom} onClick={()=>{}}></div>*/}
                        <div className={styles.card_button}>
                            <div onClick={async () => {
                                // props.setKeys(account)
                                // console.log(list[i])
                                // props.setPoSCard(list[i])
                                sendTransfer(list[i].tx_hash).then().catch(err => {
                                    console.warn(err)
                                })
                            }}>
                                Transfer
                            </div>
                        </div>
                    </div>
                )
            }
        }
        return _cards
    }

    useEffect(() => {
        renderCards().then(() => {
        }).catch(err => {
            console.log(err)
        })
    }, [])

    return (
        <div className={styles.main}>

            <div className={styles.field + ' ' + styles.pointer} onClick={() => {

                props.setTransferList(false)

            }}>❮ Back
            </div>
            <div className={styles.cards}>
                {cards}
            </div>
            <Separator/>

        </div>
    )
}
