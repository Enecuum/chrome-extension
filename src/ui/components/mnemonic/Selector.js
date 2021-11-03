import React, {useEffect, useState} from "react";
import styles from "../../css/index.module.css";
import Separator from "../../elements/Separator";
import {regexToken, shortHash} from "../../Utils";
import Input from "../../elements/Input";

export default function Selector(props) {

    let [name, setName] = useState('')
    let [host, setHost] = useState('')
    let [hostCorrect, setHostCorrect] = useState(false)
    let [token, setToken] = useState('')
    let [tokenCorrect, setTokenCorrect] = useState(false)

    let [cards, setCards] = useState()

    let [showAdd, setShowAdd] = useState(false)

    let renderCards = () => {

        let cards = [1, 2]
        let current = false

        cards.push(
            <div className={styles.card + ' ' + (current ? '' : styles.card_select)}>
                <div className={styles.card_title}>Account 1</div>
                <div className={styles.card_field}>T1</div>
                <div className={styles.card_field}>T2</div>
                <div className={styles.card_field_select} onClick={(current ? () => {} : () => {})}>{current ? 'CURRENT' : 'SELECT'}</div>
            </div>
        )

        setCards(cards)
    }

    useEffect(() => {
        renderCards()
    }, [])

    return (
        <div className={styles.main}>

            <div className={styles.field} onClick={() => {}}>❮ Back</div>

            <div className={styles.cards_container}>
                <div className={styles.cards}>
                    {cards}
                </div>
            </div>

        </div>
    )
}
