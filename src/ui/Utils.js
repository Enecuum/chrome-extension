const shortAddress = (address) => {
    return address.substring(0, 5) + '...' + address.substring(address.length - 3, address.length)
}

module.exports = {
    shortAddress
}