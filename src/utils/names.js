//
let TASK    = 'task'
//
let LIST    = 'list'
//
let TOKENS  = 'tokens'
//
let LOCK    = 'lock'
//
let USER    = 'user'

let STORAGE_NAME_POPUP = ''
let STORAGE_NAME_BACKGROUND = ''
let STORAGE_NAME_WORKER = ''

let versions = {
    EXTENSION: '', // Default, not used
    ELECTRON: ' web electron',
    // TODO We have to separate 'mobile / PWA', 'iOS / Android'
    MOBILE: ' web mobile', // Android and iOS web and PWA installs
    // TODO We have to add OS version
    WEB: ' web ',
}

module.exports = {
    versions
}