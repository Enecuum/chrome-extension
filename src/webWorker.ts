import {decryptAccount, encryptAccount, lockAccount} from "./lockAccount"
import {createPopupWindow, lockTimer} from './handler'

import {MsgHandler} from './handler'

self.addEventListener('message', msgHandler, false);

async function msgHandler(msg: any) {

    MsgHandler(msg).then(answer => {
        self.postMessage(answer);
    })
}
