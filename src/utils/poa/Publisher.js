var crypto = require('crypto');
var r = require('jsrsasign');
// var enq = require('./addon')
// var WebSocket = require('ws');

// const ecc_mode = "long";

// class ECC {
// 	constructor(mode) {
// 		if (mode === "short") {
// 			this.a = enq.BigNumber(25);
// 			this.b = enq.BigNumber(978);
// 			this.p = enq.BigNumber(1223);
// 			this.order = enq.BigNumber(1183);
// 			this.g0x = enq.BigNumber(972);
// 			this.g0y = enq.BigNumber(795);
// 			this.gx = enq.BigNumber(1158);
// 			this.gy = enq.BigNumber(92);
// 			this.curve = enq.Curve(this.a, this.b, this.p, this.order, this.g0x, this.g0y);
// 			this.G0 = enq.Point(this.g0x, this.g0y, this.curve);
// 			this.G = enq.Point(this.gx, this.gy, this.curve);
// 			this.MPK = enq.Point(enq.BigNumber(512), enq.BigNumber(858), this.curve);
// 		} else {
// 			this.a = enq.BigNumber(1);
// 			this.b = enq.BigNumber(0);
// 			this.p = enq.BigNumber("80000000000000000000000000000000000200014000000000000000000000000000000000010000800000020000000000000000000000000000000000080003");
// 			this.order = enq.BigNumber("80000000000000000000000000000000000200014000000000000000000000000000000000010000800000020000000000000000000000000000000000080004");
// 			this.g0x = enq.BigNumber("2920f2e5b594160385863841d901a3c0a73ba4dca53a8df03dc61d31eb3afcb8c87feeaa3f8ff08f1cca6b5fec5d3f2a4976862cf3c83ebcc4b78ebe87b44177");
// 			this.g0y = enq.BigNumber("2c022abadb261d2e79cb693f59cdeeeb8a727086303285e5e629915e665f7aebcbf20b7632c824b56ed197f5642244f3721c41c9d2e2e4aca93e892538cd198a");
//
// 			this.G0_fq = {
// 				"x": "1 1971424652593645857677685913504949042673180456464917721388355467732670356866868453718540344482523620218083146279366045128738893020712321933640175997249379 4296897641464992034676854814757495000621938623767876348735377415270791885507945430568382535788680955541452197460367952645174915991662132695572019313583345",
// 				"y": "1 5439973223440119070103328012315186243431766339870489830477397472399815594412903491893756952248783128391927052429939035290789135974932506387114453095089572 3254491657578196534138971223937186183707778225921454196686815561535427648524577315556854258504535233566592842007776061702323300678216177012235337721726634"
// 			};
// 			this.MPK_fq = {
// 				"x" : "1 3880112175745769906129488456404571855313298496010825544782964964123833489278388802716228358058131528518953774702792145679842058700395879994915548189595077 2080522071627240824848138990257546083185256914799209977492439073918549876575237775765153830820632785082314470786485656726830053964692583149237097989320386",
// 				"y" : "1 5670372393738907536622431434430349740406923175794846022394579096835401282364953141839015655887440665019253725982752473996102582433456993998941961062159678 2218500320645904249775794701597206295659537597791055170003216970928769044251419537635292801466765144220996985453770076693072401342092975755321573943161131"
// 			}
// 			this.curve = enq.Curve(this.a, this.b, this.p, this.order, this.g0x, this.g0y);
// 			this.strIrred = "2 1 1 6703903964971298549787012499102923063739684112761466562144343758833001675653841939454385015500446199477853424663597373826728056308768000892499915006541826";
// 			this.strA = "0 1";
// 			this.strB = "0 0";
// 			this.e_fq = enq.Curve_Fq(this.p.decString(), 2, this.strIrred, this.strA, this.strB);
// 		}
// 	}
// }

// const POA_PROTOCOL_VERSION = 4;
// const ENQ_TOKEN = "0000000000000000000000000000000000000000000000000000000000000001";
// const SOME_TOKEN = "145e5feb2012a2db325852259fc6b8a6fd63cc5188a89bac9f35139fc8664fd2";
// let tokens = [ENQ_TOKEN, ENQ_TOKEN]

class Publisher {
	constructor(url, poa, config) {

		const POA_PROTOCOL_VERSION = 4;
		const ENQ_TOKEN = config.token;
		const SOME_TOKEN = "145e5feb2012a2db325852259fc6b8a6fd63cc5188a89bac9f35139fc8664fd2";
		let tokens = [ENQ_TOKEN, ENQ_TOKEN]
		let split = url.toString().replace('ws://', '').split(':');
		let ip = split[0];
		let port = split[1];
		// let ecc = new ECC(ecc_mode);
		if (poa.id == undefined)
			poa.id = poa.pubkey.slice(0, 6);
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
			// let PK_LPoS = enq.getHash(data.mblock_data.kblocks_hash.toString() + data.leader_id.toString() + data.mblock_data.nonce.toString());
			// let PK_LPoS = ENQWeb.Utils.crypto.sha256(data.mblock_data.kblocks_hash.toString() + data.leader_id.toString() + data.mblock_data.nonce.toString());
			let isValid = true;
			// try {
			// 	if (ecc_mode === "short") {
			// 		isValid = enq.verify(data.leader_sign, data.m_hash, PK_LPoS, ecc.G, ecc.G0, ecc.MPK, data.leader_id, ecc.p, ecc.curve);
			// 	} else {
			// 		isValid = enq.verify_tate(data.leader_sign, data.m_hash, PK_LPoS, ecc.G0_fq, ecc.MPK_fq, data.leader_id, ecc.curve, ecc.e_fq);
			// 	}
			// } catch (e) {
			// 	console.log("Lucky 7");
			// 	//console.log(e)
			// 	return;
			// }
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
