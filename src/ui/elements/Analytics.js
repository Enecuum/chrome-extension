import { useEffect } from 'react';

export default function Analytics() {
    const initAnalytics = () => {
        setTimeout(() => {
            const gaPlugin = _gaq || [];
            gaPlugin.push(['_setAccount', 'UA-146541489-2']);
            gaPlugin.push(['_trackPageview']);
            console.log('Google Analytics')
        }, 2000);
    };

    useEffect(() => {
        (function() {
            var ga = document.createElement('script');
            ga.type = 'text/javascript';
            ga.async = true;
            ga.src = 'https://ssl.google-analytics.com/ga.js';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(ga, s);
            initAnalytics();
        })();
    }, []);

    return null;
}
