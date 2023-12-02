//
//  POA.swift
//  App
//
//  Created by Роман Бурлин on 19.11.2022.
//

import Foundation
import Capacitor

@objc(PoA)
public class PoA: CAPPlugin{
    
    
    @available(iOS 13.0, *)
    @objc func getM(_ call: CAPPluginCall){
        let value = call.getString("value") ?? ""
        print("sha \(value): \(Crypto.sha256(msg: value))")
        print("sign \(Crypto.sha256(msg: value)): \(Crypto.sign(hash: Crypto.sha256(msg: value), privateKey:""))")
        call.resolve(["value":value])
    }
    
    @objc func start(_ call: CAPPluginCall){
        print("start method used")
        let jsd = JSONDecoder()
        let net = call.getString("net") ?? ""
        let port = call.getString("port") ?? ""
        let jsonStringData = call.getString("data") ?? ""
        let data = jsonStringData.data(using: .utf8)!
        print("network: \(net.utf8)")
        print("port: \(port.utf8)")
        do{
            let accounts = try jsd.decode([Account].self, from: data)
            var miners: [Miner] = []
            for account in accounts {
//                print(account.publicKey, account.token?.utf8)
                miners.append(Miner(account: account, net: net, port: port, mining: account.status))
            }
            for miner in miners {
                print(miner.account.publicKey)
            }
            print("start back")
            backgroundController.miners = miners
            backgroundController.startBackground()
        }catch{
            print("error in parse JSON")
        }
        
        call.resolve()
    }
    
    @objc func stop(_ call: CAPPluginCall){
        print("stop background")
        backgroundController.stopBackground()
        call.resolve()
    }
    
    @objc func updateMiner(_ call: CAPPluginCall){
        let jsd = JSONDecoder()
        let jsonStringData = call.getString("data") ?? ""
        let data = jsonStringData.data(using: .utf8)!
        do {
            let account = try jsd.decode(AccountUpdate.self, from: data)
            for miner in backgroundController.miners {
                if miner.account.publicKey == account.publicKey {
                    miner.account.token = account.token
                    miner.reloadUpdatedMiner()
                }
            }
        }catch {
            print("Error in update miner")
        }
        call.resolve()
    }
    @objc func minerSwitch(_ call: CAPPluginCall){
        let jsd = JSONDecoder()
        let jsonStringData = call.getString("data") ?? ""
        let data = jsonStringData.data(using: .utf8)!
        do {
            let account = try jsd.decode(AccountUpdate.self, from: data)
            for miner in backgroundController.miners {
                if miner.account.publicKey == account.publicKey {
                    miner.account.status = account.status!
                    if account.status! {
                        miner.startMiner()
                    } else {
                        miner.stopMiner()
                    }
                }
            }
        }catch {
            print("Error in switch miner")
        }
        call.resolve()
    }
    
    @objc func getMiners(_ call: CAPPluginCall){
        var array:JSObject = [:]
        for miner in backgroundController.miners {
            array[miner.account.publicKey] = miner.ws?.publisher?.StatusString
        }
        call.resolve(array)
    }
    
    @objc func getServiceStatus(_ call: CAPPluginCall){
        let value = call.getString("value") ?? ""
        call.resolve(["value":value])
    }
    
    @objc func changeIPAllMiners(_ call: CAPPluginCall){
        let value = call.getString("value") ?? ""
        call.resolve(["value":value])
    }
}
