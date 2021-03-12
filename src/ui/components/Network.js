import React from "react";
import styles from "../index.module.css";

export default class Network extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            url: ''
        }
        this.handleChangeNetwork = this.handleChangeNetwork.bind(this)
    }

    handleChangeNetwork() {

    }

    render() {

        return (
            <div className={styles.main}>

                <div className={styles.form}>

                    <div className={styles.field + ' ' + styles.balance}>Network: {this.props.net}</div>

                    {/*<div onClick={() => { this.props.setNet('pulse') }}*/}
                    {/*    className={styles.field + ' ' + styles.button}>PULSE</div>*/}

                    <div onClick={() => {
                        this.props.setNet('f3')
                    }}
                         className={styles.field + ' ' + styles.button}>F3
                    </div>

                    <div onClick={() => {
                        this.props.setNet('bit')
                    }}
                         className={styles.field + ' ' + styles.button}>BIT
                    </div>

                    <input type="text"
                           spellCheck={false}
                           onChange={this.handleChangeNetwork}
                           value={this.state.url}
                           className={styles.field}
                           placeholder={'Custom network url'}
                    />

                    <div onClick={() => {
                        this.props.setNetwork(false)
                    }}
                         className={styles.field + ' ' + styles.button + ' ' + styles.back}>Back
                    </div>

                </div>

            </div>
        )
    }
}