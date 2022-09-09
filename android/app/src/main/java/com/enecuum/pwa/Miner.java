package com.enecuum.pwa;

public class Miner {
    public String url;
    private String key;
    public String token;
    public Publisher publisher;

    Miner(String url, String key, String token) {
        this.key = key;
        this.url = url;
        this.token = token;
        this.publisher = new Publisher(url, key, token);
    }

    public void restartPublisher() {
        Boolean buf = this.publisher.mining;
        this.publisher = new Publisher(url, key, token);
        this.publisher.mining = buf;
    }
}
