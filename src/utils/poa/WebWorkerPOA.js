let document = ''
let window = ''
import  {Publisher} from "./publisher"
let miners = []

onmessage = (msg) => {
    // let data = ENQWeb.Utils.ofd.parse(msg.data)
    console.log(msg)
    msg = msg.data
    if(msg.start){
        miners = msg.data
        for (let i = 0; i < miners.length; i++) {
            miners[i].publisher = miners[i].mining && miners[i].tokens[0] ? new Publisher({
                publicKey: miners[i].publisher.account.publicKey,
                privateKey: miners[i].publisher.account.privateKey
            }, miners[i].publisher.token, postMessage, miners[i].net) : {}
        }
        postMessage(JSON.stringify({resolve: true, miners:miners}))
    }
    if(msg.stop){
        miners = msg.data
        for (let i = 0; i < miners.length; i++) {
            try {
                miners[i].publisher.ws.close()
            } catch (e) {
            }
            miners[i].publisher.status = "Disconnected"
        }
        postMessage(JSON.stringify({resolve: true, miners:miners}))
    }
    if(msg.get){
        postMessage(JSON.stringify({resolve: true, miners:miners}))
    }
}
