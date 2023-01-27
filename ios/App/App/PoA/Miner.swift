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
    var publisher: Publisher?
    
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
    }
}

class Publisher: NSObject{
    var account: Account
    var ws: WebSocket?
    var wsURL: String
    
    init(account: Account, wsURL: String) {
        self.account = account
        self.wsURL = wsURL
        self.ws = WebSocket()
    }
}

struct Block: Codable {
    var method: String?
    var ver: String?
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
    var ver: String?
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


struct KeyConstants {
        static let privateKeyLength: Int = 64
        static let publicKeyLength: Int = 66
}
