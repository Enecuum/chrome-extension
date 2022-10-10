package com.enecuum.pwa;

public class Miner {
    public String url;
    private final String key;
    public String token;
    public String referrer;
    public Publisher publisher;

    Miner(String url, String key, String token, String referrer) {
        this.key = key;
        this.url = url;
        this.token = token;
        this.referrer = referrer.equals(null) || referrer.length() != 70 ? "" : referrer.substring(4);
        this.publisher = new Publisher(url, key, token, this.referrer);
    }

    public void restartPublisher() {
        Boolean buf = this.publisher.mining;
        this.publisher = new Publisher(this.url, this.key, this.token, this.referrer);
        this.publisher.mining = buf;
    }
}
