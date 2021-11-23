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

const getPublicKey = async (index, Transport)=>{
    if(Transport===undefined)
        Transport =  await TransportWebHID.create()
    let manual = await Transport.send(0xe0, 0x02, 0x00, 0x01, uint32ToBuffer(index))
    return manual.toString('hex')
    // const sia = new Sia(Transport)
    // let version = await  sia.verifyPublicKey(0); // from sia lib (possible manual)
    // return version
}

let  uint32ToBuffer = (number) => {
    const buf = Buffer.alloc(4);
    buf.writeUInt32LE(number, 0);
    return buf;
}

const signHash = async (hash, index, Transport)=>{
    if(Transport===undefined)
        Transport =  await TransportWebHID.create()
    let buf = Buffer.alloc(36)
    buf.writeUInt32LE(index, 0)
    let str
    for(let i = 0; i < hash.length/2; i++){
        str = hash.substr(i*2, 2);
        buf.writeUInt8(parseInt(str, 16),  4 + i)
    }
    console.log(buf.toString('hex'))
    let manual = await Transport.send(0xe0, 0x04, 0x00, 0x01, buf)
    return manual.toString('hex')
}

export {signHash, getPublicKey, getVersion}
