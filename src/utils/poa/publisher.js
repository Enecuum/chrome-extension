import {shortHash, showNotification} from "../../ui/Utils";

let crypto = require('crypto-browserify')
let jsrsasign = require('jsrsasign')

const POA_PROTOCOL_VERSION = 4

class Publisher {


    constructor(account, token) {

        // this

        // token = '0d0b6da9d730e6eae5e6cff889051d909b8f66be0f4dc315c3fcedf27395c0cb'
        // token = 'de0942b3b1194cde66ba9bf45bd1bdf406e714d6d514b8c0e6fd58b5ee833693'

        console.log(token)

        let id = account.publicKey.slice(0, 6)

        this.restart = true
        let ip = '95.216.246.116'
        this.ws = new WebSocket(`ws://95.216.246.116:3000`)

        this.status = 'Initialisation'

        this.close = () => {
            this.status = 'Closed'
            console.log(`${id} closed`)
            this.ws.close()
        }

        init(this, id, ip, account, token)

        // this.ws.onopen = () => {
        //
        //     console.log(`${id} connected`)
        //     let hash = crypto.createHash('sha256').update(ip).digest('hex')
        //
        //     let hail = {
        //         'data': {
        //             'hash': hash,
        //             'id': account.publicKey,
        //             'sign': sign(account.privateKey, hash)
        //         },
        //         'method': 'hail',
        //         'ver': POA_PROTOCOL_VERSION
        //     }
        //     this.ws.send(JSON.stringify(hail))
        //
        //     this.status = 'Connected'
        // }
        //
        // this.ws.onclose = (e) => {
        //     console.log(`${id} disconnected`)
        //     if(this.restart){
        //         console.log(`${id} restarted`)
        //
        //     }else{
        //         this.status = 'Disconnected'
        //     }
        // }
        //
        // this.ws.onerror = (err) => {
        //     console.error('Socket encountered error: ', err.message, 'Closing socket')
        //     setTimeout(function () {
        //         new Publisher(account, token)
        //     }, 1000)
        //
        //     this.status = 'Error'
        // }
        //
        // this.ws.onmessage = (msg) => {
        //     try {
        //         msg = JSON.parse(msg.data)
        //     } catch (er) {
        //         console.error(er)
        //         return
        //     }
        //
        //
        //
        //     if (msg.err === 'ERR_DUPLICATE_KEY') {
        //         console.warn(msg)
        //         this.status = 'ERR_DUPLICATE_KEY'
        //
        //         showNotification('Mining error', 'Duplicate key by ' + shortHash(account.publicKey))
        //     }
        //
        //     if (msg.method !== 'on_leader_beacon') {
        //         this.status = 'Leader beacon'
        //         return
        //     }
        //
        //     let data = msg.data
        //     let isValid = true
        //     let isCorrect = (hashBlock(data.mblock_data) === data.m_hash)
        //
        //     console.log(` ${id}  Sign: ${(isValid ? 'OK' : 'BAD')}  m_hash: ${data.m_hash}  ${(isCorrect ? 'OK' : 'BAD')}`)
        //     //console.log(`poaId: ${poa.id}-${i}   Sign: ${(isValid?"OK":"BAD")}   ${(isCorrect?"OK":"BAD")}`);
        //
        //     if (!isValid) {
        //         //console.log("Incorrect sign")
        //         this.status = 'Incorrect sign'
        //         return
        //     }
        //     if (!isCorrect) {
        //         //console.log("Incorrect m_hash")
        //         return
        //     }
        //
        //     // let token = tokens[Math.random() >= 0.8 ? 1 : 0]
        //     let forSign = data.m_hash + (account.hasOwnProperty('referrer') ? account.referrer : '') + token
        //
        //     let res = {
        //         'ver': POA_PROTOCOL_VERSION,
        //         'method': 'publish',
        //         'data': {
        //             'kblocks_hash': data.mblock_data.kblocks_hash,
        //             'm_hash': data.m_hash,
        //             'token': token,
        //             'sign': sign(account.privateKey, forSign),
        //             'id': account.publicKey
        //         }
        //     }
        //
        //     if (account.hasOwnProperty('referrer')) {
        //         res.data.referrer = account.referrer
        //     }
        //
        //     this.status = 'Sign block'
        //
        //     showNotification('Mining reward', 'Sign block by ' + shortHash(account.publicKey))
        //
        //     this.ws.send(JSON.stringify(res))
        // }
    }
}

