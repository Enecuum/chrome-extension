import React, {useEffect, useState} from "react";
import styles from "../../css/index.module.css";
import Input from "../../elements/Input";
import {apiController} from "../../../utils/apiController";
import {generateIcon, shortHashLong} from "../../Utils";


export default function Assets(props) {

    // let userTrustedTokens = JSON.parse(localStorage.getItem('trustedTokens'))
    // for (let i in userTrustedTokens) {
    //     console.log(userTrustedTokens[i])
    // }

    // console.log(props.user)
    const [trustedTokens, setTrustedTokens] = useState(apiController.getTokenList())

    const [isShowUntrustedTokens, setShowUntrustedTokens] = useState(false)
    const [isShowAddToken, setShowAddToken] = useState(false)

    const [addTokenName, setAddTokenName] = useState('')

    let [tokens, setTokens] = useState([])
    let [findTokens, setFindTokens] = useState([])

    // let [addedTokens, setAddedTokens] = useState(JSON.parse(localStorage.getItem('trustedTokens')))

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

        for (const key in assetsSort) {

            const item = assetsSort[key]

            let element = generateAssetElement(item)

            if (trustedTokens.find(token => token.address === item.tokenHash))
                trustedAssetsElements.push(element)
            else
                notTrustedAssetsElements.push(element)
        }

        if (trusted)
            return trustedAssetsElements
        else
            return notTrustedAssetsElements
    }

    let generateAssetElement = (item) => {

        let element =
            <div key={item.tokenHash}
                 className={styles.asset + ' ' + (props.user.token === item.tokenHash ? styles.asset_select : '')}
                 onClick={() => {
                     props.changeToken(item.tokenHash).then()
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

        return element
    }

    let renderAddedElements = () => {

        let assetsElements = []

        let addedTokens = props.userTrustedTokens
        // console.log(props.userTrustedTokens)

        for (const key in addedTokens) {
            const item = {
                amount: addedTokens[key].amount ? addedTokens[key].amount : 0,
                ticker: addedTokens[key].ticker,
                usd: addedTokens[key].usd ? addedTokens[key].usd : 0,
                image: generateIcon(addedTokens[key].hash),
                tokenHash: addedTokens[key].hash,
                decimals: addedTokens[key].decimals ? addedTokens[key].decimals : 10 ** 10,
                main: false
            }

            let element = generateAssetElement(item)
            assetsElements.push(element)
        }

        return assetsElements
    }

    let renderFindElements = (assetsSort) => {

        let assetsElements = []

        for (const key in assetsSort) {

            const item = assetsSort[key]

            let element =
                <div key={key}
                     className={styles.asset}
                     onClick={() => {
                         //TODO add to local storage
                         props.addUserTrustedToken(item)
                         setShowAddToken(false)
                         setAddTokenName('')
                         setFindTokens([])
                     }}>
                    <img className={styles.icon} src={generateIcon(item.hash)}/>
                    <div>
                        <div>{item.ticker + ' ' + (item.caption ? '(' + item.caption + ')' : '')}</div>
                        <div className={styles.time}>
                            {shortHashLong(item.hash)}
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
        setFindTokens(e.target.value === '' ? [] : selectedFindTokens)
        setAddTokenName(e.target.value)
    }

    let renderAddToken = () => {

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

        apiController.getAllTokens().then(tokens => {
            setTokens(tokens)
        })

        apiController.getServerTokenList().then(tokens => {
            setTrustedTokens(tokens)
        })

    }, [])

    return (
        <div className={styles.bottom_assets + (props.activeTab === 0 ? '' : ` ${styles.bottom_list_disabled}`)}>

            {renderAssets(true)}

            {renderAddedElements()}

            {!isShowAddToken ? <div onClick={() => {
                setShowAddToken(true)
            }} className={`${styles.field} ${styles.button}`}>
                Add token
            </div> : renderAddToken()}

            {findTokens.length > 0 ? <div className={styles.find}>
                <div className={`${styles.field}`}>FOUND:</div>
                {renderFindElements(findTokens)}
            </div> : ''}

            {isShowUntrustedTokens && <div className={`${styles.field}`}>NOT TRUSTED:</div>}

            {!isShowUntrustedTokens ? <div onClick={() => setShowUntrustedTokens(true)}
                                           className={`${styles.field} ${styles.button}`}>
                Show untrusted tokens
            </div> : renderAssets(false)}

        </div>
    )
}