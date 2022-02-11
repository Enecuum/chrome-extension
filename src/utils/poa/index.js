// const argv = require('yargs').argv;
// const fs = require('fs');
import {Publisher} from "./Publisher"

let startPoa = (acc, token)=>{
	console.log(acc)
	let keyfile = [
		{
			"id" : "wallet1",
			"pubkey" : acc.publicKey,
			"prvkey" : acc.privateKey
		}
	]
	let poa;

	try {
		// poa = JSON.parse(keyfile);
		poa = keyfile;
	} catch (e) {
		console.log(e)
		console.log(`Failed to load ${keyfile}`);
		return;
	}

	let config = {
		url : '95.216.246.116:3000'
	};

	if(config.url === 'testnet' || config.url === 'test' || config.url === 'fatman')
		config.url = '95.216.246.116:3000'

	console.log(`Starting ${poa.length} emulators for ${config.url}`)
	let poas = []

	for(let i = 0; i < poa.length; i++)
	{
		if(poa[i].enable != undefined && poa[i].enable == 0)
		{
			if(poa[i].id == undefined)
				poa[i].id = poa[i].pubkey.slice(0, 6);
			console.log(`PoA ${poa[i].id} disabled`);
			continue;
		}
		poas.push(new Publisher(config.url, poa[i],token));
	}
}

export  {startPoa}
