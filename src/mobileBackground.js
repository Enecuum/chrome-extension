import { Plugins } from '@capacitor/core';
import {startPoa} from "./utils/poa/poaStarter";
import {getMnemonicPrivateKeyHex} from "./ui/Utils";

const { App, BackgroundTask, LocalNotifications } = Plugins;

let mobileBackgroundMiners = []

App.addListener('appStateChange', state => {

    if (!state.isActive) {

        let taskId = BackgroundTask.beforeExit(async () => {

            // In this function We might finish an upload, let a network request
            // finish, persist some data, or perform some other task

            await mineCoins()

            // Must call in order to end our task otherwise
            // we risk our app being terminated, and possibly
            // being labeled as impacting battery life

            BackgroundTask.finish({taskId});
        });
    }
});

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
        accounts.push({publicKey: ENQWeb.Utils.Sign.getPublicKey(privateKey, true), privateKey: privateKey})
    }

    mobileBackgroundMiners = await startPoa(ENQWeb.Enq.User, mobileBackgroundMiners, accounts)

    // We have to run new PoA here

    LocalNotifications.schedule({
        notifications: [{
            title: "Mining",
            body: "Mining for Account 1 of " + mobileBackgroundMiners.length,
            id: this.id++,
            schedule: {
                at: new Date(Date.now() + 1000 * 2)
            },
            sound: null,
            attachments: null,
            actionTypeId: "",
            extra: null
        }]
    });

    // // Example of long task
    // let start = new Date().getTime();
    // for (let i = 0; i < 1e18; i++) {
    //     if (new Date().getTime() - start > 20000) {
    //         break;
    //     }
    // }
}