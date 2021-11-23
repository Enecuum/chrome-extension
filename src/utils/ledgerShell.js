import { Buffer } from 'buffer';
import TransportWebHID from '@ledgerhq/hw-transport-webhid';
import Sia from "@siacentral/ledgerjs-sia";


const getVersion = async  (Transport)=>{
    if(Transport===undefined)
        Transport =  await TransportWebHID.create()
    const sia = new Sia(Transport)
    let version = await  sia.getVersion(); // from sia lib (possible manual)
    return version
}

const getPublicKey = async (number, Transport)=>{
    if(Transport===undefined)
        Transport =  await TransportWebHID.create()
    let manual = await Transport.send(0xe0, 0x02, 0x00, 0x00, Buffer.alloc(4, number))
    return manual.toString('hex')
}

const signHash = async (hash, Transport)=>{
    if(Transport===undefined)
        Transport =  await TransportWebHID.create()
    let manual = await Transport.send(0xe0, 0x04, 0x00, 0x00, Buffer.alloc(32, hash))
    return manual.toString('hex')
}

export {signHash, getPublicKey, getVersion}
