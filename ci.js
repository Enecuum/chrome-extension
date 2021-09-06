const http = require('http');
const crypto = require('crypto');
const exec = require('child_process').exec;

http.createServer(function (req, res) {
    req.on('data', function(chunk) {
        let sig = "sha1=" + crypto.createHmac('sha1', process.env.GITHUB).update(chunk.toString()).digest('hex');

        if (req.headers['x-hub-signature'] == sig) {
            exec('npm run stop');
            exec('git pull');
            exec('npm i --force');
            exec('npm run make');
            exec('npm run prod');
        }
    });

    res.end();
}).listen(5454);
