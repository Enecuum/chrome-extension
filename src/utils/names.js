// TODO Description
let TASK = 'task'
// TODO Description
let LIST = 'list'
// TODO Description
let TOKENS = 'tokens'
// TODO Description
let LOCK = 'lock'
// TODO Description
let USER = 'user'

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

module.exports = {
    TASK,
    LIST,
    TOKENS,
    LOCK,
    USER,
    versions,
    ENQ_CONTENT
}