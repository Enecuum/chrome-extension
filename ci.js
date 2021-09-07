const http = require('http');
const crypto = require('crypto');
const exec = require('child_process').exec;
const url = require('url');

require('dotenv').config()

http.createServer(function (req, res) {

    const parsedUrl = url.parse(req.url, true)
    if (parsedUrl.pathname === '/update') {
        res.writeHead(200, {'Content-type': 'text/plain'})
        res.write('OK')
        res.end()
    }

    req.on('data', function (chunk) {
        let sig = 'sha1=' + crypto.createHmac('sha1', process.env.GITHUB).update(chunk.toString()).digest('hex')
        if (req.headers['x-hub-signature'] == sig) {
            exec('npm run stop')
            exec('git fetch --all')
            exec('git reset --hard origin/master')
            exec('npm i --force')
            exec('npm run make')
            exec('npm run prod')
        }
    });
    res.end()
}).listen(process.env.PORT)
