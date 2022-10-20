package com.enecuum.pwa;

import android.util.Log;

public class MinerBrodcast {
    public String publicKey;
    public String status;

    private static String TAG = "MinerBrodcast";

    public static String serialize(MinerBrodcast[] miners){
        String output = "[";
        for(MinerBrodcast miner : miners){
            output+= String.format("{\"publicKey\":\"%s\", \"status\":\"%s\"},", miner.publicKey,miner.status);
        }
        output = output.substring(0,output.length()-1) +"]";
        return output;
    }
}
