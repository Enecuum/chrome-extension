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

app.get('/mac', function(req, res){
    const file = `${__dirname}/desktop/mac/Enecuum-1.0.0.dmg`;
    res.download(file); // Set disposition and send it.
})

app.get('/win', function(req, res){
    const file = `${__dirname}/desktop/mac/Enecuum.app`;
    res.download(file); // Set disposition and send it.
})

app.get('/linux', function(req, res){
    const file = `${__dirname}/desktop/linux/Enecuum.`;
    res.download(file); // Set disposition and send it.
})
