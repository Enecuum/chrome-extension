import React, {useEffect, useState} from 'react'
import styles from '../../css/index.module.css'
import Separator from '../../elements/Separator'
import Back from "../../elements/Back";
import {createInternalTx, explorerPos} from "../../Utils";
import {globalState} from "../../../globalState";
import {apiController} from "../../../utils/apiController";
import {webBackground} from "../../../handler";



export default function PoSCard(props) {

    const [info, setInfo] = useState({})
    const [stake, setStake] = useState(0)
    const [transfer, setTransfer] = useState(0)

    const [ticker, setTicker] = useState(globalState.getTokenBalance(ENQWeb.Enq.provider, props.user.publicKey, props.user.token).ticker)

    const [token, setToken] = useState(globalState.getTokenBalance(ENQWeb.Enq.provider, props.user.publicKey, props.user.token))

    const [reward, setReward] = useState(0)

    const getDecimalAmount = (amount)=>{
        return amount/10**token.decimal
    }

    const getInfo = async ()=>{
        let accountStake = await apiController.getAccountDelegates(props.user.publicKey)
        if(accountStake.length > 0 ){
            for(let i in accountStake){
                if(accountStake[i].pos_id === props.isPoSCard.pos_id){
                    console.log(accountStake[i])
                    setInfo(accountStake[i])
                    setReward(getDecimalAmount(accountStake[i].reward))
                    setStake(getDecimalAmount(accountStake[i].delegated))
                    setTransfer(getDecimalAmount(accountStake[i].undelegated))
                    break
                }
            }
        }

    }

    const sendTransferReward = async (type)=>{
        let tx = await (new ENQWeb.Utils.SmartContractGenerator.TransactionGenerator(ENQWeb.Net.provider))
        tx.from = props.user.publicKey
        tx.amount = tx.amount.toString()
        let data
        if(type === "reward"){
            data = new ENQWeb.Utils.SmartContractGenerator.SCGenerators.pos.SmartContractPosReward(props.isPoSCard.pos_id)
        }
        if (type === "transfer"){
            data = new ENQWeb.Utils.SmartContractGenerator.SCGenerators.pos.SmartContractTransfer()
        }
        tx.data = ENQWeb.Utils.dfo(data)
        let sendObj = createInternalTx(tx)
        let check = webBackground(sendObj, ENQWeb.Net.provider)
        if(check){
            props.setTransactionRequest(sendObj)
            props.setPosCard(false)
            props.setPosList(false)
        }
    }

    const sendReward = ()=>{}

    useEffect(() => {
        console.log(props)
        getInfo().then(()=>{

        }).catch(err=>{
            console.warn(err)
        })


        //
    }, [])



    return (

        <div className={styles.main}>

            <Back setFalse={() => props.setPosCard(false)}/>

            <div className={styles.content}>

                {/*<Separator/>*/}

                <div className={styles.field}>{props.isPoSCard.name}</div>
                {/*<div className={styles.field}>Status {props.isPoSCard.active === 0 ? "not active" : "active"}</div>*/}

                <div className={styles.field}>Staked {stake} {ticker}</div>

                <div className={styles.field}>Reward {reward} {ticker}</div>

                <div className={styles.field + ' ' + styles.button + ' ' + styles.big}
                     onClick={() => {
                         // explorerPos(props.isPoSCard.pos_id)
                         props.setPosSend({
                             type:"delegate",
                             hash:props.isPoSCard.pos_id
                         })
                     }}>
                    Delegate {ticker}
                </div>

                <div className={styles.field + ' ' + styles.button + ' ' + styles.big + ' ' + (stake > 0 ? '' : styles.button_disabled)}
                     onClick={() => {
                         // explorerPos(props.isPoSCard.pos_id)
                         props.setPosSend({
                             type:"undelegate",
                             delegated:stake,
                             hash:props.isPoSCard.pos_id
                         })
                     }}>
                    Undelegate {ticker}
                </div>

                <div className={styles.field + ' ' + styles.button + ' ' + styles.big + ' ' + (reward > 0 ? '' : styles.button_disabled)}
                     onClick={() => {
                         // explorerPos(props.isPoSCard.pos_id)
                         sendTransferReward('reward').then()
                     }}>
                    Take reward
                </div>

                <div className={styles.field}>Transfer {transfer} {ticker}</div>

                <div className={styles.field + ' ' + styles.button + ' ' + styles.big + ' ' + (transfer > 0 ? '' : styles.button_disabled)}
                     onClick={() => {
                         // explorerPos(props.isPoSCard.pos_id)
                         props.setTransferList(props.isPoSCard.pos_id)
                     }}>
                    Transfer {ticker}
                </div>

                <div className={styles.field + ' ' + styles.button + ' ' + styles.big}
                     onClick={() => {
                         explorerPos(props.isPoSCard.pos_id)
                     }}>
                    Show in blockchain explorer
                </div>



            </div>

            <div className={styles.form}>

                <Separator/>

            </div>
        </div>
    )
}
