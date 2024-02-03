const HOSTNAME = "0.0.0.0"
const httpPort = 8081;
const httpsPort = 8082;
const https = false;

var app = require('./controller/app')

if (https){
    const express = require('express');
    const https = require('https');
    const fs = require('fs');

    const options = {
        key: fs.readFileSync('./key.pem'),
        cert: fs.readFileSync('./cert.pem'),
        passphrase: 'fluffy'
    };

    app.use((req, res, next) => {
        if (!req.secure) {
            url_https = `https://${req.headers.host.replace(/:\d+$/, `:${httpsPort}`)}${req.url}`
            return res.redirect(url_https);
        }
        next();
    });

    const server = https.createServer(options, app);
    server.listen(httpsPort, () => {
        console.log(`HTTPS server hosted at https://${HOSTNAME}:${httpsPort}`);
    });

    const httpServer = express();
    httpServer.use((req, res) => {
        url_https = `https://${req.headers.host.replace(/:\d+$/, `:${httpsPort}`)}${req.url}`
        return res.redirect(url_https);
    });

    httpServer.listen(httpPort, () => {
        console.log(`HTTP server hosted at http://${HOSTNAME}:${httpPort}`);
    });
    
} else {
    app.listen(httpPort, HOSTNAME, function () {
        console.log(`Server hosted at http://${HOSTNAME}:${httpPort}`)
    })
}