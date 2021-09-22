declare var ENQWeb: any;
require('./lib/enqweb3lib.ext.min.js')

import {MsgHandler} from './handler'

self.addEventListener('message', msgHandler, false);

console.log('Web worker')

async function msgHandler(msg: any) {
    MsgHandler(msg, ENQWeb).then(answer => {
        self.postMessage(answer);
    })
}
