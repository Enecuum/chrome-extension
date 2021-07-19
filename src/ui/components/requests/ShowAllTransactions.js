import React, {useState, useEffect} from 'react'
import styles from '../../css/index.module.css'
import Separator from '../../elements/Separator'
import { shortAddress2 } from '../../Utils'


export default function ConnectLedger(props) {

    const listSize = 15

    const [pages, setPages] = useState('')
    const [page, setPage] = useState('')
    const [list, setList] =useState('')

    const back = () => {
        props.setShowAllTransactions(false)
    }

    const loadTransactions = ()=>{
        ENQWeb.Net.get.accountTransactions(props.user.publicKey, 0)
            .then(data=>{
                // console.log(data)
                if(data.records !== undefined && data.records.length > 0){
                    console.log(data.records);
                    setPages(Math.ceil(data.records.length/listSize));
                    setPage(1);
                    renderPages(data.records).then()
                }else{
                    setPages(0);
                }
            })
            .catch(err=>{
                console.log('Error in load transactions...\n',err);
            })
    }

    //TODO доделать рендер и нормальную отрисовку по сраницам 
    const renderPages = async (transactions)=>{
        let txList = []
        let info = ''
        for(let i in transactions){
            info = await ENQWeb.Net.get.token_info(transactions[i].token_hash).then(info=>{
                if(info.length > 0 )
                    return info[0]
                else
                    return false
            })
            if(info){
                txList.push(
                <div >
                    <div>
                        {transactions[i].hash}
                    </div>
                    <div >
                        {Number((transactions[i].amount)/(10**info.decimals)).toFixed(2)}
                        {' '}
                        {info.ticker}
                        {' '}
                        {transactions[i].rectype === "iout" ? 'OUT' : 'IN'}
                    </div>
                </div>
            )
            }else
                continue
        }
        setList(txList)
    }

    useEffect(()=>{
        loadTransactions();
    },[])

    return (
        <div className={styles.main}>

            <div className={styles.content}>

                <div >

                    <div className="">{pages > 0 ? list : ''}</div>

                </div>

                <div className={styles.form}>

                    <div onClick={back}
                         className={styles.field + ' ' + styles.button + ' ' + styles.button_blue}>Back
                    </div>

                    <Separator/>

                </div>

            </div>

        </div>
    )
}
