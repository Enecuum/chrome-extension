import React from 'react'
import styles from '../css/index.module.css'
import Spinner from  "../elements/Spinner"

export default function Loading(props) {


    return (
        <div className={styles.main}>

            <div className={styles.content}>

                <img className={styles.request_logo} src="./images/enq.png"/>

                <div className={styles.request_text1}>
                    <div>Loading...</div>
                    <div>Please Wait</div>
                    <Spinner />
                </div>

            </div>
        </div>
    )
}