package com.enecuum.pwa;

public class IPUpdater {
    public String publicKey;
    public String ip;
    public String port;

    public String serialize() {
        String output = "";
        output += String.format("{\"publicKey\":\"%s\", \"ip\":\"%s\", \"port\":\"%s\"},", this.publicKey, this.ip, this.port);
        output = output.substring(0, output.length() - 1);
        return output;
    }
}
