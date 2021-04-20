import React, {useState} from 'react'
import styles from '../css/elements.module.css'

export default function Menu(props) {
    const [amount, setAmount] = useState(0)

    const expand = () => chrome.tabs.create({url: 'popup.html'})
    const window = () => chrome.windows.create({url: 'popup.html', width: 350, height: 630, type: "popup"})

    const explorer = () => chrome.tabs.create({url: 'https://' + ENQWeb.Net.currentProvider + '.enecuum.com/#!/account/' + props.publickKey})

    const setNet = async (value) => {

        localStorage.setItem('net', value)
        ENQWeb.Net.provider = value
        await disk.user.loadUser().then(async acc => {
            acc.net = value;
            await disk.promise.sendPromise({account: true, set: true, data: acc})
        })
        location.reload(false)
    }

    const locked = async () => {
        console.log('LOCK')
        if (disk.lock.getHashPassword()) {
            props.setLocked(true)
            await asyncRequest({lock: true})
        }
        //TODO close popup
    }

    const version = chrome.runtime.getManifest().version
    console.log(version)

    return (
        <div className={styles.menu}>

            <div className={styles.lock} onClick={locked}><img src="./images/lock.png"/></div>
            <div className={styles.title}>My accounts</div>
            <div className={styles.button_link + ' ' + styles.button_link_active}>Account 1</div>
            <div className={styles.button_link}>Account 2</div>

            <div className={styles.separator}/>

            <div className={styles.button_link} onClick={props.setPassword}>Set password</div>
            {/*<div className={styles.button_link} onClick={expand}>Expand</div>*/}
            <div className={styles.button_link} onClick={window}>Popup on</div>
            <div className={styles.button_link} onClick={explorer}>Show in blockchain explorer</div>
            {/*<div className={styles.button_link} onClick={() => setNet('pulse')}>Network: PULSE</div>*/}
            <div className={styles.button_link} onClick={() => setNet('bit')}>Network: BIT</div>
            <div className={styles.button_link} onClick={() => setNet('bit-dev')}>Network: BIT-DEV</div>
            <div className={styles.button_link_logout}>
                <div className={styles.button_link} onClick={props.logout}>Logout</div>
                <div className={styles.version}>{version}</div>
            </div>

        </div>
    )
}
