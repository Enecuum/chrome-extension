import { Plugins } from '@capacitor/core';

const { App, BackgroundTask, LocalNotifications } = Plugins;

// let mobileBackgroundMiners = []
let mobileBackgroundMiners = [
    {
        publicKey: '',
        mining: true,
        token: '',
    }
]

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

    userStorage.promise.sendPromise({poa: true, account}).then(miners => {
        mobileBackgroundMiners = miners
    })

    mobileBackgroundMiners = await userStorage.promise.sendPromise({
        poa: true,
        get: true,
    })

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