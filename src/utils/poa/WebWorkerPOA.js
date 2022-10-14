let document = ''
let window = ''
import {Publisher} from "./publisher"

let miners = []

onmessage = (msg) => {
    // let data = ENQWeb.Utils.ofd.parse(msg.data)
    msg = msg.data
    if (msg.start) {
        miners = msg.data
        for (let i = 0; i < miners.length; i++) {
            miners[i].publisher = miners[i].mining && miners[i].tokens[0] ? new Publisher({
                publicKey: miners[i].publisher.account.publicKey,
                privateKey: miners[i].publisher.account.privateKey,
                referrer: miners[i].referrer
            }, miners[i].publisher.token, postMessage, miners[i].net) : {}
        }
        postMessage(JSON.stringify({resolve: true, miners: miners}))
    }
    if (msg.stop) {
        miners = msg.data
        for (let i = 0; i < miners.length; i++) {
            try {
                miners[i].publisher.ws.close()
            } catch (e) {
            }
            miners[i].publisher.status = "Disconnected"
        }
        postMessage(JSON.stringify({resolve: true, miners: miners}))
    }
    if (msg.updateToken) {
        for (let i = 0; i < miners.length; i++) {
            if (miners[i].publicKey === msg.account) {
                miners[i].token = msg.token
                miners[i].publisher.token = msg.token.token
                miners[i].publisher.close()
                miners[i].publisher = new Publisher(miners[i].publisher.account, miners[i].publisher.token, postMessage, miners[i].publisher.ip)
                break
            }
        }
        postMessage(JSON.stringify({resolve: true, miners: miners}))
    }
    if (msg.switch) {
        for (let i = 0; i < miners.length; i++) {
            if (miners[i].publicKey === msg.account) {
                if (msg.set) {
                    miners[i].publisher = new Publisher(miners[i].publisher.account, miners[i].publisher.token, postMessage, miners[i].publisher.ip)
                } else {
                    miners[i].publisher.close()
                }
                miners[i].mining = msg.set
                break
            }
        }
        postMessage(JSON.stringify({resolve: true, miners: miners}))
    }
    if (msg.get) {
        postMessage(JSON.stringify({resolve: true, miners: miners}))
    }
}
