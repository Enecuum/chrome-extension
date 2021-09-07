const http = require('http');
const crypto = require('crypto');
const execSync = require('child_process').execSync;
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
            execSync('npm run stop')
            execSync('git fetch --all')
            execSync('git reset --hard origin/master')
            execSync('npm i --force')
            execSync('npm run make')
            execSync('npm run prod')
        }
    });
    res.end()
}).listen(process.env.PORT)
