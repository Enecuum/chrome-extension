//
//  background.swift
//  App
//
//  Created by Роман Бурлин on 27.01.2023.
//

import Foundation
import UIKit

class backgroundController {
    
    static var miners: [Miner] = []
    
    static var backgroundTask: UIBackgroundTaskIdentifier = .invalid
    
    static func startBackground() {
//        backgroundTask = UIApplication.shared.beginBackgroundTask(expirationHandler: {
//            for miner in miners{
//                print(miner.account.publicKey)
//            }
//            stopBackground()
//        })
        print("start miners: " + String(self.miners.count))
        for miner in miners {
            miner.startMiner()
        }
    }
    
    static func stopBackground() {
//        UIApplication.shared.endBackgroundTask(backgroundTask)
//        backgroundTask = .invalid
        print("stop miners")
        for miner in miners {
            miner.stopMiner()
            print(miner.account.publicKey.substring(start: 0, end: 5) + ": stoped")
        }
    }
    
}
