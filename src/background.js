import {extApi} from "./utils/platform"
import {portSream} from "./utils/portSream"
import { EnqExtApi } from "./extAPI"

const app = new EnqExtApi()


extApi.runtime.onConnect.addListener(connectRemote);

var connectRemote = function (remotePort){
    const processName = remotePort.name;
    const PortStream = new portSream(remotePort);
    if(processName == "contentscript"){
        const origin = remotePort.sender.url;
        app.connectPage(PortStream,origin)
    }else{
        app.connectPopup(PortStream);
    }
}