package com.enecuum.pwa;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.IBinder;
import android.util.Log;

import java.util.Timer;
import java.util.TimerTask;

import com.getcapacitor.JSObject;
import com.google.gson.Gson;

public class PoAService extends Service {

    private String TAG = "PoAService";

    private Miner[] miners;
    private Timer timer;
    private Timer pingTimer;
    private Boolean usePingSocket = true;

    private Notification notification;
    private int id;
    private Account[] accounts;
    private String net;
    private String port;

    @Override
    public void onCreate() {
//        startActivity(new Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS, Uri.parse("package:"getPackageName())));
        Log.d(TAG, "onCreate");
        super.onCreate();
        Intent IPUpdateService = new Intent(MainActivity.IPUpdateService).setPackage(getPackageName());
        startService(IPUpdateService);
        String CHANNEL_ID = "PoA service";
        NotificationChannel channel = new NotificationChannel(CHANNEL_ID,
                "Enecuum PoA",
                NotificationManager.IMPORTANCE_DEFAULT);

//        mNotificationManager.createNotificationChannel(channel);
        ((NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE)).createNotificationChannel(channel);

//        notification = new NotificationCompat.Builder(this, CHANNEL_ID)
//                .setContentTitle("Enecuum")
//                .setContentText("PoA in work").build();

        notification =
                new Notification.Builder(this, CHANNEL_ID)
                        .setContentTitle(getText(R.string.app_name))
                        .setContentText("PoA in work")
                        .setSmallIcon(R.drawable.ic_stat_512)
                        .build();
        id = 1;
        startForeground(id, notification);
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Gson g = new Gson();
        try {
            String type = intent.getStringExtra(MainActivity.PARAM_TASK);
            Log.d(TAG, "onStartCommand: " + type);
            if (type.equals(MainActivity.PARAM_START_POA)) {
                if (miners == null) {
                    String jsonString = intent.getStringExtra("miners");
                    accounts = g.fromJson(jsonString, Account[].class);
                    net = intent.getStringExtra("net");
                    port = intent.getStringExtra("port");
                    Log.d(TAG, "accounts: " + accounts.length);
                    Log.d(TAG, "net: " + net);
                    miners = new Miner[accounts.length];
                    for (int i = 0; i < accounts.length; i++) {
                        miners[i] = new Miner(net, port, accounts[i].privateKey, accounts[i].token, accounts[i].referrer);
                        miners[i].publisher.mining = accounts[i].status;
                    }

                    Log.d(TAG, "miners: " + miners.length);
                    for (Miner miner : miners) {
                        if (!miner.inWork) {
                            miner.publisher.init();
                            miner.inWork = true;
                        }
                    }
                    checkMiners();
                } else {
                    Log.d(TAG, "onStartCommand: miners started");
                }

            }
            if (type.equals(MainActivity.PARAM_GET_POA)) {
                JSObject obj = new JSObject();
                if (miners != null) {
                    for (Miner miner : miners) {
                        obj.put(miner.publisher.publicKey, miner.publisher.status);
                    }
                }
                sendBroadcast(new Intent(MainActivity.BROADCAST_ACTION).putExtra(MainActivity.PARAM_TASK, MainActivity.PARAM_GET_POA).putExtra(MainActivity.PARAM_STATUS, MainActivity.PARAM_FINISH).putExtra(MainActivity.PARAM_RESULT, obj.toString()));

            }
            if (type.equals(MainActivity.PARAM_UPDATE_TOKEN)) {
                String jsonString = intent.getStringExtra("data");
                Account account = g.fromJson(jsonString, Account.class);
                for (Miner miner : miners) {
                    if (miner.publisher.publicKey.equals(account.publicKey)) {
                        miner.token = account.token;
                        rebootMiner(miner);
                        Log.d(TAG, String.format("Change %s token on %s", account.publicKey.substring(0, 6), account.token));
                    }
                }
            }
            if (type.equals(MainActivity.PARAM_SWITCH_MINER)) {
                String jsonString = intent.getStringExtra("data");
                Account account = g.fromJson(jsonString, Account.class);
                for (Miner miner : miners) {
                    if (miner.publisher.publicKey.equals(account.publicKey)) {
                        commitSwitch(miner, account.status);
                        Log.d(TAG, String.format("switch %s %s", account.publicKey.substring(0, 6), account.status ? "ON" : "OFF"));
                    }
                }
            }
            if (type.equals(MainActivity.PARAM_UPDATE_IP)) {
                String jsonString = intent.getStringExtra("data");
                IPUpdater ipUpdater = g.fromJson(jsonString, IPUpdater.class);
                for (Miner miner : miners) {
                    if (miner.publisher.publicKey.equals(ipUpdater.publicKey)) {
                        miner.url = ipUpdater.ip;
                        miner.port = ipUpdater.port;
                        miner.restartPublisher(null);
                        miner.publisher.init();
                    }
                }
            }
            if (type.equals(MainActivity.PARAM_UPDATE_IP_ALL)) {
                String jsonString = intent.getStringExtra("data");
                IPUpdater ipUpdater = g.fromJson(jsonString, IPUpdater.class);
                for (Miner miner : miners) {
                    miner.url = ipUpdater.ip;
                    miner.port = ipUpdater.port;
                    miner.restartPublisher(null);
                    miner.publisher.init();
                }
            }
            if (type.equals(MainActivity.PARAM_STOP)) {
                stopSelf();
            }


        } catch (Exception e) {
            e.printStackTrace();
        }


        return super.onStartCommand(intent, flags, startId);
//        return START_REDELIVER_INTENT;
    }

