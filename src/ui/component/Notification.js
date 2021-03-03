import React from "react";
import styles from "../index.module.css";

export default class Network extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            task:{
            }
        }
        this.loadTask = this.loadTask.bind(this)

        this.loadTask()

    }

    loadTask(){
        let tasks = disk.task.loadTask()
        let ids = Object.keys(tasks)
        if(ids.length > 0 ){
            let data = {
                url:tasks[ids[0]].cb.url,
                type:tasks[ids[0]].type,
                id:tasks[ids[0]].cb.taskId
            }
            console.log(data)
            this.setState({task:data})
        }

    }

    render() {

        return (
            <div className={styles.main}>

                <div className={styles.form}>

                    <div className={styles.text}>1</div>
                    <div className={styles.text}>2</div>
                    
                </div>

                <div onClick={() => { this.props.setNotify(false) }}
                        className={styles.field + ' ' + styles.button}>&laquo; Back
                    </div>

            </div>
        )
    }
}