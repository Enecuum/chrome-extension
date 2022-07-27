import React, {useEffect, useState} from "react";
import styles from "../css/index.module.css";
import Input from "../elements/Input";
import {apiController} from "../../utils/apiController";
import {generateIcon, shortHashLong} from "../Utils";

let trustedTokens = apiController.getTokenList()

export default function Assets(props) {

    const [isShowUntrustedTokens, setShowUntrustedTokens] = useState(false)
    const [isShowAddToken, setShowAddToken] = useState(false)

    const [addTokenName, setAddTokenName] = useState('')

    let [tokens, setTokens] = useState([])
    let [findTokens, setFindTokens] = useState([])

    let renderAssets = (trusted) => {

        let assetsElements = []
        let trustedAssetsElements = []
        let notTrustedAssetsElements = []

        let mainToken = props.assets.find(element => element.main === true)

        let assetsSort = props.assets.sort((a, b) => Number(a.amount) - Number(b.amount))
        assetsSort.splice(props.assets.indexOf(mainToken), 1)

        if (mainToken) {
            assetsSort.unshift(mainToken)
        }

        // console.log(mainToken)
        // console.log(assets[0])
        // console.log(assetsSort.indexOf(assets[0]))

        for (const key in assetsSort) {

            const item = assetsSort[key]

            let element =
                <div key={key}
                     className={styles.asset + ' ' + (props.user.token === item.tokenHash ? styles.asset_select : '')}
                     onClick={() => {
                         props.changeToken(item.tokenHash)
                             .then()
                     }}>
                    <img className={styles.icon} src={item.image}/>
                    <div>
                        <div>
                            {(Number(item.amount) / item.decimals).toFixed(4)}
                            {' '}
                            {item.ticker}
                        </div>
                        <div className={styles.time}>
                            $
                            {(Number(item.usd) / 1e10).toFixed(2)}
                            {' '}
                            USD
                        </div>
                    </div>
                </div>

            if (trustedTokens.find(token => token.address === item.tokenHash))
                trustedAssetsElements.push(element)
            else
                notTrustedAssetsElements.push(element)
        }

        // console.log(trustedAssetsElements)
        // console.log(notTrustedAssetsElements)

        assetsElements = assetsElements.concat(trustedAssetsElements)
        // assetsElements.push(<div key={'separator'} className={`${styles.asset_separator}`}>NOT TRUSTED</div>)
        // assetsElements = assetsElements.concat(notTrustedAssetsElements)

        // console.log(assetsElements)

        if (trusted)
            return trustedAssetsElements
        else
            return notTrustedAssetsElements
    }

    let renderFindElements = (assetsSort) => {

        // caption: "SecurityCoin"
        // hash: "ab49c2de1843883bb15230ee5ef52ca1677fa20c9efe265a4023033fe6fe5580"
        // ticker

        let assetsElements = []

        for (const key in assetsSort) {

            const item = assetsSort[key]

            let element =
                <div key={key}
                     className={styles.asset}
                     onClick={() => {}}>
                    <img className={styles.icon} src={generateIcon(item.hash)}/>
                    <div>
                        <div>
                            {item.ticker}
                        </div>
                        <div className={styles.time}>
                            {item.caption ? item.caption : '' + ' ' + shortHashLong(item.hash)}
                        </div>
                    </div>
                </div>

            assetsElements.push(element)
        }

        return assetsElements
    }

    // let addAsset = () => {
    //     setAssets([...assets, {
    //         amount: 0,
    //         ticker: 'COIN',
    //         usd: '0.00',
    //         image: './images/icons/3.png'
    //     }])
    // }

    let onChangeTokenName = (e) => {
        let selectedFindTokens = tokens.filter(token =>
            (token.caption && token.caption.includes(e.target.value)) ||
            token.hash.includes(e.target.value) ||
            token.ticker.includes(e.target.value))
        setFindTokens(selectedFindTokens)
        setAddTokenName(e.target.value)
    }

    let renderAddToken = () => {

        apiController.getAllTokens().then(tokens => {
            setTokens(tokens)
        })

        return <Input type="text"
                      spellCheck={false}
                      onChange={(e) => onChangeTokenName(e)}
                      value={addTokenName}
                      className={styles.field + ' ' + (addTokenName.length > 0 ? styles.field_correct : '')}
                      label={'Add token'}
                      placeholder={'Token name or hash'}
        />
    }


    useEffect(() => {
    }, [])

    return (
        <div className={styles.bottom_assets + (props.activeTab === 0 ? '' : ` ${styles.bottom_list_disabled}`)}>

            {renderAssets(true)}

            {!isShowAddToken ? <div onClick={() => {setShowAddToken(true)}}
                                    className={`${styles.field} ${styles.button} ${styles.button_blue}`}>
                Add token
            </div> : renderAddToken()}

            <div className={styles.find}>{renderFindElements(findTokens)}</div>

            {isShowUntrustedTokens && <div className={`${styles.field}`}>NOT TRUSTED:</div>}

            {!isShowUntrustedTokens ? <div onClick={() => setShowUntrustedTokens(true)}
                                           className={`${styles.field} ${styles.button}`}>
                Show untrusted tokens
            </div> : renderAssets(false)}

        </div>
    )
}