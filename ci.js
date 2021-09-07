const http = require('http');
const crypto = require('crypto');
const execSync = require('child_process').execSync;
const url = require('url');
const fs = require('fs')

require('dotenv').config()

http.createServer(function (req, res) {

    let VERSION = fs.readFileSync('./dist/VERSION', 'utf8')
    let LASTCOMMITDATETIME = fs.readFileSync('./dist/LASTCOMMITDATETIME', 'utf8')
    let COMMITHASH = fs.readFileSync('./dist/COMMITHASH', 'utf8')

    const parsedUrl = url.parse(req.url, true)
    if (parsedUrl.pathname === '/update') {
        res.writeHead(200, {'Content-type': 'text/plain'})
        res.write(JSON.stringify({VERSION, LASTCOMMITDATETIME, COMMITHASH}))
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
