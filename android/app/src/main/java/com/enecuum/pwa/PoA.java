package com.enecuum.pwa;

import android.content.Intent;
import android.app.Activity;
import android.util.Log;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import org.json.JSONException;

import com.google.gson.Gson;

import java.util.Timer;
import java.util.TimerTask;

@CapacitorPlugin(name = "PoA")
public class PoA extends Plugin {

    public Miner[] miners;
    public Intent PoAIntent;
    private Timer timer;
    private Account[] accounts;
    private String net;
    private String TAG = "POA";

    @PluginMethod()
    public void start(PluginCall call) throws JSONException {
        Gson g = new Gson();

        String jsonString = call.getString("data");
        net = call.getString("net");
        try {
            accounts = g.fromJson(jsonString, Account[].class);
            System.out.println(accounts.length);
            System.out.println(net);
            miners = new Miner[accounts.length];
            for (int i = 0; i < accounts.length; i++) {
                miners[i] = new Miner(net, accounts[i].privateKey, accounts[i].token, accounts[i].referrer);
                miners[i].publisher.mining = accounts[i].status;
            }
            //old format start miner
//            for (Miner miner : miners) {
//                miner.publisher.init();
//            }
            Log.d(TAG, "Started");

        } catch (Exception ex) {
            System.out.println();
            Log.d(TAG, "error in json\n" + ex.getMessage());
        }
        if (this.PoAIntent == null) {
            PoAService.miners = miners;
//            this.PoAIntent = new Intent(getActivity(), PoAService.class);
            this.PoAIntent = new Intent();
            this.PoAIntent.setAction("com.enecuum.pwa.PoAService");
            this.PoAIntent.setPackage(getActivity().getPackageName());
            getActivity().startService(PoAIntent);
        }
        checkMiners();
        call.resolve();
    }

    @PluginMethod()
    public void stop(PluginCall call) {
        cleanTimer();
        for (Miner miner : miners) {
            try {
                miner.publisher.stop();
            } catch (Exception ex) {
                Log.d(TAG, "Stop miner error!\n" + ex.getStackTrace() + "\n" + ex.getMessage());
            }
        }
        getActivity().stopService(this.PoAIntent);
        this.PoAIntent = null;
        call.resolve();
    }

    @PluginMethod()
    public void updateMiner(PluginCall call) {
        Gson g = new Gson();
        String jsonString = call.getString("data");
        try {
            Account account = g.fromJson(jsonString, Account.class);
            for (Miner miner : miners) {
                if (miner.publisher.publicKey.equals(account.publicKey)) {
                    miner.token = account.token;
                    rebootMiner(miner);
                    Log.d(TAG, String.format("Change %s token on %s", account.publicKey.substring(0, 6), account.token));
                }
            }
        } catch (Exception ex) {
            Log.d(TAG, "error in change token");
        }
    }

    @PluginMethod()
    public void minerSwitch(PluginCall call) {
        Gson g = new Gson();
        String jsonString = call.getString("data");
        try {
            Account account = g.fromJson(jsonString, Account.class);
            for (Miner miner : miners) {
                if (miner.publisher.publicKey.equals(account.publicKey)) {
                    commitSwitch(miner, account.status);
                    Log.d(TAG, String.format("switch %s %s", account.publicKey.substring(0, 6), account.status ? "ON" : "OFF"));
                }
            }
        } catch (Exception ex) {
            Log.d(TAG, "error in switch miner");
        }
    }

    @PluginMethod()
    public void getMiners(PluginCall call) {
        try {
            JSObject obj = new JSObject();
            if (miners != null) {
                for (Miner miner : miners) {
                    obj.put(miner.publisher.publicKey, miner.publisher.status);
                }
                call.resolve(obj);
            } else {
                obj.put("status", false);
            }
            if (this.PoAIntent == null) {
                obj.put("mining", false);
            }
            call.resolve(obj);
        } catch (Exception ex) {
            JSObject obj = new JSObject();
            obj.put("status", false);
            obj.put("mining", false);
            call.resolve(obj);
        }

    }

    private void checkMiners() {
        timer = new Timer();
        timer.schedule(new TimerTask() {
            @Override
            public void run() {
                try {
                    for (Integer i = 0; i < miners.length; i++) {
//                        System.out.println(String.format("miner %s is %s", miners[i].publisher.publicKey.substring(0,6), miners[i].publisher.status));
                        if (miners[i].publisher.reboot) {
                            rebootMiner(miners[i]);
                        }
                    }
                } catch (Exception ex) {
                    Log.d(TAG, "can't take fields");
                }
            }
        }, 0, 1000 * 5);
    }

    private void rebootMiner(Miner miner) {
        Integer buf = miner.publisher.countBlocks;
        miner.publisher.stop();
        miner.restartPublisher();
        miner.publisher.init();
        miner.publisher.countBlocks = buf;
    }

    private void commitSwitch(Miner miner, boolean switcher) {
        if (!switcher) {
            miner.publisher.stop();
        } else {
            miner.restartPublisher();
            miner.publisher.init();
        }
    }

    private void cleanTimer() {
        timer.cancel();
        timer.purge();
    }
}