function init(_, id, ip, account, token) {
    _.ws.onopen = () => {

        console.log(`${id} connected`)
        let hash = crypto.createHash('sha256').update(ip).digest('hex')

        let hail = {
            'data': {
                'hash': hash,
                'id': account.publicKey,
                'sign': sign(account.privateKey, hash)
            },
            'method': 'hail',
            'ver': POA_PROTOCOL_VERSION
        }
        _.ws.send(JSON.stringify(hail))

        _.status = 'Connected'
    }

    _.ws.onclose = (e) => {
        console.log(`${id} disconnected`)
        if(_.restart){
            console.log(`${id} restarted`)
            _.ws = new WebSocket(`ws://95.216.246.116:3000`)
            init(_, id, ip, account, token)
        }else{
            _.status = 'Disconnected'
        }
    }

    _.ws.onerror = (err) => {
        console.error('Socket encountered error: ', err.message, 'Closing socket')
        setTimeout(function () {
            // new Publisher(account, token)
        }, 1000)

        this.status = 'Error'
    }
    _.ws.onmessage = (msg) => {
        try {
            msg = JSON.parse(msg.data)
        } catch (er) {
            console.error(er)
            return
        }



        if (msg.err === 'ERR_DUPLICATE_KEY') {
            console.warn(msg)
            _.status = 'ERR_DUPLICATE_KEY'

            showNotification('Mining error', 'Duplicate key by ' + shortHash(account.publicKey))
        }

        if (msg.method !== 'on_leader_beacon') {
            _.status = 'Leader beacon'
            return
        }

        let data = msg.data
        let isValid = true
        let isCorrect = (hashBlock(data.mblock_data) === data.m_hash)

        console.log(` ${id}  Sign: ${(isValid ? 'OK' : 'BAD')}  m_hash: ${data.m_hash}  ${(isCorrect ? 'OK' : 'BAD')}`)
        //console.log(`poaId: ${poa.id}-${i}   Sign: ${(isValid?"OK":"BAD")}   ${(isCorrect?"OK":"BAD")}`);

        if (!isValid) {
            //console.log("Incorrect sign")
            _.status = 'Incorrect sign'
            return
        }
        if (!isCorrect) {
            //console.log("Incorrect m_hash")
            return
        }

        // let token = tokens[Math.random() >= 0.8 ? 1 : 0]
        let forSign = data.m_hash + (account.hasOwnProperty('referrer') ? account.referrer : '') + token

        let res = {
            'ver': POA_PROTOCOL_VERSION,
            'method': 'publish',
            'data': {
                'kblocks_hash': data.mblock_data.kblocks_hash,
                'm_hash': data.m_hash,
                'token': token,
                'sign': sign(account.privateKey, forSign),
                'id': account.publicKey
            }
        }

        if (account.hasOwnProperty('referrer')) {
            res.data.referrer = account.referrer
        }

        _.status = 'Sign block'

        showNotification('Mining reward', 'Sign block by ' + shortHash(account.publicKey))

        _.ws.send(JSON.stringify(res))
    }
}

function sign(privateKey, msg) {
    var sig = new jsrsasign.Signature({ 'alg': 'SHA256withECDSA' })
    sig.init({
        d: privateKey,
        curve: 'secp256k1'
    })
    sig.updateString(msg)

    return sig.sign()
}

function verify(publicKey, msg, signedMsg) {
    var sig = new jsrsasign.Signature({ 'alg': 'SHA256withECDSA' })
    sig.init({
        xy: publicKey,
        curve: 'secp256k1'
    })
    sig.updateString(msg)
    return sig.verify(signedMsg)
}

function hashBlock(block) {
    let txs_hash = crypto.createHash('sha256')
        .update(block.txs.map(tx => hash_tx(tx))
            .sort()
            .join(''))
        .digest('hex')

    let hashed = crypto.createHash('sha256')
        .update(block.kblocks_hash.toLowerCase() + block.nonce.toString() + block.publisher.toLowerCase() + txs_hash.toLowerCase())
        .digest('hex')
    return hashed
}

function hash_tx(tx) {
    if (!tx) {
        return undefined
    }

    let str = ['amount', 'data', 'from', 'nonce', 'sign', 'ticker', 'to'].map(v => crypto.createHash('sha256')
        .update(tx[v].toString().toLowerCase()).digest('hex')).join('')

    return crypto.createHash('sha256')
        .update(str).digest('hex')
}


export { Publisher }
