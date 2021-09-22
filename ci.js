const http = require('http')
const crypto = require('crypto')
const execSync = require('child_process').execSync
const url = require('url')
const fs = require('fs')

require('dotenv').config()
let STATE = 'INIT'

http.createServer(function (req, res) {

    let DIST = fs.readFileSync('./dist/VERSION', 'utf8')
    let HEAD = execSync('git rev-parse --short HEAD').toString().trim()
    let DATE = new Date(fs.statSync('./dist/VERSION').mtime).addHours(3)

    const parsedUrl = url.parse(req.url, true)
    if (parsedUrl.pathname === '/update') {
        res.writeHead(200, {'Content-type': 'text/plain'})
        res.write(JSON.stringify({DIST, HEAD, DATE, STATE}))
        res.end()
        return
    }

    if (parsedUrl.pathname === '/restart') {
        res.end()
        restartServer().then()
        return
    }

    req.on('data', function (chunk) {
        let sig = 'sha1=' + crypto.createHmac('sha1', process.env.GITHUB).update(chunk.toString()).digest('hex')
        if (req.headers['x-hub-signature'] === sig) {
            res.end()
            restartServer().then()
            return
        }
    })

    res.end()

}).listen(process.env.PORT)

let restartServer = async () => {
    STATE = 'STOP'
    console.log(execSync('npm run stop'))
    STATE = 'GIT FETCH'
    console.log(execSync('git fetch --all'))
    STATE = 'GIT RESET'
    // console.log(execSync('git reset --hard origin/master'))
    STATE = 'GIT PULL'
    console.log(execSync('git pull'))
    STATE = 'NPM I'
    console.log(execSync('npm i --force'))
    STATE = 'MAKE'
    console.log(execSync('npm run make'))
    STATE = 'PROD'
    console.log(execSync('npm run prod'))
    STATE = 'PRODUCTION'
}

STATE = 'ON'

Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
}
