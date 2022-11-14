package com.enecuum.pwa;

import android.content.Context;
import android.content.Intent;
import android.util.Log;

import java.net.URI;

import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;

import java.net.URISyntaxException;

import com.getcapacitor.JSObject;
import com.google.gson.Gson;

public class Publisher {

    private String TAG = "Publisher";
    private final String privateKey;
    public String token;
    public String referrer;
    public URI uri;
    public String publicKey;
    public Crypto crypto = new Crypto();
    public String ip;
    public String port;
    public String wsUrl;
    public Integer protocol_version = 4;

    public Boolean restartMiner;
    public String status = "Disconnected";
    public Boolean mining;
    public Integer countBlocks = 0;
    public Boolean reboot;

    public WebSocketClient ws;


    Publisher(String url, String port, String privateKey, String token, String referrer) {
        this.privateKey = privateKey;
        this.publicKey = crypto.getPublicKey(this.privateKey);
        this.token = token;
        this.referrer = referrer;
        this.ip = url;
        this.port = port;
        this.wsUrl = String.format("ws://%s:%s/", url, port);
        this.reboot = false;

        try {
            uri = new URI(wsUrl);

            ws = new WebSocketClient(this.uri) {
                @Override
                public void onOpen(ServerHandshake handshakeData) {
                    try {
                        Log.d(TAG, "connect from " + publicKey.substring(0, 6) + " to " + this.uri.toString());
                        ws.send(hail());
                        status = "Connected";
                    } catch (Exception ex) {
                        Log.d(TAG, "Error in open WS\n" + ex.getMessage() + "\n" + ex.getStackTrace());
                        reboot = true;
                        status = "Disconnected";
                    }

                }

                @Override
                public void onMessage(String message) {
                    Log.d(TAG, "account " + publicKey.substring(0, 6) + " take block");
                    try {
                        String answer = onBlock(message);
                        if (answer.length() > 0) {
                            ws.send(answer);
                        }
                    } catch (Exception ex) {
                        Log.d(TAG, "Error in block\n" + ex.getMessage() + "\n" + ex.getStackTrace());
                        status = "Disconnected";
                        ws.close();
                        reboot = true;
                    }
                }

                @Override
                public void onClose(int code, String reason, boolean remote) {
                    try {
                        ws.close();
                    } catch (Exception ex) {
                        Log.d(TAG, "WS is closed");
                    }
                    if (restartMiner) {
                        reboot = true;
                    }
                }

                @Override
                public void onError(Exception ex) {
                    Log.d(TAG, "ERROR: " + ex.getMessage() + "\n" + ex.getStackTrace());
                    try {
                        ws.close();
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                    if (restartMiner) {
                        reboot = true;
                    }
                }
            };

        } catch (URISyntaxException e) {
            Log.d(TAG, "uri error");
            e.printStackTrace();
            reboot = true;
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
                Log.d(TAG, "Miner " + this.publicKey.substring(0, 6) + " deactivated");
                this.status = "Disconnected";
//                this.reboot = true;
            }

        } catch (Exception ex) {
            Log.d(TAG, "Error ws: " + ex.getMessage() + "\n" + ex.getStackTrace());
            this.status = "Disconnected";
            this.reboot = true;
        }
    }

    public void stop() {
        try {
            restartMiner = false;
            ws.close();
        } catch (Exception ex) {
            Log.d(TAG, "Error ws: " + ex.getMessage() + "\n" + ex.getStackTrace());
        }
        this.status = "Disconnected";
    }

    public String hail() {
        String hash = crypto.sha256(this.ip + (this.referrer.length() > 0 ? this.referrer : "") + this.token);
//        String hash = crypto.sha256(this.ip + this.token);
        JSObject obj = new JSObject();
        JSObject hail = new JSObject();
        hail.put("hash", hash);
        hail.put("id", this.publicKey);
        hail.put("token", this.token);
        hail.put("sign", crypto.sign(this.privateKey, hash));
        if (this.referrer.length() > 0) {
            hail.put("referrer", this.referrer);
        }
        obj.put("data", hail);
        obj.put("method", "hail");
        obj.put("ver", protocol_version);

        Log.d(TAG, obj.toString());
        return obj.toString();
    }


    public String onBlock(String m_block) {
        Gson g = new Gson();
        Block block = g.fromJson(m_block, Block.class);
        Log.d(TAG, block.method);

        if (block.err != null) {
            if (block.err.equals("ERR_DUPLICATE_KEY")) {
                Log.d(TAG, "ERR_DUPLICATE_KEY!");
                reboot = true;
                return "";
            }
        }

        if (block.method.equals("peer")) {
            this.stop();
            Peer peer = g.fromJson(m_block, Peer.class);
            IPUpdater ipUpdater = new IPUpdater();
            ipUpdater.publicKey = this.publicKey;
            ipUpdater.ip = peer.data.ip;
            ipUpdater.port = peer.data.port;
            String send = ipUpdater.serialize();
            PoA.ipUpdaterList.add(send);
        }

        if (block.method.equals("on_leader_beacon")) {
            String msg = block.data.m_hash + (this.referrer.length() > 0 ? this.referrer : "") + this.token;
            JSObject obj = new JSObject();
            JSObject publish = new JSObject();
            publish.put("kblocks_hash", block.data.mblock_data.kblocks_hash);
            publish.put("m_hash", block.data.m_hash);
            publish.put("id", this.publicKey);
            publish.put("token", this.token);
            if (this.referrer.length() > 0) {
                publish.put("referrer", this.referrer);
            }
            publish.put("sign", crypto.sign(this.privateKey, msg));
            obj.put("data", publish);
            obj.put("method", "publish");
            obj.put("ver", protocol_version);

            this.countBlocks++;
//            this.status = "Sign block";
            this.status = String.format("Sign block (%d)", countBlocks);

            Log.d(TAG, obj.toString());
            return obj.toString();
        }
        Log.d(TAG, "not found");
        return "";
    }
}
