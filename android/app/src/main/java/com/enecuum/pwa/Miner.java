package com.enecuum.pwa;

import java.math.BigInteger;
import java.nio.charset.StandardCharsets;

public class Miner {
    public String url;
    private final String key;
    public String token;
    public String referrer;
    public Publisher publisher;
    private String xorString = "750D7F2B34CA3DF1D6B7878DEBC8CF9A56BCB51A58435B5BCFB7E82EE09FA8BE75";

    Miner(String url, String key, String token, String referrer) {
        this.key = key;
        this.url = url;
        this.token = token;
        this.referrer = referrer.equals(null) || referrer.length() != 70 ? "" : referrer.substring(4);
        if (this.referrer.length() == 66) {
            String buffer = "";
            BigInteger ref = new BigInteger(this.referrer, 16);
            BigInteger xor = new BigInteger(this.xorString, 16);
            xor = xor.xor(ref);
            buffer = "0" + xor.toString(16);
            if (buffer.length() == 66) {
                this.referrer = buffer;
            } else {
                this.referrer = "";
            }
        }
        this.publisher = new Publisher(url, key, token, this.referrer);
    }

    public void restartPublisher() {
        Boolean buf = this.publisher.mining;
        this.publisher = new Publisher(this.url, this.key, this.token, this.referrer);
        this.publisher.mining = buf;
    }
}
