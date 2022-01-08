import { Buffer } from 'buffer'
import TransportWebUSB from '@ledgerhq/hw-transport-webusb'


const getVersion = async (Transport) => {
    if (Transport === undefined) {
        Transport = await TransportWebUSB.create()
    }
    let manual = await Transport.send(0xe0, 0x01, 0x00, 0x00)
    return (manual.toString('hex')).substr(0, 6)
}

const getPublicKey = async (index, Transport) => {

    if (Transport === undefined) {
        Transport = await TransportWebUSB.create()
    }
    let manual = await Transport.send(0xe0, 0x02, 0x00, 0x01, uint32ToBuffer(index))
    return (manual.toString('hex')).substr(0, 66)
}

let uint32ToBuffer = (number) => {
    const buf = Buffer.alloc(4)
    buf.writeUInt32LE(number, 0)
    return buf
}

const signHash = async (hash, index, Transport) => {
    if (Transport === undefined) {
        Transport = await TransportWebUSB.create()
    }
    console.log({
        hash,
        index
    })
    let buffer = Buffer.alloc(36)
    buffer.writeUInt32LE(index, 0)

    let str
    for (let i = 0; i < hash.length / 2; i++) {
        str = hash.substr(i * 2, 2)
        buffer.writeUInt8(parseInt(str, 16), 4 + i)
    }

    console.log(buffer.toString('hex'))

    let manual = await Transport.send(0xe0, 0x04, 0x00, 0x01, buffer)
    manual = manual.toString('hex')
    let size = parseInt(manual.substr(2, 2), 16)
    size = size * 2 + 4
    return manual.substr(0, size)
}

export { signHash, getPublicKey, getVersion}
