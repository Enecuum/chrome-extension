declare var ENQWeb: any;
require('./lib/enqweb3lib.ext.min.js')

import {MessageHandler} from './handler'

const Storage = require('./utils/localStorage')
let storage = new Storage('worker')
let disk = storage
console.log(disk)

self.addEventListener('message', messageHandler, false);

console.log('Web worker')

async function messageHandler(msg: any) {
    MessageHandler(msg.data, ENQWeb, disk).then(answer => {
        self.postMessage(answer);
    })
}

// console.log(JSON.parse(localStorage.getItem('User')))
// console.log(JSON.parse(localStorage.getItem('lock')))
