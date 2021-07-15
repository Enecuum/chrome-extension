const shortAddress = (address) => {
    return address.substring(0, 5) + '...' + address.substring(address.length - 3, address.length)
}

const shortAddress2 = (address) => {
    return address.substring(0, 15) + '...' + address.substring(address.length - 10, address.length)
}

module.exports = {
    shortAddress,
    shortAddress2
}
