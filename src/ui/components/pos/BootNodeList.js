import React, {useEffect, useState} from 'react'
import styles from '../../css/index.module.css'
import elements from '../../css/elements.module.css'
import {globalState} from "../../../globalState";
import {apiController} from "../../../utils/apiController";


export default function BootNodeList(props) {
    //TODO сделать загрузку из глобального состояния
    // const [nodes, setNodes] = useState([])
    let renderNodes = ()=>{
        let defaultNodes = [...Object.entries(ENQWeb.Enq.urls)]
        let localNodes = JSON.parse(localStorage.getItem('networks')) || []
        let network = ENQWeb.Enq.provider
        let nodes = []
        for(let i in defaultNodes){
            if(defaultNodes[i][1] === network){
                nodes.push("default".toUpperCase())
            }
        }
        for(let i in localNodes){
            if(localNodes[i].poa !== undefined && localNodes[i].poa !== false && localNodes[i].host === network){
                nodes.push(localNodes[i].name)
            }
        }
        let array = []
        for(let i in nodes){
            array.push(<div key={i} className={elements.field} onClick={()=>{submit(nodes[i])}}>{nodes[i]}</div>)
        }

        return array
    }

    //TODO запоминать выбранный узел 
    let submit = (data)=>{
        props.saveBootNode(data)
        props.setBootNodeSelector(false)
    }

    return (
        <div className={elements.bootNodeSelector}>
            <div className={elements.XButton} onClick={()=>{props.setBootNodeSelector(false)}}>X</div>
            {renderNodes()}

        </div>
    )
}
