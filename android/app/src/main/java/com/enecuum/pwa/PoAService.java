package com.enecuum.pwa;

import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
import android.util.Log;

public class PoAService extends Service {

    private String TAG = "PoAService";

    public static Miner[] miners;


    @Override
    public void onCreate() {
        Log.d(TAG, "onCreate");
        super.onCreate();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        try {
            Log.d(TAG, "miners: " + miners.length);
            for (Miner miner : miners) {
                miner.publisher.init();
            }

        } catch (Exception e) {
        }

//        return super.onStartCommand(intent, flags, startId);
        return START_REDELIVER_INTENT;
    }

    @Override
    public void onDestroy() {
        Log.d(TAG, "Destroyed");
        try {
            for (Miner miner : miners) {
                miner.publisher.stop();
            }
        } catch (Exception e) {
        }
        super.onDestroy();

    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}


