// TODO Description
const TASK = 'task'
// TODO Description
const LIST = 'list'
// TODO Description
const TOKENS = 'tokens'
// TODO Description
const LOCK = 'lock'
// TODO User model (account only) object
// const USER = 'User'
const USER = 'user'
// TODO Description
const CONFIG = 'config'
// TODO Description
const NETWORKS = 'networks'
// TODO Current network string
const NET = 'net'
// TODO favorite sites
const SITES = 'sites'

const STORAGE_NAME_POPUP = 'popup'
const STORAGE_NAME_BACKGROUND = 'background'
const STORAGE_NAME_WORKER = 'worker'

const versions = {
    EXTENSION: '', // Default, not used
    ELECTRON: ' electron',
    // TODO We have to separate (mobile / PWA), (iOS / Android)
    MOBILE: ' web mobile',
    // MOBILE: ' ' + Capacitor.platform + ' mobile', // Android and iOS web and PWA installs
    // TODO We have to add OS version
    WEB: ' web',
}

const copyText = ('\n\nCopy address to clipboard').toUpperCase()

const ENQ_CONTENT = 'ENQContent'


const lockString = 'Lock account loaded. Background started'
const configErrorString = 'Error in setting config'
const accountLockedString = 'Account locked'
const accountEncryptedString = 'Account encrypted'
const passwordString = 'Password not set'
const strings = {}

module.exports = {
    TASK,
    LIST,
    TOKENS,
    LOCK,
    USER,
    CONFIG,
    NETWORKS,
    NET,
    versions,
    ENQ_CONTENT,
    strings,
    copyText,
    SITES
}
