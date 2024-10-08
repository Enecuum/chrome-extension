import {shortHash, showNotification, regexAddress} from '../../ui/Utils'

let crypto = require('crypto-browserify')
let jsrsasign = require('jsrsasign')

const POA_PROTOCOL_VERSION = 4

const methods = {
    'ERR_DUPLICATE_KEY':'ERR_DUPLICATE_KEY',
    'on_leader_beacon':'on_leader_beacon',
    'peer':'peer',
}

class Publisher {


    constructor(account, token, connector = false, ip = "95.216.246.116", port = "3000") {

        // this

        // token = '0d0b6da9d730e6eae5e6cff889051d909b8f66be0f4dc315c3fcedf27395c0cb'
        // token = 'de0942b3b1194cde66ba9bf45bd1bdf406e714d6d514b8c0e6fd58b5ee833693'
        console.log(token)

        let id = account.publicKey.slice(0, 6)
        this.connector = connector
        this.restart = true
        this.ws = new WebSocket(`ws://${ip}:${port}`)
        this.account = account
        this.token = token
        this.ip = ip
        this.port = port
        this.status = 'Initialisation'

        this.close = () => {
            this.restart = false
            this.status = 'Closed'
            console.log(`${id} closed`)
            this.ws.close()
        }

        this.init = init

        this.init(this, id, this.ip, this.port, this.account, this.token)
    }
}

function init(_, id, ip, port, account, token) {
    _.ws.onopen = () => {
        _.restart = true
        console.log(`${id} connected`)
        let hash = crypto.createHash('sha256')
            .update(ip)
            .digest('hex')

        let hail = {
            'data': {
                'hash': hash,
                'id': account.publicKey,
                'token': token,
                'sign': sign(account.privateKey, hash)
            },
            'method': 'hail',
            'ver': POA_PROTOCOL_VERSION
        }
        if (account.hasOwnProperty('referrer') && regexAddress.test(account.referrer)) {
            hail.data.referrer = account.referrer
        }
        _.ws.send(JSON.stringify(hail))

        _.status = 'Connected'
    }

    _.ws.onclose = (e) => {
        console.log(`${id} disconnected`)
        if (_.restart) {
            setTimeout(() => {
                console.log(`${id} restarted`)
                _.ws = new WebSocket(`ws://${_.ip}:${_.port}`)
                init(_, id, _.ip, _.port, account, token)
            }, 5000)
        } else {
            _.status = 'Disconnected'
        }
    }

    _.ws.onerror = (err) => {
        console.error('Socket encountered error: ', err.message, 'Closing socket')
        // init(_, id, ip, account, token)
        _.status = 'Error'
        _.close()
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
            // if(_.connector != false){
            //     _.connector(JSON.stringify({ method: 'notification', body:{title:"Mining error",text:'Duplicate key by ' + shortHash(account.publicKey)}}))
            // }else{
            //     showNotification('Mining error', 'Duplicate key by ' + shortHash(account.publicKey))
            // }
        }

        if (methods[msg.method] === undefined) {
            _.status = 'Unknown method'
            return
        }

        // if(msg.method === 'peer'){
        //     _.ip = msg.data.ip
        //     _.port = msg.data.port
        //     _.status = "Peer change"
        //     _.close()
        // }

        if(msg.method === methods.on_leader_beacon){
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
            let forSign = data.m_hash + (account.hasOwnProperty('referrer') && regexAddress.test(account.referrer) ? account.referrer : '') + token
    
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
    
            if (account.hasOwnProperty('referrer') && regexAddress.test(account.referrer)) {
                res.data.referrer = account.referrer
            }
    
            _.status = 'Sign block'
    
            // if(_.connector != false){
            //     _.connector(JSON.stringify({ method: 'notification', body:{title:'Mining reward',text:'Sign block by ' + shortHash(account.publicKey)}}))
            // }else {
            //     showNotification('Mining reward', 'Sign block by ' + shortHash(account.publicKey))
            // }
    
            _.ws.send(JSON.stringify(res))
        }   
    }
}

function sign(privateKey, msg) {
    var sig = new jsrsasign.Signature({'alg': 'SHA256withECDSA'})
    sig.init({
        d: privateKey,
        curve: 'secp256k1'
    })
    sig.updateString(msg)

    return sig.sign()
}

function verify(publicKey, msg, signedMsg) {
    var sig = new jsrsasign.Signature({'alg': 'SHA256withECDSA'})
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
        .update(tx[v].toString()
            .toLowerCase())
        .digest('hex'))
        .join('')

    return crypto.createHash('sha256')
        .update(str)
        .digest('hex')
}


export {Publisher}
