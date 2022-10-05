package com.enecuum.pwa;

import com.google.gson.Gson;

import java.io.Console;
import java.io.UnsupportedEncodingException;
import java.math.BigInteger;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.MessageDigest;
import java.nio.charset.StandardCharsets;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.SecureRandom;
import java.security.Signature;
import java.security.SignatureException;
import java.security.spec.ECGenParameterSpec;

import org.bouncycastle.jce.ECNamedCurveTable;
import org.bouncycastle.jce.spec.ECNamedCurveParameterSpec;
import org.bouncycastle.util.encoders.Hex;
import org.web3j.crypto.ECKeyPair;
import org.web3j.crypto.ECDSASignature;
import org.web3j.crypto.Sign;

import java.security.spec.ECParameterSpec;
import java.security.spec.ECPrivateKeySpec;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.KeySpec;


public class Crypto {
    public String sha256(String msg) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            return toHex(md.digest(msg.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception e) {
            e.printStackTrace();
            return "";
        }
    }

    public byte[] sha256Bytes(String msg) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            return md.digest(msg.getBytes(StandardCharsets.UTF_8));
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private String toHex(byte[] hash) {
        BigInteger number = new BigInteger(1, hash);
        StringBuilder hexString = new StringBuilder(number.toString(16));
        while (hexString.length() < 64) {
            hexString.insert(0, '0');
        }

        return hexString.toString();
    }


    public static String compressPubKey(BigInteger pubKey) {
        String pubKeyYPrefix = pubKey.testBit(0) ? "03" : "02";
        String pubKeyHex = pubKey.toString(16);
        String pubKeyX = pubKeyHex.substring(0, 64);
        return pubKeyYPrefix + pubKeyX;
    }

    public String getPublicKey(String privateKey) {
        return compressPubKey(Sign.publicKeyFromPrivate(new BigInteger(privateKey, 16)));
    }


    public String sign(String privateKey, String msg) {
        BigInteger privKey = new BigInteger(privateKey, 16);
        BigInteger pubKey = Sign.publicKeyFromPrivate(privKey);
        ECKeyPair keyPair = new ECKeyPair(privKey, pubKey);
        byte[] hash = sha256Bytes(msg);

        Sign.SignatureData signature = Sign.signMessage(hash, keyPair, false);

        String R;
        String S;
        Integer size = 44;
        R = toHex(signature.getR());
        S = toHex(signature.getS());
        String buf;
        buf = R.substring(0, 1);
        if ((Integer.parseInt(buf, 16) & 0b1000) > 0) {
            R = "022100" + R;
            size++;
        } else {
            R = "0220" + R;
        }
        buf = S.substring(0, 1);
        if ((Integer.parseInt(buf, 16) & 0b1000) > 0) {
            S = "022100" + S;
            size++;
        } else {
            S = "0220" + S;
        }
        String RS = R + S;
        return "30" + size.toString() + RS;
    }


}
