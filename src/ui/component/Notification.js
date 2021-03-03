import React from "react";
import styles from "../index.module.css";

export default class Network extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            task:{}
        }
        this.loadTask = this.loadTask.bind(this)

    }

    loadTask(){

    }

    render() {

        return (
            <div className={styles.main}>

                <div className={styles.form}>
                    
                

                </div>
            </div>
        )
    }
}