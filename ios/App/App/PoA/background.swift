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
        backgroundTask = UIApplication.shared.beginBackgroundTask(expirationHandler: {
            for miner in miners{
                print(miner.account.publicKey)
            }
            stopBackground()
        })
    }
    
    static func stopBackground() {
        UIApplication.shared.endBackgroundTask(backgroundTask)
        backgroundTask = .invalid
    }
    
}
