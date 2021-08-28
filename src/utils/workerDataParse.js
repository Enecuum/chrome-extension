let document = ''
let window = ''
importScripts('/lib/enqweb3lib.ext.min.js')

onmessage = (msg) => {
    let data = ENQWeb.Utils.ofd.parse(msg.data)
    postMessage(JSON.stringify({parsed: true}))
}