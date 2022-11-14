package com.enecuum.pwa;

import android.util.Log;

import java.math.BigInteger;
import java.nio.charset.StandardCharsets;

public class Miner {
    public String url;
    public String port;
    private final String key;
    public String token;
    public String referrer;
    public Publisher publisher;
    private String xorString = "750D7F2B34CA3DF1D6B7878DEBC8CF9A56BCB51A58435B5BCFB7E82EE09FA8BE75";
    public Boolean inWork = false;
    private String TAG = "Miner";

    Miner(String url, String port, String key, String token, String referrer) {
        this.key = key;
        this.url = url;
        this.port = port;
        this.token = token;
        this.referrer = referrer.equals(null) || referrer.length() != 70 ? "" : referrer.substring(4);
        if (this.referrer.length() == 66) {
            String buffer = "";
            BigInteger ref = new BigInteger(this.referrer, 16);
            BigInteger xor = new BigInteger(this.xorString, 16);
            xor = xor.xor(ref);
            buffer = "0" + xor.toString(16);
            if (buffer.length() == 66 && (buffer.substring(0, 2).equals("02") || buffer.substring(0, 2).equals("03"))) {
                this.referrer = buffer;
            } else {
                this.referrer = "";
            }
        }
        this.publisher = new Publisher(url, port, key, token, this.referrer);
    }

    public void restartPublisher() {
        try {
            Boolean buf = this.publisher.mining;
            this.publisher = null;
            this.publisher = new Publisher(this.url, this.port, this.key, this.token, this.referrer);
            this.publisher.mining = buf;
        } catch (Exception ex) {
            Log.e(TAG, ex.getMessage() + "\n" + ex.getStackTrace());
        }

    }
}