    @Override
    public void onDestroy() {
        Log.d(TAG, "Destroyed");
        try {
            for (Miner miner : miners) {
                miner.publisher.stop();
            }
            cleanTimer();
        } catch (Exception e) {
        }
        try {
            Intent IPUpdateService = new Intent(MainActivity.IPUpdateService).setPackage(getPackageName());
            stopService(IPUpdateService);
        } catch (Exception e) {
        }
        super.onDestroy();
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }


    private void checkMiners() {
        timer = new Timer();
        timer.schedule(new TimerTask() {
            @Override
            public void run() {
                try {
                    MinerBrodcast[] obj = new MinerBrodcast[miners.length];
                    for (Integer i = 0; i < miners.length; i++) {
//                        System.out.println(String.format("miner %s is %s", miners[i].publisher.publicKey.substring(0,6), miners[i].publisher.status));
                        obj[i] = new MinerBrodcast();
                        obj[i].publicKey = miners[i].publisher.publicKey;
                        obj[i].status = miners[i].publisher.status;
                        if (miners[i].publisher.reboot && miners[i].publisher.restartMiner) {
                            rebootMiner(miners[i]);
                        }
                    }
                    sendBroadcast(new Intent(MainActivity.BROADCAST_ACTION).putExtra(MainActivity.PARAM_TASK, MainActivity.PARAM_GET_POA).putExtra(MainActivity.PARAM_STATUS, MainActivity.PARAM_FINISH).putExtra(MainActivity.PARAM_RESULT, MinerBrodcast.serialize(obj)));
                } catch (Exception ex) {
                    ex.printStackTrace();
                    Log.d(TAG, "can't take fields");
                }
            }
        }, 0, 1000);
        if(usePingSocket.equals(true)){
            pingTimer = new Timer();
            pingTimer.schedule(new TimerTask() {
                @Override
                public void run() {
                    try {
                        for (Miner miner : miners) {
                            try{
//                            Log.d(TAG, "run: pingpong " + miner.publisher.publicKey.substring(0,6));
                                if(miner.publisher.mining.equals(true)){
                                    miner.publisher.ws.sendPing();
                                }
                            }catch (Exception ex){
                                Log.d(TAG, "run: pingpong fall "  + miner.publisher.publicKey.substring(0,6));
                                rebootMiner(miner);
                            }
                        }
                    } catch (Exception ex) {
                        ex.printStackTrace();
                        Log.d(TAG, "can't reboot miners");
                    }
                }
            }, 1000 * 5, 1000 * 5);
        }
    }


    private void rebootMiner(Miner miner) {
        Integer buf = miner.publisher.countBlocks;
        miner.publisher.stop();
        miner.restartPublisher(null);
        miner.publisher.init();
        miner.publisher.countBlocks = buf;
        miner.publisher.status = String.format("Sign block (%d)", buf);
    }

    private void cleanTimer() {
        timer.cancel();
        timer.purge();
        if(usePingSocket.equals(true)){
            pingTimer.cancel();
            pingTimer.purge();
        }
    }

    private void commitSwitch(Miner miner, boolean switcher) {
        if (!switcher) {
            miner.publisher.stop();
        } else {
            miner.restartPublisher(null);
            miner.publisher.mining = true;
            miner.publisher.init();
        }
    }
}


