package com.enecuum.pwa;

import java.net.URI;

import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;

import java.net.URISyntaxException;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import com.getcapacitor.JSObject;
import com.google.gson.Gson;

public class Publisher {

    private String privateKey;
    public String token;
    public URI uri;
    public String publicKey;
    public Crypto crypto = new Crypto();
    public String ip;
    public String wsUrl;
    public Integer protocol_version = 4;

    public Boolean restartMiner;
    public String status = "Disconnected";
    public Boolean mining;
    public Integer countBlocks = 0;
    public Boolean reboot;

    public WebSocketClient ws;


    Publisher(String url, String privateKey, String token) {
        this.privateKey = privateKey;
        this.publicKey = crypto.getPublicKey(this.privateKey);
        this.token = token;
        this.ip = url;
        this.wsUrl = String.format("ws://%s:3000/", url);
        this.reboot = false;

        try {
            uri = new URI(wsUrl);

            ws = new WebSocketClient(this.uri) {
                @Override
                public void onOpen(ServerHandshake handshakedata) {
                    try {
                        System.out.println("connect from " + publicKey.substring(0, 6) + " to " + this.uri.toString());
                        ws.send(hail());
                        status = "Connected";
                    } catch (Exception ex) {
                        status = "Disconnected";
                    }

                }

                @Override
                public void onMessage(String message) {
//                ws.send("hello, mean");
                    System.out.println("account " + publicKey.substring(0, 6) + " take block");
                    ws.send(onBlock(message));
                }

                @Override
                public void onClose(int code, String reason, boolean remote) {
                    try {
                        ws.close();
                    } catch (Exception ex) {
                        System.out.println("WS is closed");
                    }
                    if (restartMiner) {
                        reboot = true;
                    }
                }

                @Override
                public void onError(Exception ex) {
                    System.out.println("ERROR: " + ex.getMessage() + "\n" + ex.getStackTrace());
                    ws.close();
                    if (restartMiner) {
                        reboot = true;
                    }
                }
            };

        } catch (URISyntaxException e) {
            System.out.println("uri error");
            e.printStackTrace();
        }
//        System.out.println(this.wsUrl);
//        System.out.println(this.uri);


    }

    public void init() {
        try {
            if (this.mining) {
                restartMiner = true;
                countBlocks = 0;
                ws.connect();
            } else {
                System.out.println("Miner " + this.publicKey.substring(0, 6) + " deactivated");
                this.status = "Disconnected";
            }

        } catch (Exception ex) {
            System.out.println("Error ws: " + ex.getMessage() + "\n" + ex.getStackTrace());
            this.status = "Disconnected";
        }
    }

    public void stop() {
        try {
            restartMiner = false;
            ws.close();
        } catch (Exception ex) {
            System.out.println("Error ws: " + ex.getMessage() + "\n" + ex.getStackTrace());
        }
        this.status = "Disconnected";
    }

    public String hail() {
        Gson g = new Gson();
        String hash = crypto.sha256(this.ip);
        JSObject obj = new JSObject();
        JSObject hail = new JSObject();
        hail.put("hash", hash);
        hail.put("id", this.publicKey);
        hail.put("token", this.token);
        hail.put("sign", crypto.sign(this.privateKey, hash));
        obj.put("data", hail);
        obj.put("method", "hail");
        obj.put("ver", protocol_version);

        return obj.toString();
    }


    public String onBlock(String m_block) {
        Gson g = new Gson();
        block block = g.fromJson(m_block, block.class);
//        System.out.println("len of txs = " + block.data.mblock_data.txs.length);
//        System.out.println(this.token + "\n" + this.publicKey + "\n" + this.privateKey);
        System.out.println(block.method);

        if (block.err != null) {
            if (block.err.equals("ERR_DUPLICATE_KEY")) {
                System.out.println("ERR_DUPLICATE_KEY!");
                reboot = true;
            }
        }

        if (block.method.equals("on_leader_beacon")) {
            String msg = block.data.m_hash + this.token;
            JSObject obj = new JSObject();
            JSObject publish = new JSObject();
            publish.put("kblocks_hash", block.data.mblock_data.kblocks_hash);
            publish.put("m_hash", block.data.m_hash);
            publish.put("id", this.publicKey);
            publish.put("token", this.token);
            publish.put("sign", crypto.sign(this.privateKey, msg));
            obj.put("data", publish);
            obj.put("method", "publish");
            obj.put("ver", protocol_version);

//        System.out.println(obj.toString());
            this.countBlocks++;
//            this.status = "Sign block";
            this.status = String.format("Sign block (%d)", countBlocks);

            return obj.toString();
        }
        System.out.println("not found");
        return "";
    }
}
