let crypto = require('crypto-browserify')
let jsrsasign = require('jsrsasign')

class Publisher {

    constructor(account, token) {

        // token = '0d0b6da9d730e6eae5e6cff889051d909b8f66be0f4dc315c3fcedf27395c0cb'
        token = 'de0942b3b1194cde66ba9bf45bd1bdf406e714d6d514b8c0e6fd58b5ee833693'


        // let url = atob(miningUrl)
        // console.log(url)
        const POA_PROTOCOL_VERSION = 4
        // const ENQ_TOKEN = token

        // const ENQ_TOKEN = "0000000000000000000000000000000000000000000000000000000000000001";
        // const SOME_TOKEN = "145e5feb2012a2db325852259fc6b8a6fd63cc5188a89bac9f35139fc8664fd2";

        // let tokens = [ENQ_TOKEN, ENQ_TOKEN]
        // let split = url.toString()
        //     .replace('ws://', '')
        //     .split(':')

        // let ip = split[0]
        // let port = split[1]
        // let ecc = new ECC(ecc_mode);

        let id = account.publicKey.slice(0, 6)
        // this.id = poa.publicKey

        // this.ws = new WebSocket(`ws://${ip}:${port}`)

        let ip = '95.216.246.116'
        this.ws = new WebSocket(`ws://95.216.246.116:3000`)

        this.close = () => {
            console.log(`${id} closed`)
            this.ws.close()
        }

        this.ws.onopen = function open() {

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
            this.send(JSON.stringify(hail))
        }

        this.ws.onclose = function close(e) {
            console.log(`${id} disconnected`)
            // console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason)
            // setTimeout(function () {
            //     new Publisher(Url, poa, token)
            // }, 1000)
        }

        this.ws.onerror = function (err) {
            console.error('Socket encountered error: ', err.message, 'Closing socket')
            setTimeout(function () {
                new Publisher(account, token)
            }, 1000)
            //ws.close();
        }

        this.ws.onmessage = function (msg) {
            try {
                msg = JSON.parse(msg.data)
            } catch (er) {
                console.error(er)
                return
            }

            console.log(msg)

            if (msg.err === 'ERR_DUPLICATE_KEY') {

            }

            if (msg.method != 'on_leader_beacon') {
                return
            }

            let data = msg.data
            let isValid = true
            let isCorrect = (hashBlock(data.mblock_data) == data.m_hash)

            console.log(` ${id}  Sign: ${(isValid ? 'OK' : 'BAD')}  m_hash: ${data.m_hash}  ${(isCorrect ? 'OK' : 'BAD')}`)
            //console.log(`poaId: ${poa.id}-${i}   Sign: ${(isValid?"OK":"BAD")}   ${(isCorrect?"OK":"BAD")}`);

            if (!isValid) {
                //console.log("Incorrect sign")
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

            this.send(JSON.stringify(res))
        }
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
