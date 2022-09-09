package com.enecuum.pwa;

import android.content.Context;
import android.content.Intent;

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
                miners[i] = new Miner(net, accounts[i].privateKey, accounts[i].token);
                miners[i].publisher.mining = accounts[i].status;
            }
            for (Miner miner : miners) {
                miner.publisher.init();
            }
            System.out.println("Started");

        } catch (Exception ex) {
            System.out.println("error in json\n" + ex.getMessage());
            System.out.println("very bad");
        }
        if (this.PoAIntent == null) {
            PoAService.miners = miners;
            this.PoAIntent = new Intent(getActivity(), PoAService.class);
            getActivity().startService(PoAIntent);
        }
        checkMiners();
        call.resolve();
    }

    @PluginMethod()
    public void stop(PluginCall call) {
        cleanTimer();
        for (Miner miner : miners) {
            miner.publisher.stop();
        }
        getActivity().stopService(this.PoAIntent);
        call.resolve();
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
                call.resolve(obj);
            }
        } catch (Exception ex) {
            JSObject obj = new JSObject();
            obj.put("status", false);
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
//                            System.out.println(String.format("miner %s need reboot", miners[i].publisher.publicKey.substring(0,6)));
                            Integer buf = miners[i].publisher.countBlocks;
                            miners[i].publisher.stop();
                            miners[i].restartPublisher();
                            miners[i].publisher.countBlocks = buf;
                            miners[i].publisher.init();
                        }
                    }
                } catch (Exception ex) {
                    System.out.println("can't take fields");
                }
            }
        }, 0, 1000 * 5);
    }

    private void cleanTimer() {
        timer.cancel();
        timer.purge();
    }
}
