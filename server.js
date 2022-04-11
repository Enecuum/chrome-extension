let express = require('express')
let app = express()
app.use('/', express.static('dist'))
app.listen(8080)

// const https = require('https')
// const fs = require('fs')
//
// const options = {
//     key: fs.readFileSync('./dist/localhost-key.pem'),
//     cert: fs.readFileSync('./dist/localhost.pem'),
// };
// let server = https.createServer(options, app)
// server.listen(8080)

app.get('/android', function(req, res){
    const file = `${__dirname}/download/enecuum.apk`;
    res.download(file); // Set disposition and send it.
})

app.get('/macos', function(req, res){
    const file = `${__dirname}/download/enecuum.dmg`;
    res.download(file); // Set disposition and send it.
})

app.get('/windows', function(req, res){
    const file = `${__dirname}/download/enecuum.exe`;
    res.download(file); // Set disposition and send it.
})

app.get('/linux', function(req, res){
    const file = `${__dirname}/download/enecuum`;
    res.download(file); // Set disposition and send it.
})
