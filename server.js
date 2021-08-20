let express = require('express')
let app = express()
app.use(express.static('dist'))
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
