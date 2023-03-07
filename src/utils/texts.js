export let texts = {
    'disallow_phone_sleep': {
        en: 'Disallow phone sleep'
    },
    'not_connected': {
        en: 'Enecuum extension is not connected to this site. To connect to a web3 site, find and click the connect button.'
    },
    'reject_all': {
        en: 'Reject all'
    },
    'history': {
        en: 'HISTORY:'
    }
}

let language = 'en'

export let getText = (name) => {
    return texts[name][language]
}