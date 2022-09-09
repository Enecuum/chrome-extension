package com.enecuum.pwa;

import android.app.Service;
import android.content.Intent;
import android.os.IBinder;


public class PoAService extends Service {

    public static Miner[] miners;


    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        try {
            System.out.println("miners: " + miners.length);
            for (Miner miner : this.miners) {
                miner.publisher.init();
            }

        } catch (Exception e) {
        }

        return super.onStartCommand(intent, flags, startId);
    }

    @Override
    public void onDestroy() {
        System.out.println("Destroyed");
        try {
            for (Miner miner : this.miners) {
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


