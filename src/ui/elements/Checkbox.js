import elements from "../css/elements.module.css";
import styles from "../css/index.module.css";
import React, {useState} from 'react';

export default function Checkbox(props) {

    let onFocus = ()=>{}

    return (
        <div className={elements.inputContainer}>
            <div className={props.className}>
                <input
                    autoFocus={!!props.autoFocus}
                    type={'checkbox'}
                    spellCheck={false}
                    disabled={props.disabled}
                    onChange={props.onChange}
                    onFocus={onFocus}
                    onKeyUp={(e) => {
                        if ((e.key === 'Enter' || e.keyCode === 13) && props.enter) {
                            props.enter()
                        }
                    }}
                    className={styles.smallCheckbox}
                />
                <div className={styles.smallCheckboxText}>
                    {props.placeholder}
                </div>
            </div>
        </div>
    )
}
