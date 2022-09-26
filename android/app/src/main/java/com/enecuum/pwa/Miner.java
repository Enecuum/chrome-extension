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
        this.publisher = new Publisher(url, key, token, referrer);
    }

    public void restartPublisher() {
        Boolean buf = this.publisher.mining;
        this.publisher = new Publisher(url, key, token, referrer);
        this.publisher.mining = buf;
    }
}
