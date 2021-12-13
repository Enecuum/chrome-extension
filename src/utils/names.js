// TODO Description
let TASK = 'task'
// TODO Description
let LIST = 'list'
// TODO Description
let TOKENS = 'tokens'
// TODO Description
let LOCK = 'lock'
// TODO >:(
let USER = 'User'
// TODO Description
let CONFIG = 'config'
// TODO Description
let NETWORKS = 'networks'
// TODO Description
let NET = 'net'

let STORAGE_NAME_POPUP = ''
let STORAGE_NAME_BACKGROUND = ''
let STORAGE_NAME_WORKER = ''

let versions = {
    EXTENSION: '', // Default, not used
    ELECTRON: ' web electron',
    // TODO We have to separate (mobile / PWA), (iOS / Android)
    MOBILE: ' web mobile', // Android and iOS web and PWA installs
    // TODO We have to add OS version
    WEB: ' web ',
}

let ENQ_CONTENT = 'ENQContent'


let lockString = 'Lock account loaded. Background started'
let configErrorString = 'Error in setting config'
let strings = {}

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
    strings
}