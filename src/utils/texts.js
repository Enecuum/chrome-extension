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
    },
    'enecuum_networks_accounts': {
        en: 'Enecuum networks accounts',
    },
    'ethereum_networks_accounts': {
        en: 'Ethereum networks accounts',
    }
}

let language = 'en'

export let getText = (name) => {
    return texts[name][language]
}