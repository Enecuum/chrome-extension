//
//  Crypto.swift
//  App
//
//  Created by Роман Бурлин on 24.01.2023.
//

import Foundation
import CryptoSwift

@available(iOS 13.0, *)

extension String{
    func xor(second: String) -> String {
        if (self.count == second.count) {
            var x = Array(hex: self)
            var y = Array(hex: second)
            for i in 0..<x.count {
                x[i] = x[i]^y[i]
            }
            return x.toHexString().lowercased()
        } else {
            print("Count is not equals")
            return ""
        }
        
    }
    
    func substring(from: Int) -> String {
        return String(self.suffix(from: self.index(self.startIndex, offsetBy: from)))
    }
    func substring(start: Int, end: Int) -> String {
        let start = self.index(self.startIndex, offsetBy: start)
        let end = self.index(self.startIndex, offsetBy: end)
        let range = start..<end
        return String(self[range])
    }
}

class Crypto{
    static func sha256(msg: String) -> String{
        guard let data = msg.data(using: .utf8) else {return ""}
        return data.sha256().toHexString().lowercased()
    }
    
    static func sign(hash: String, privateKey: String) -> String{
        let msg = Data(hex: hash)
        let uintPrivateKey = Array(hex: privateKey)
        let sig = try! Secp256k1.sign(msg: msg.bytes, with: uintPrivateKey, nonceFunction: .rfc6979)
        return sig.toHexString()
    }
}
