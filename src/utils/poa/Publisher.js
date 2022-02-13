var crypto = require('crypto');
var r = require('jsrsasign');

class Publisher {
	constructor(url, poa, token) {

		url = atob(url)
		const POA_PROTOCOL_VERSION = 4;
		const ENQ_TOKEN = token;
		// const ENQ_TOKEN = "0000000000000000000000000000000000000000000000000000000000000001";
		// const SOME_TOKEN = "145e5feb2012a2db325852259fc6b8a6fd63cc5188a89bac9f35139fc8664fd2";
		let tokens = [ENQ_TOKEN, ENQ_TOKEN]
		let split = url.toString().replace('ws://', '').split(':');
		let ip = split[0];
		let port = split[1];
		// let ecc = new ECC(ecc_mode);
		if (poa.id == undefined)
			poa.id = poa.pubkey.slice(0, 6);
		this.id = poa.pubkey
		this.ws = new WebSocket(`ws://${ip}:${port}`);
		this.ws.onopen = function open() {
			console.log(`${poa.id} connected`);
			let hash = crypto.createHash('sha256').update(ip).digest('hex')
			let hail = {
				"data": {
					"hash": hash,
					"id": poa.pubkey,
					"sign": sign(poa.prvkey, hash)
				},
				"method": "hail",
				"ver": POA_PROTOCOL_VERSION
			}
			this.send(JSON.stringify(hail));
		};
		this.ws.onclose = function close(e) {
			console.log(`${poa.id} disconnected`);
			console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
			setTimeout(function () {
				new Publisher(url, poa);
			}, 1000);
		};
		this.ws.onerror = function (err) {
			console.error('Socket encountered error: ', err.message, 'Closing socket');
			//ws.close();
		};
		this.ws.onmessage = function(msg) {
			try{
				msg = JSON.parse(msg.data)
			}catch (er){
				console.error(er)
				return;
			}
			if (msg.method != 'on_leader_beacon')
				return;

			let data = msg.data;
			let isValid = true;
			let isCorrect = (hashBlock(data.mblock_data) == data.m_hash)

			console.log(` ${poa.id}  Sign: ${(isValid ? "OK" : "BAD")}  m_hash: ${data.m_hash}  ${(isCorrect ? "OK" : "BAD")}`);
			//console.log(`poaId: ${poa.id}-${i}   Sign: ${(isValid?"OK":"BAD")}   ${(isCorrect?"OK":"BAD")}`);
			if (!isValid) {
				//console.log("Incorrect sign")
				return;
			}
			if (!isCorrect) {
				//console.log("Incorrect m_hash")
				return;
			}
			let token = tokens[Math.random() >= 0.8 ? 1 : 0];
			let forsign = data.m_hash + (poa.hasOwnProperty('referrer') ? poa.referrer : "") + token;

			let res = {
				"ver": POA_PROTOCOL_VERSION,
				"method": "publish",
				"data": {
					"kblocks_hash": data.mblock_data.kblocks_hash,
					"m_hash": data.m_hash,
					"token": token,
					"sign": sign(poa.prvkey, forsign),
					"id": poa.pubkey
				}
			}
			if (poa.hasOwnProperty('referrer'))
				res.data.referrer = poa.referrer
			this.send(JSON.stringify(res));
		};
	}
}

function sign(prvkey, msg) {
	var sig = new r.Signature({"alg": 'SHA256withECDSA'});
	sig.init({d: prvkey, curve: 'secp256k1'});
	sig.updateString(msg);

	return sig.sign();
}

function verify(pubkey, msg, signedMsg) {
	var sig = new r.Signature({"alg": 'SHA256withECDSA'});
	sig.init({xy: pubkey, curve: 'secp256k1'});
	sig.updateString(msg);
	return sig.verify(signedMsg);
}

function hashBlock(block) {
	let txs_hash = crypto.createHash('sha256').update(block.txs.map(tx => hash_tx(tx)).sort().join("")).digest('hex');

	let hashed = crypto.createHash('sha256').update(block.kblocks_hash.toLowerCase() + block.nonce.toString() + block.publisher.toLowerCase() + txs_hash.toLowerCase()).digest('hex');
	// hashed = ENQWeb.Utils.crypto.sha256(block.kblocks_hash.toLowerCase() + block.nonce.toString() + block.publisher.toLowerCase() + txs_hash.toLowerCase());
	return hashed;
}

function hash_tx(tx) {
	if (!tx)
		return undefined;

	let str = ['amount', 'data', 'from', 'nonce', 'sign', 'ticker', 'to'].map(v => crypto.createHash('sha256').update(tx[v].toString().toLowerCase()).digest('hex')).join("");
	return crypto.createHash('sha256').update(str).digest('hex');
}

export { Publisher };
