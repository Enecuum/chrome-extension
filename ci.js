const http = require('http')
const crypto = require('crypto')
const execSync = require('child_process').execSync
const url = require('url')
const fs = require('fs')

require('dotenv').config()

http.createServer(function (req, res) {

    let HEAD = execSync('git rev-parse --short HEAD').toString().replace('\n', '')
    let DATE = fs.statSync('./dist/serviceWorker.js').birthtime

    const parsedUrl = url.parse(req.url, true)
    if (parsedUrl.pathname === '/update') {
        res.writeHead(200, {'Content-type': 'text/plain'})
        res.write(JSON.stringify({HEAD, DATE}))
        res.end()
    }

    req.on('data', function (chunk) {
        let sig = 'sha1=' + crypto.createHmac('sha1', process.env.GITHUB).update(chunk.toString()).digest('hex')
        if (req.headers['x-hub-signature'] == sig) {
            execSync('npm run stop')
            execSync('git fetch --all')
            execSync('git reset --hard origin/master')
            execSync('git pull')
            execSync('npm i --force')
            execSync('npm run make')
            execSync('npm run prod')
        }
    })
    res.end()
}).listen(process.env.PORT)
