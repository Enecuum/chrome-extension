import React from 'react';
import {render} from 'react-dom'
import styles from './index.module.css';

function App() {
    return (
        <Login/>
    )
}

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.submit = this.submit.bind(this);
        this.state = {value: ''};
    }

    handleChange(e) {
        this.setState({value: e.target.value});
    }

    submit() {
        console.log(this.state.value)
    }

    render() {
        return (
            <div>
                <input
                    id='markdown-content'
                    onChange={this.handleChange}
                    defaultValue={this.state.value}
                    placeholder={'Private key'}
                    className={styles.field}
                />
                <div onClick={this.submit}
                     className={[styles.field, styles.button]}>Submit
                </div>
            </div>
        )
    }
}

function Account() {
    return (
        <div>
            <div>Public key</div>
            <div>KEY</div>
            <div>Balance:</div>
        </div>
    )
}

export async function initApp(background) {
    render(
        <App/>,
        document.getElementById('app-content')
    );
}

// let styles = {
//     body: {
//
//     },
//     field: {
//         width: '80%',
//         background: 'ghostwhite',
//         padding: '10px'
//     }
// }