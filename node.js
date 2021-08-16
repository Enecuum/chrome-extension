let express = require('express');
let app = express();

app.use(express.static('./dist'));
let server = require('http').Server(app);
server.listen(8080);
