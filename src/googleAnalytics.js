

function integrateGTM() {

    // console.log(window)

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-CZLJBKJQGT');

    // Modifications:
    gtag('set', {'checkProtocolTask': function(){ /* nothing */ } });
    gtag('send', 'pageview', '/popup'); // Set page, avoiding rejection due to chrome-extension protocol

    console.log('GA')
}

window.onload = () => integrateGTM()


