//
//  Miner.swift
//  App
//
//  Created by Роман Бурлин on 24.01.2023.
//

import Foundation
import CryptoSwift

class Miner: NSObject {
    var account: Account
    var net: String
    var port: String
    var mining: Bool
    let xorString = "750D7F2B34CA3DF1D6B7878DEBC8CF9A56BCB51A58435B5BCFB7E82EE09FA8BE75"
    public var publisher: Publisher?
    var ws: WebSocket?
    var status: Bool = false
    
    init(account: Account, net: String, port: String, mining: Bool) {
        self.account = account
        self.net = net
        self.port = port
        self.mining = mining
        
        
        if self.account.referrer != "false" {
            self.account.referrer = self.account.referrer.substring(from: 4)
            if(self.account.referrer.count == 66){
                self.account.referrer = self.account.referrer.xor(second: xorString)
            }else{
                self.account.referrer = ""
            }
            
        }
        
        self.publisher = Publisher(account: self.account, net: self.net)
        let wsUrl = "ws://"+net+":"+port
        ws = WebSocket(wsURL: wsUrl, publisher: self.publisher!)
    }
    
    func startMiner() {
        if(self.mining == true){
            ws?.start()
            self.status = true
        }
    }
    
    func stopMiner() {
        self.ws?.close()
        self.status = false
    }
    
    public func reloadUpdatedMiner() {
        self.stopMiner()
        self.publisher?.account = self.account
        self.ws?.publisher = publisher
        self.startMiner()
        
    }
}

class Publisher: NSObject{
    var account: Account
    var net: String
    var status: Bool?
    var duplicated: Bool = false
    var count: Int = 0
    public var StatusString: String = "Disconnnected"
    
    init(account: Account, net: String) {
        self.account = account
        self.net = net
        self.status = true
    }
    
    public func hail() -> String{
        var hail = Hail(id: self.account.publicKey, token: self.account.token!, referrer: account.referrer)
        hail.hash = Crypto.sha256(msg: self.net + hail.referrer + hail.token)
        hail.sign = Crypto.sign(hash: hail.hash!, privateKey: self.account.privateKey)
        do{
            let encoder = JSONEncoder()
            let block = BlockDataHail(method: Methods.hail, ver: Protocol_ver.protocol_version, data: hail)
            let sendData = try encoder.encode(block)
            StatusString = "Connected"
            return String(data: sendData, encoding: .utf8)!
        }catch{
            print("Error in hail")
            return ""
        }
        
    }
    
    public func onBlock(block:Block) -> String {
        if(block.method == Methods.on_leader_beacon){
            var publish = Publish(id: self.account.publicKey, token: self.account.token!, referrer: self.account.referrer, kblocks_hash: (block.data?.mblock_data?.kblocks_hash!)!, m_hash: (block.data?.m_hash!)!)
            var hash = Crypto.sha256(msg: publish.m_hash + self.account.referrer + self.account.token!)
            publish.sign = Crypto.sign(hash: hash, privateKey: self.account.privateKey)
            do{
                let encoder = JSONEncoder()
                var send = BlockDataPublish(method: Methods.publish, ver: Protocol_ver.protocol_version, data: publish)
                var sendBlock = try encoder.encode(send)
                count += 1
                StatusString = String(format: "Sign block (%d)", arguments: [count])
                return String(data: sendBlock, encoding: .utf8)!
            }
            catch{
                print("Error in on block")
                return ""
            }
            
        }
        if(block.method == Methods.ERR_DUPLICATE_KEY){
            print(String(format: "Error: %s : %s", self.account.publicKey.substring(start: 0, end: 5), Methods.ERR_DUPLICATE_KEY))
            self.status = false
            self.duplicated = true
        }
        return ""
    }
    
    func onError(){
        self.status = false
    }
}

struct Hail: Codable {
    var id: String
    var hash: String?
    var token: String
    var referrer: String
    var sign: String?
    
}

struct Publish: Codable {
    var id: String
    var token: String
    var referrer: String
    var sign: String?
    var kblocks_hash: String
    var m_hash: String
    
}

struct BlockDataHail: Codable {
    var method: String?
    var ver: Int?
    var data: Hail?
    var err: String?
}

struct BlockDataPublish: Codable {
    var method: String?
    var ver: Int?
    var data: Publish?
    var err: String?
}

struct Block: Codable {
    var method: String?
    var ver: Int?
    var data: BlockData?
    var err: String?
}

struct BlockData: Codable {
    var leader_id: String?
    var m_hash: String?
    var mblock_data: MBlockData?
}

struct MBlockData: Codable {
    var kblocks_hash: String?
    var txs: [BlockTXs]?
}

struct BlockTXs: Codable {
    var hash: String?
    var from: String?
    var to: String?
    var amount: String?
    var nonce: String?
    var sign: String?
    var ticker: String?
    var data: String?
}

struct Peer: Codable {
    var method: String?
    var ver: Int?
    var data: PeerData?
    var err: String?
}

struct PeerData: Codable {
    var ip: String?
    var port: String?
}

struct Account: Codable {
    var publicKey: String
    var privateKey: String
    var token: String?
    var referrer: String
    var status: Bool
}

struct AccountUpdate: Codable {
    var publicKey: String
    var privateKey: String?
    var token: String?
    var referrer: String?
    var status: Bool?
}


struct KeyConstants {
        static let privateKeyLength: Int = 64
        static let publicKeyLength: Int = 66
}

struct Protocol_ver {
    static let protocol_version = 4
}

struct Methods {
    static let publish = "publish"
    static let hail = "hail"
    static let on_leader_beacon = "on_leader_beacon"
    static let peer = "peer"
    static let ERR_DUPLICATE_KEY = "ERR_DUPLICATE_KEY"
}
