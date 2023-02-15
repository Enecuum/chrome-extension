//
//  webSocket.swift
//  App
//
//  Created by Роман Бурлин on 24.01.2023.
//

import Foundation

@available(iOS 13.0, *)
class WebSocket: NSObject, URLSessionWebSocketDelegate{
    
    private var websocket: URLSessionWebSocketTask?
    public var url: URL?
    public var wsStatus: Bool?
    public var status = false
    public var publisher: Publisher?
    
    init(wsURL:String, publisher:Publisher){
        self.url = URL(string: wsURL)
        self.publisher = publisher
    }
    
    func start(){
        let session = URLSession(
            configuration: .default,
            delegate: self,
            delegateQueue: .main)
        websocket = session.webSocketTask(with: url!)
        self.wsStatus = true
        self.status = true
        websocket?.resume()
        
    }
    
    
    func ping() {
        websocket?.sendPing { Error in
            if let Error = Error {
                print("Error in ping ws! \(String(describing: self.url?.absoluteURL))\n \(Error)")
                self.status = false
                if(self.wsStatus == true){
                    self.start()
                }
            }
        }
    }
    
    func close() {
        self.wsStatus = false
        websocket?.cancel(with: .goingAway, reason: "".data(using: .utf8))
        print((self.publisher?.account.publicKey.substring(start: 0, end: 5))! + ": close ws")
        
    }
    func send(data:String) {
        websocket?.send(.string(data), completionHandler: { Error in
            if let Error = Error {
                print("Send error! \(Error)")
                self.status = false
            }
        })
    }
    func receive() {
        websocket?.receive(completionHandler: { [weak self] result in
            switch result{
            case .success(let msg):
                switch msg {
                case .data(let data):
                    print("data:\(data)")
                case .string(let str):
                    let jsd = JSONDecoder()
                    print("str: \(str)")
                    do{
                        let data = try jsd.decode(Block.self, from: str.data(using: .utf8)!)
                        print(data.method ?? "no method")
                        if data.method == Methods.on_leader_beacon {
                            var send = self?.publisher!.onBlock(block: data)
                            print(send)
                            self?.send(data: send!)
                        } else if data.method == Methods.ERR_DUPLICATE_KEY {
                            print("duplicate miner")
                            self?.status = false
                            self?.close()
                        } else {
                            print("else block")
                        }
                    }
                    catch{
                        print("error in take block")
                    }
                    
                    
                @unknown default:
                    break
                }
            case .failure(let error):
                print("receive error: \(error)")
                self?.status = false;
                self?.publisher?.StatusString = "Disconnected"
            }
            
            if self?.wsStatus == true {
                self?.receive()
            }
        })
    }
    
    func urlSession(_ session: URLSession, webSocketTask: URLSessionWebSocketTask, didOpenWithProtocol protocol: String?) {
        print("open ws to \(String(describing: self.url))")
        var hail = self.publisher!.hail()
        print(hail)
        self.send(data: hail)
        receive()
    }
    
    func urlSession(_ session: URLSession, webSocketTask: URLSessionWebSocketTask, didCloseWith closeCode: URLSessionWebSocketTask.CloseCode, reason: Data?) {
        print("ws was closed")
        self.publisher?.StatusString = "Disconnected"
        if(self.wsStatus == true) {
            start()
        } else {
            self.status = false
        }
    }
    
}
