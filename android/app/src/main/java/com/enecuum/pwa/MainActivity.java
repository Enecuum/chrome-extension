package com.enecuum.pwa;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.net.Uri;
import android.os.Bundle;
import android.os.PowerManager;
import android.provider.Settings;
import android.util.Log;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    public final static String PARAM_TASK = "task";

    public final static String PARAM_START_POA = "start poa";
    public final static String PARAM_GET_POA = "get poa";
    public final static String PARAM_UPDATE_TOKEN = "update token";
    public final static String PARAM_SWITCH_MINER = "switch miner";
    public final static String PARAM_UPDATE_IP = "update ip";


    public final static String PARAM_RESULT = "result";
    public final static String PARAM_FINISH = "finish";
    public final static String PARAM_STATUS = "status";
    public final static String PARAM_STOP = "STOP";
    public final static String BROADCAST_ACTION = "com.enecuum.pwa.servicebackbroadcast";
    public final static String PoAservice = "com.enecuum.pwa.PoAService";
    public final static String IPUpdateService = "com.enecuum.pwa.IPUpdateService";


    BroadcastReceiver br;

    private String TAG = "MainActivity";

    @Override
    public void onCreate(Bundle savedInstanceState) {
        startActivity(new Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS, Uri.parse("package:" + getPackageName())));
        Log.d(TAG, "onCreate: " + getPackageName());
        super.onCreate(savedInstanceState);
        registerPlugin(PoA.class);
        br = new BroadcastReceiver() {
            public void onReceive(Context context, Intent intent) {
                String task = intent.getStringExtra(PARAM_TASK);
                String status = intent.getStringExtra(PARAM_STATUS);
                String result;
//                Log.d(TAG, "onReceive: task = " + task + ", status = " + status);


                // Ловим сообщения об окончании задач
                if (status.equals(PARAM_FINISH)) {
                    result = intent.getStringExtra(PARAM_RESULT);
//                    Log.d(TAG, "onReceive: " + result);
                    if (task.equals(PARAM_GET_POA)) {
                        PoA.getPOA = result;
                    }
                }
            }
        };
        // создаем фильтр для BroadcastReceiver
        IntentFilter intFilt = new IntentFilter(BROADCAST_ACTION);
        // регистрируем (включаем) BroadcastReceiver
        registerReceiver(br, intFilt);

    }

}
