import {CapacitorConfig} from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.enecuum.pwa',
    appName: 'enecuum',
    webDir: 'dist',
    bundledWebRuntime: false,
    backgroundColor: '#282D46',
    plugins: {
        "LocalNotifications": {
            "smallIcon": "ic_stat_512.png",
            "iconColor": "#000000",
            "sound": "beep.wav"
        },
        "SplashScreen": {
            "launchShowDuration": 0
        },
        "PushNotifications": {
            "presentationOptions": ["badge", "sound", "alert"]
        }
    },
    server: {
        "hostname": "enecuum.com",
        "androidScheme": "https",
        "iosScheme": "https"
    }
};

export default config;
