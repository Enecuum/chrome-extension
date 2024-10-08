package com.enecuum.pwa;

import android.app.ActivityManager;
import android.app.Application;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.util.Log;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import org.json.JSONException;

import com.google.gson.Gson;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

@CapacitorPlugin(name = "PoA")
public class PoA extends Plugin {

    private String net;
    private String port;
    private String TAG = "POA";
    public static String getPOA = "";

    private Boolean isMining = false;

    private Boolean STOPPED = false;

    public static List<String> ipUpdaterList = new ArrayList<>();
    private Timer ipUpdateTimer;

    @PluginMethod()
    public void start(PluginCall call) throws JSONException {

        String jsonString = call.getString("data");
        net = call.getString("net");
        port = call.getString("port");

        Log.d(TAG, "network: " + net);
        Log.d(TAG, "port: " + port);
        try {
            Intent PoAIntent = new Intent();
            PoAIntent.setAction(MainActivity.PoAservice);
            PoAIntent.setPackage(getActivity().getPackageName());
            PoAIntent.putExtra("miners", jsonString).putExtra("net", net).putExtra("port", port).putExtra(MainActivity.PARAM_TASK, MainActivity.PARAM_START_POA);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                updateTimerInit();
                getActivity().startForegroundService(PoAIntent);
            }
            Log.d(TAG, "Started");
        } catch (Exception ex) {
            System.out.println();
            Log.d(TAG, "error in json\n" + ex.getMessage());
        }
        call.resolve();
    }

    @PluginMethod()
    public void stop(PluginCall call) {
        try {
//            getActivity().startForegroundService(new Intent(MainActivity.PoAservice).putExtra(MainActivity.PARAM_STOP,true));
            getActivity().stopService(new Intent(MainActivity.PoAservice).setPackage(getActivity().getPackageName()));
            updateTimerPurge();
        } catch (Exception ex) {
            Log.d(TAG, "No activity");
        }

        call.resolve();
    }

    @PluginMethod()
    public void updateMiner(PluginCall call) {
        Gson g = new Gson();
        String jsonString = call.getString("data");
        try {
            Intent PoAService = new Intent(MainActivity.PoAservice).setPackage(getActivity().getPackageName());
            PoAService.putExtra(MainActivity.PARAM_TASK, MainActivity.PARAM_UPDATE_TOKEN).putExtra("data", jsonString);
            getActivity().startForegroundService(PoAService);

        } catch (Exception ex) {
            Log.d(TAG, "error in change token");
        }
    }

    @PluginMethod()
    public void minerSwitch(PluginCall call) {
        Gson g = new Gson();
        String jsonString = call.getString("data");
        try {
            Intent PoAService = new Intent(MainActivity.PoAservice).setPackage(getActivity().getPackageName());
            PoAService.putExtra(MainActivity.PARAM_TASK, MainActivity.PARAM_SWITCH_MINER).putExtra("data", jsonString);
            getActivity().startForegroundService(PoAService);
        } catch (Exception ex) {
            Log.d(TAG, "error in switch miner");
        }
    }

    @PluginMethod()
    public void getServiceStatus(PluginCall call) {
        Boolean status;
        try {
            ActivityManager res = (ActivityManager) getActivity().getSystemService(Context.ACTIVITY_SERVICE);
            List<ActivityManager.RunningServiceInfo> rs = res.getRunningServices(50);
            status = rs.size() == 0 ? false : true;
            getPOA = status ? getPOA : "";
            isMining = status;
            JSObject obj = new JSObject();
            obj.put("status", status);
            call.resolve(obj);
        } catch (Exception ex) {
            Log.d(TAG, "error in get service status");
            JSObject obj = new JSObject();
            obj.put("status", false);
            call.resolve(obj);
        }
    }

    @PluginMethod()
    public void getMiners(PluginCall call) {
        Gson g = new Gson();
        try {
            if (getPOA.equals("")) {
                throw new Exception();
            }
            JSObject obj = new JSObject();
            MinerBrodcast[] miners = g.fromJson(getPOA, MinerBrodcast[].class);
            for (MinerBrodcast miner : miners) {
                obj.put(miner.publicKey, miner.status);
            }
            call.resolve(obj);
        } catch (Exception ex) {
            JSObject obj = new JSObject();
            obj.put("status", false);
            obj.put("mining", false);
            call.resolve(obj);
        }

    }

    @PluginMethod()
    public void changeIPAllMiners(PluginCall call) {
        String jsonString = call.getString("data");
        try {
            Intent PoAService = new Intent(MainActivity.PoAservice).setPackage(getActivity().getPackageName());
            PoAService.putExtra(MainActivity.PARAM_TASK, MainActivity.PARAM_UPDATE_IP_ALL).putExtra("data", jsonString);
            getActivity().startForegroundService(PoAService);
        } catch (Exception ex) {
            Log.d(TAG, "error in change ip all miners");
        }
    }

    private void rebootMiner(Miner miner) {
        Integer buf = miner.publisher.countBlocks;
        miner.publisher.stop();
        miner.restartPublisher(null);
        miner.publisher.init();
        miner.publisher.countBlocks = buf;
    }

    private void commitSwitch(Miner miner, boolean switcher) {
        if (!switcher) {
            miner.publisher.stop();
        } else {
           miner.restartPublisher(null);
           miner.publisher.init();
        }
    }

    private void updateTimerInit() {
        Gson g = new Gson();
        ipUpdateTimer = new Timer();
        ipUpdateTimer.schedule(new TimerTask() {
            @Override
            public void run() {
                try {
                    if (ipUpdaterList.size() > 0) {
                        Log.d(TAG, "run: " + ipUpdaterList.size());
                        String buf;
                        for (Integer i = 0; i < ipUpdaterList.size(); i++) {
                            buf = ipUpdaterList.get(i);
                            Intent intent = new Intent();
                            intent.setPackage(getActivity().getPackageName());
                            intent.putExtra(MainActivity.PARAM_TASK, MainActivity.PARAM_UPDATE_IP);
                            intent.putExtra("data", buf);
                            getActivity().startForegroundService(intent);
                        }
                        ipUpdaterList.clear();
                    }
                } catch (Exception ex) {
                    ex.printStackTrace();
                    Log.d(TAG, "error in t");
                }
            }
        }, 0, 3000);
    }

    private void updateTimerPurge() {
        ipUpdateTimer.cancel();
        ipUpdateTimer.purge();
    }

}
