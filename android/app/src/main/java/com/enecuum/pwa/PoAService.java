package com.enecuum.pwa;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.IBinder;
import android.provider.Settings;
import android.util.Log;

import androidx.core.app.NotificationCompat;

import java.util.Timer;
import java.util.TimerTask;

import com.getcapacitor.FileUtils;
import com.getcapacitor.JSObject;
import com.google.gson.Gson;
import com.kenai.jffi.Main;

public class PoAService extends Service {

    private String TAG = "PoAService";

    private Miner[] miners;
    private Timer timer;

    private Notification notification;
    private int id;
    private Account[] accounts;
    private String net;

    PendingIntent pi;

    @Override
    public void onCreate() {
//        startActivity(new Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS, Uri.parse("package:"getPackageName())));
        Log.d(TAG, "onCreate");
        super.onCreate();
        String CHANNEL_ID = "PoA service";
        NotificationChannel channel = new NotificationChannel(CHANNEL_ID,
                "Enecuum PoA",
                NotificationManager.IMPORTANCE_DEFAULT);

//        mNotificationManager.createNotificationChannel(channel);
        ((NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE)).createNotificationChannel(channel);

        notification = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("Enecuum")
                .setContentText("PoA in work").build();
        id = 1;
        startForeground(id, notification);
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        try {
            String type = intent.getStringExtra(MainActivity.PARAM_TASK);
            Log.d(TAG, "onStartCommand: " + type);
            if (type.equals(MainActivity.PARAM_START_POA)) {
                if (miners == null) {
                    Gson g = new Gson();
                    String jsonString = intent.getStringExtra("miners");
                    accounts = g.fromJson(jsonString, Account[].class);
                    net = intent.getStringExtra("net");
                    System.out.println(accounts.length);
                    System.out.println(net);
                    miners = new Miner[accounts.length];
                    for (int i = 0; i < accounts.length; i++) {
                        miners[i] = new Miner(net, accounts[i].privateKey, accounts[i].token, accounts[i].referrer);
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
                Gson g = new Gson();
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
                Gson g = new Gson();
                String jsonString = intent.getStringExtra("data");
                Account account = g.fromJson(jsonString, Account.class);
                for (Miner miner : miners) {
                    if (miner.publisher.publicKey.equals(account.publicKey)) {
                        commitSwitch(miner, account.status);
                        Log.d(TAG, String.format("switch %s %s", account.publicKey.substring(0, 6), account.status ? "ON" : "OFF"));
                    }
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
                        if (miners[i].publisher.reboot) {
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
    }


    private void rebootMiner(Miner miner) {
        Integer buf = miner.publisher.countBlocks;
        miner.publisher.stop();
        miner.restartPublisher();
        miner.publisher.init();
        miner.publisher.countBlocks = buf;
    }

    private void cleanTimer() {
        timer.cancel();
        timer.purge();
    }

    private void commitSwitch(Miner miner, boolean switcher) {
        if (!switcher) {
            miner.publisher.stop();
        } else {
            miner.restartPublisher();
            miner.publisher.init();
        }
    }
}


