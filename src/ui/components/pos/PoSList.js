import React, {useEffect, useState} from 'react'
import styles from '../../css/index.module.css'
import Separator from '../../elements/Separator'
import {shortHash} from "../../Utils";
import {globalState} from "../../../globalState";
import {apiController} from "../../../utils/apiController";

export default function PoSList(props) {

    const [activeTab, setActiveTab] = useState(0)
    const [activePos, setActivePos] = useState(0)
    const [notActivePos, setNotActivePos] = useState(0)
    const [activeCards, setActiveCard] = useState([])
    const [notActiveCards, setNotActiveCard] = useState([])
    const [cards, setCards] = useState([])

    const [stakedPos, setStakedPos] = useState(0)
    const [stakedCards, setStakedCards] = useState([])
    const [haveStakedPos, setHaveStakedPos] = useState(false)

    const [stakeList, setStakeList] = useState({})

    const [info, setInfo] = useState({})


    let renderCards = async () => {


        // TODO have to fix this in lib
        try {
            let globalStateBalances = globalState.getTokenBalance(ENQWeb.Enq.provider, props.user.publicKey, props.user.token)
            let ticker = globalStateBalances.ticker
            let PosInfo = await apiController.getPosListAll()
            let posList = PosInfo.pos_contracts

            let accountStake = await apiController.getAccountDelegates(props.user.publicKey)

            let _activePos = []
            let _notActivePos = []
            let _stakedPos = []

            let pos_id_list = {}
            let _info = {}

            for(let i in posList){
                if(posList[i].active){
                    _activePos.push(posList[i])
                }else{
                    _notActivePos.push(posList[i])
                }
                pos_id_list[posList[i].pos_id] = posList[i].name
                _info[posList[i].pos_id] = posList[i]

            }
            setActivePos(_activePos.length)
            setNotActivePos(_notActivePos.length)
            let _activeCards = generateCard(_activePos, ticker)
            let _notActiveCards = generateCard(_notActivePos, ticker)
            setActiveCard(_activeCards)
            setNotActiveCard(_notActiveCards)


            if(accountStake.length > 0){
                let _StakedList = {}
                for(let i in accountStake){
                    _StakedList[accountStake[i].pos_id] = accountStake[i].delegated
                    accountStake[i].name = pos_id_list[accountStake[i].pos_id]
                    _stakedPos.push(accountStake[i])
                }
                setStakeList(_stakedPos)
                setHaveStakedPos(true)
                setStakedPos(_stakedPos.length)
                let _stakedCards = generateCard(_stakedPos, ticker, {"stake":_StakedList, "names":pos_id_list})
                setStakedCards(_stakedCards)
            }
            setInfo(_info)
            setCards(_activeCards)
        }catch (e) {
            throw new Error(e)
        }
    }

    let generateCard= (list, ticker, staked = false)=>{
        let _cards = []
        for(let i in list){
            if(staked !== false){
                _cards.push(
                    <div key={'pos' + 'card' + list[i].rank} className={styles.card + " " + styles.small}>
                        <div className={styles.card_field}>{staked.names[list[i].pos_id]}</div>
                        <div className={styles.card_field + ' ' + styles.card_field_amount}>{(list[i].stake / 1e10) + " " + ticker}</div>
                        <div className={styles.card_field}>{shortHash( list[i].pos_id)}</div>
                        <div className={styles.card_field + ' ' + styles.card_field_amount_second}>{(staked.stake[list[i].pos_id] / 1e10) + " " + ticker}</div>
                        <div className={styles.card_field}>You stake: </div>
                        {/*<div className={styles.card_field_right_bottom} onClick={()=>{}}></div>*/}
                        <div className={styles.card_button}>
                            <div onClick={() => {
                                // props.setKeys(account)
                                console.log(list[i])
                                props.setPoSCard(list[i])
                            }}>
                                DETAILS
                            </div>
                        </div>
                    </div>
                )
            }else{
                _cards.push(
                    <div key={'pos' + 'card' + list[i].rank} className={styles.card + " " + styles.small}>
                        <div className={styles.card_field}>{list[i].name}</div>
                        <div className={styles.card_field + ' ' + styles.card_field_amount}>{(list[i].stake / 1e10) + " " + ticker}</div>
                        <div className={styles.card_field}>{shortHash( list[i].pos_id)}</div>
                        {/*<div className={styles.card_field + ' ' + styles.card_field_amount_second}>{(list[i].stake / 1e10) + " " + ticker}</div>*/}
                        {/*<div className={styles.card_field}>You stake: </div>*/}
                        {/*<div className={styles.card_field_right_bottom} onClick={()=>{}}></div>*/}
                        <div className={styles.card_button}>
                            <div onClick={() => {
                                // props.setKeys(account)
                                console.log(list[i].pos_id)
                                props.setPoSCard(list[i])
                            }}>
                                DETAILS
                            </div>
                        </div>
                    </div>
                )
            }

        }
        return _cards
    }

    useEffect(() => {
        renderCards().then(()=>{
        }).catch(err => {
            console.log(err)
        })
    }, [])

    return (
        <div className={styles.main}>

            <div className={styles.field + ' ' + styles.pointer} onClick={() => {

                props.setPosList(false)

            }}>❮ Back
            </div>

            <div className={styles.bottom}>


                <div className={styles.bottom_tabs}>
                    <div
                        onClick={() => {
                            setActiveTab(0)
                            setCards(activeCards)
                        }}
                        className={(activeTab === 0 ? ` ${styles.bottom_tab_active}` : '')}
                    >
                        Active ({activePos})
                    </div>
                    <div
                        onClick={() => {
                            setActiveTab(1)
                            setCards(notActiveCards)
                        }}
                        className={(activeTab === 1 ? ` ${styles.bottom_tab_active}` : '')}
                    >
                        Not active ({notActivePos})
                    </div>
                    {haveStakedPos && <div
                        onClick={() => {
                            setActiveTab(2)
                            setCards(stakedCards)
                        }}
                        className={(activeTab === 2 ? ` ${styles.bottom_tab_active}` : '')}
                    >
                        Staked ({stakedPos})
                    </div>}
                </div>


            </div>
            <div className={styles.cards}>
                {cards}
            </div>
            <Separator/>

        </div>
    )
}
