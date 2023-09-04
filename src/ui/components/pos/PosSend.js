import React, {useEffect, useState} from 'react'
import styles from '../../css/index.module.css'
import Separator from '../../elements/Separator'
import Back from "../../elements/Back";
import {createInternalTx, explorerPos, regexAddress, shortHash} from "../../Utils";
import {globalState} from "../../../globalState";
import {apiController} from "../../../utils/apiController";
import Input from "../../elements/Input";
import {webBackground} from "../../../handler";



export default function PosSend(props) {

    const [info, setInfo] = useState({})

    const [ticker, setTicker] = useState(globalState.getTokenBalance(ENQWeb.Enq.provider, props.user.publicKey, props.user.token).ticker)

    const [token, setToken] = useState(globalState.getTokenBalance(ENQWeb.Enq.provider, props.user.publicKey, props.user.token))

    const [amount, setAmount] = useState(0)

    const [balance, setBalance] = useState(0)


    const getDecimalAmount = (amount)=>{
        return amount/10**token.decimal
    }
    const getInfo = async ()=>{
        if(props.isPosSend.type === "delegate"){
            setBalance(getDecimalAmount(token.amount))
        }else{
            setBalance(props.isPosSend.delegated)
        }


    }

    const handleAmountChange = e=>{
        let decimals = token.decimal
        if(e.target.value === ''){
            setAmount(0)
        }
        if(e.target.value === '00'){
            setAmount(0)
        }
        let _amount = Number(e.target.value)
        if(_amount < 0 || _amount > balance){
            return
        }

        setAmount(_amount)
    }

    const submit = async ()=>{
        let tx = await (new ENQWeb.Utils.SmartContractGenerator.TransactionGenerator(ENQWeb.Net.provider))
        tx.from = props.user.publicKey
        tx.amount = tx.amount.toString()
        let data
        if(props.isPosSend.type === "delegate"){
            data = new ENQWeb.Utils.SmartContractGenerator.SCGenerators.pos.SmartContractDelegate(props.isPosCard.pos_id, BigInt(amount*10**token.decimal))
        }else if(props.isPosSend.type === "undelegate"){
            data = new ENQWeb.Utils.SmartContractGenerator.SCGenerators.pos.SmartContractUndelegate(props.isPosCard.pos_id, BigInt(amount*10**token.decimal))
        }
        tx.data = ENQWeb.Utils.dfo(data)
        // console.log(tx)
        let sendObj = createInternalTx(tx)
        let check = webBackground(sendObj, ENQWeb.Net.provider)
        if(check){
            props.setTransactionRequest(sendObj)
            props.setPosSend(false)
            props.setPosCard(false)
            props.setPosList(false)
        }else{

        }
    }

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

            <Back setFalse={() => props.setPosSend(false)}/>
            <div className={styles.transaction_network}>
                Network: {ENQWeb.Net.currentProvider.toUpperCase()}
            </div>


            <div className={styles.card + " " + styles.small}>
                {/*<Separator/>*/}
                <div className={styles.field}>{props.isPosCard.name}</div>
                <div className={styles.field}>Pos id: {shortHash(props.isPosSend.hash)}</div>
                <div
                    className={styles.transaction_type}>{
                    props.isPosSend.type.toUpperCase()
                        .replaceAll('_', ' ')
                }</div>


            </div>

            <div className={styles.content}>

                {/*<Separator/>*/}
                <Input
                    onChange={handleAmountChange}
                    value={amount}
                    className={styles.field}
                    placeholder={'Amount'}
                />
                <Input
                    type="range"
                    onChange={handleAmountChange}
                    value={amount}
                    className={styles.field}
                    max={balance}
                />
            </div>
            <div onClick={submit}
                 className={styles.field + ' ' + styles.button + ' ' + ( amount > 0 ? styles.button_blue : styles.button_disabled)}>Send
            </div>

        </div>
    )
}
