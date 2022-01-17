import styles from "../css/elements.module.css";
import React, {useState} from 'react';

export default function Input(props) {

    const [placeholder, setPlaceholder] = useState(props.placeholder)

    const generatePlaceholder = () => {
        return ''
    }

    const onFocus = () => {
    }

    return (
        <div className={styles.inputContainer}>
            <label htmlFor={props.label}>{props.label ? props.label : props.placeholder}</label>
            <input
                autoFocus={!!props.autoFocus}
                type={props.type}
                spellCheck={false}
                onChange={props.onChange}
                onFocus={onFocus}
                onKeyUp={(e) => {
                    if ((e.key === 'Enter' || e.keyCode === 13) && props.enter) {
                        props.enter()
                    }
                }}
                value={props.value}
                className={props.className}
                placeholder={placeholder}
            />
        </div>
    )
}
