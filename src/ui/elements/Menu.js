import React, {useState} from "react";
import styles from "../css/elements.module.css";

export default function Menu(props) {

    const [amount, setAmount] = useState(0);


    return (
        <div className={styles.menu}>

            <div className={styles.lock}><img src={'./icons/1.png'}/></div>
            <div className={styles.title}>My accounts</div>
            <div>Account 1</div>
            <div>Account 2</div>

            <div className={styles.title}>Settings</div>
            <div>Expand</div>
            <div>Show in blockchain explorer</div>
            <div>Network: PULSE</div>
            <div>Network: BIT</div>
            <div>Logout</div>

        </div>
    )
}