const express = require('express');
const serveStatic = require('serve-static');
const verifyTokenAdmin = require('../BackEnd/auth/verifyTokenAdmin');
const https = require('https');
const fs = require('fs');
require('dotenv').config();

const app = express();
const httpPort = 3001;
const httpsPort = 3002;
HOSTNAME = "0.0.0.0";

// Middleware to redirect HTTP to HTTPS
app.use((req, res, next) => {
    if (!req.secure) {
        url_https = `https://${req.headers.host.replace(/:\d+$/, `:${httpsPort}`)}${req.url}`
        console.log(url_https)
        return res.redirect(url_https);
    }
    next();
});


app.use(function (req, res, next) {
    if (req.method != "GET") {
        res.type('.html');
        var msg = "<html><body>This server only serves web pages with GET!</body></html>";
        res.end(msg);
    } else {
        next();
    }
});

app.use('/admin.html', verifyTokenAdmin, (req, res) => {
    res.sendFile(__dirname + "/public/admin.html");
});

app.use(serveStatic(__dirname + "/public"));

// HTTPS configuration
const options = {
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem'),
    passphrase: process.env.PASSPHRASE
};

const server = https.createServer(options, app);
server.listen(httpsPort, () => {
    console.log(`HTTPS server hosted at https://${HOSTNAME}:${httpsPort}`);
});

// Create HTTP server for redirection
const httpServer = express();
httpServer.use((req, res) => {
    url_https = `https://${req.headers.host.replace(/:\d+$/, `:${httpsPort}`)}${req.url}`
    return res.redirect(url_https);
});

httpServer.listen(httpPort, () => {
    console.log(`HTTP server hosted at http://${HOSTNAME}:${httpPort}`);
});
