import React from "react";
import styles from "../index.module.css";

export class TransactionSend extends React.Component {
    constructor(props) {
        super(props);
        this.submit = this.submit.bind(this)
        console.log(props)
    }

    submit() {
        console.log('submit work')
        console.log(this.props.amount, this.props.address)
    }

    render() {
        console.log(this.props.background)
        this.props.background.postMessage({test: '123'})
        return (
            <div className={styles.main}>

                <div className={styles.form}>
                    {/*<input type="text"*/}
                    {/*       value={this.props.myAddress}*/}
                    {/*       className={styles.field}*/}
                    {/*       placeholder={'Address'}*/}
                    {/*/>*/}

                    {/*<input type="text"*/}
                    {/*       value={this.props.address}*/}
                    {/*       className={styles.field}*/}
                    {/*       placeholder={'Address'}*/}
                    {/*/>*/}

                    {/*<input type="text"*/}
                    {/*       value={this.props.amount}*/}
                    {/*       className={styles.field}*/}
                    {/*       placeholder={'Amount'}*/}
                    {/*/>*/}

                    {/*<div onClick={this.submit}*/}
                    {/*     className={styles.field + ' ' + styles.button}>Send*/}
                    {/*</div>*/}

                    <div>Transaction hash</div>

                </div>


                <div className={styles.form}>

                    <div onClick={() => this.props.setCheckTransaction(false)}
                         className={styles.field + ' ' + styles.button}>&laquo; Back
                    </div>

                </div>
            </div>
        )
    }
}