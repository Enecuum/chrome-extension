import { Plugins } from '@capacitor/core';

const { App, BackgroundTask } = Plugins;

App.addListener('appStateChange', state => {

    if (!state.isActive) {

        let taskId = BackgroundTask.beforeExit(async () => {

            // In this function We might finish an upload, let a network request
            // finish, persist some data, or perform some other task

            mineCoins()

            // Must call in order to end our task otherwise
            // we risk our app being terminated, and possibly
            // being labeled as impacting battery life

            BackgroundTask.finish({taskId});
        });
    }
});

let mineCoins = () => {

    // We have to go to background and find out if there is some miner connections

    // Example of long task
    let start = new Date().getTime();
    for (let i = 0; i < 1e18; i++) {
        if (new Date().getTime() - start > 20000) {
            break;
        }
    }
}