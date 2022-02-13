// const argv = require('yargs').argv;
// const fs = require('fs');
import {Publisher} from "./Publisher"

let startPoa = (acc, token, net = 'test')=>{
	console.log(acc)
	let keyfile = [
		{
			// "id" : "wallet1",
			"pubkey" : acc.publicKey,
			"prvkey" : acc.privateKey
		}
	]
	let poa;

	try {
		poa = keyfile;
	} catch (e) {
		console.log(e)
		console.log(`Failed to load ${keyfile}`);
		return;
	}

	let config = {
		url : 'OTUuMjE2LjI0Ni4xMTY6MzAwMA=='
	};

	if(net === 'test')
		config.url = 'OTUuMjE2LjI0Ni4xMTY6MzAwMA=='

	//bit
	if(net.includes(atob('Yml0LmVuZWN1dW0uY29t')))
		config.url = 'OTUuMjE2LjI0Ni4xMTY6MzAwMA=='

	//pulse
	if(net.includes(atob('cHVsc2UuZW5lY3V1bS5jb20=')))
		config.url = 'OTUuMjE2LjY4LjIyMTozMDAw'

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
	return poas
}

export  {startPoa}
