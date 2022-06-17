import { Plugins } from '@capacitor/core'
import { initPoa, startPoa, stopPoa } from './utils/poa/poaStarter'
import { getMnemonicPrivateKeyHex, showNotification } from './ui/Utils'
import { account } from './user'

const {
    App,
    BackgroundTask,
    LocalNotifications,
    Background
} = Plugins
//
// console.log(Plugins)

let mobileBackgroundMiners = []

let getMobileMiners = () => {
    if (mobileBackgroundMiners.length === 0) {
        mobileBackgroundMiners = initPoa(ENQWeb.Enq.User)
    }
    return mobileBackgroundMiners
}

let stopMobileMiners = () => {
    for (let i = 0; i < mobileBackgroundMiners.length; i++) {
        mobileBackgroundMiners[i].publisher.restart = false
    }
    let miners = stopPoa(mobileBackgroundMiners)
    showNotification('Mining', 'Mining is stopped')
    return miners
}

let mineCoins = async () => {

    // We have to go to background and find out if there is some miner connections

    // userStorage.promise.sendPromise({poa: true, account}).then(miners => {
    //     mobileBackgroundMiners = miners
    // })

    mobileBackgroundMiners = await userStorage.promise.sendPromise({
        poa: true,
        get: true,
    })

    let accounts = []

    for (let i = 0; i < ENQWeb.Enq.User.seedAccountsArray.length; i++) {
        let privateKey = getMnemonicPrivateKeyHex(ENQWeb.Enq.User.seed, i)
        accounts.push({
            publicKey: ENQWeb.Utils.Sign.getPublicKey(privateKey, true),
            privateKey: privateKey
        })
    }

    mobileBackgroundMiners = await startPoa(ENQWeb.Enq.User, mobileBackgroundMiners, accounts)

    // We have to run new PoA here

    // showNotification('Mining', 'Mobile background')

    // // Example of long task
    // let start = new Date().getTime();
    // for (let i = 0; i < 1e18; i++) {
    //     if (new Date().getTime() - start > 20000) {
    //         break;
    //     }
    // }
}


let startBackgroundMining = () => {
    let taskId = BackgroundTask.beforeExit(async () => {

        // In this function We might finish an upload, let a network request
        // finish, persist some data, or perform some other task
        showNotification('Info', `Start mining in background`)
        await mineCoins()


        // Must call in order to end our task otherwise
        // we risk our app being terminated, and possibly
        // being labeled as impacting battery life

        BackgroundTask.finish({ taskId })
    })
    return mobileBackgroundMiners
}


const initMobileBackground = (accounts) => {


    App.addListener('appStateChange', state => {

        try {
            showNotification('Mining', `State change`)
        } catch (e) {

        }

        if (!state.isActive) {


            let taskId = BackgroundTask.beforeExit(async () => {

                // In this function We might finish an upload, let a network request
                // finish, persist some data, or perform some other task

                await mineCoins()


                // Must call in order to end our task otherwise
                // we risk our app being terminated, and possibly
                // being labeled as impacting battery life

                BackgroundTask.finish({ taskId })
            })
        }
    })

}

export { initMobileBackground, startBackgroundMining, getMobileMiners, stopMobileMiners }
