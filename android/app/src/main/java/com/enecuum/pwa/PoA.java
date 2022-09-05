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

@CapacitorPlugin(name = "PoA")
public class PoA extends Plugin{

    public Miner[] miners;
    public Intent PoAIntent;

    @PluginMethod()
    public void start(PluginCall call) throws JSONException {
        Gson g = new Gson();
        Account[] accounts;
        String jsonString = call.getString("data");
        String net = call.getString("net");
        try{
            accounts = g.fromJson(jsonString, Account[].class);
            System.out.println(accounts.length);
            System.out.println(net);
            miners = new Miner[accounts.length];
            for(int i = 0; i < accounts.length; i++){
                miners[i] = new Miner(net, accounts[i].privateKey, accounts[i].token);
                miners[i].publisher.mining = accounts[i].status;
            }
            for(Miner miner:miners){
                miner.publisher.init();
            }
            System.out.println("Started");

        }catch (Exception ex){
            System.out.println("error in json\n" + ex.getMessage());
            System.out.println("very bad");
        }
        if(this.PoAIntent == null){
            PoAService.miners = miners;
            this.PoAIntent = new Intent(getActivity(), PoAService.class);
            getActivity().startService(PoAIntent);
        }
        call.resolve();
    }

    @PluginMethod()
    public void stop(PluginCall call){
        for(Miner miner:miners){
            miner.publisher.stop();
        }
        getActivity().stopService(this.PoAIntent);
        call.resolve();
    }


    @PluginMethod()
    public void getMiners(PluginCall call){
        try {
            JSObject obj = new JSObject();
            if(miners != null){
                for(Miner miner:miners){
                    obj.put(miner.publisher.publicKey, miner.publisher.status);
                }
                call.resolve(obj);
            }else{
                obj.put("status", false);
                call.resolve(obj);
            }
        }
        catch (Exception ex){
            JSObject obj = new JSObject();
            obj.put("status", false);
            call.resolve(obj);
        }

    }

}
