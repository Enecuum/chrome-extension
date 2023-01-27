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
    
    
    func openWS(wsURL:String){
        let session = URLSession(
            configuration: .default,
            delegate: self,
            delegateQueue: .main)
        url = URL(string: wsURL)
        
        websocket = session.webSocketTask(with: url!)
        
    }
    
    func start(){
        self.wsStatus = true
        websocket?.resume()
    }
    
    func ping() {
        websocket?.sendPing { Error in
            if let Error = Error {
                print("Error in ping ws! \(String(describing: self.url?.absoluteURL))\n \(Error)")
            }
        }
    }
    func close() {
        websocket?.cancel(with: .goingAway, reason: "".data(using: .utf8))
    }
    func send(data:String) {
        websocket?.send(.string(data), completionHandler: { Error in
            if let Error = Error {
                print("Send error! \(Error)")
                self.wsStatus = false
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
                        let data = try jsd.decode(Peer.self, from: str.data(using: .utf8)!)
                        print(data.data?.ip ?? "no ip")
                    }
                    catch{
                        print("123")
                    }
                    
                    
                @unknown default:
                    break
                }
            case .failure(let error):
                print("receive error: \(error)")
                self?.wsStatus = false;
            }
            
            if self?.wsStatus == true {
                self?.receive()
            }
        })
    }
    
    func urlSession(_ session: URLSession, webSocketTask: URLSessionWebSocketTask, didOpenWithProtocol protocol: String?) {
        print("open ws to \(String(describing: self.url))")
        receive()
        
    }
    
    func urlSession(_ session: URLSession, webSocketTask: URLSessionWebSocketTask, didCloseWith closeCode: URLSessionWebSocketTask.CloseCode, reason: Data?) {
        print("ws was closed")
    }
    
}
