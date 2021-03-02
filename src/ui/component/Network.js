import React from "react";
import styles from "../index.module.css";

export default class Network extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {

        return (
            <div className={styles.main}>

                <div className={styles.form}>
                    
                    <div className={styles.field + ' ' + styles.balance}>Network: {this.props.net}</div>

                    <div onClick={() => { this.props.setNet('pulse') }}
                        className={styles.field + ' ' + styles.button}>PULSE</div>

                    <div onClick={() => { this.props.setNet('f3') }}
                        className={styles.field + ' ' + styles.button}>F3</div>

                    <div onClick={() => { this.props.setNet('bit') }}
                        className={styles.field + ' ' + styles.button}>BIT</div>

                    <div onClick={() => { this.props.setNetwork(false) }}
                        className={styles.field + ' ' + styles.button}>&laquo; Back
                    </div>

                </div>
            </div>
        )
    }
}