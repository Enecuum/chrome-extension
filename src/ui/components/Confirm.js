import React from "react";
import styles from "../css/index.module.css";
import Separator from "../elements/Separator";


export default function Confirm(props) {

    let confirm = () => {

    }

    return (
        <div className={styles.main}>

            <div className={styles.content}>
                <img className={styles.login_logo} src="./images/logo_white.png"/>
                {/*<Separator/>*/}

                <div className={styles.welcome1}>Confirm</div>
                <div className={styles.welcome1}>Logout</div>

                <div className={styles.welcome2}>If you confirm all data will be deleted</div>
                <div className={styles.welcome2}>including your private key.</div>

            </div>

            <div className={styles.form}>

                <div onClick={props.logout}
                     className={styles.field + ' ' + styles.button}>Delete all data
                </div>

                <div onClick={() => props.setConfirm(false)}
                     className={styles.field + ' ' + styles.button}>Back
                </div>


                <Separator/>
            </div>
        </div>
    )
}
