const express = require('express'); 
const serveStatic = require('serve-static');
const verifyTokenAdmin = require('../BackEnd/auth/verifyTokenAdmin')

var hostname = "0.0.0.0";
var port = 3001;

var app = express();

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
    res.sendFile(__dirname + "/public/admin.html")
});

app.use(serveStatic(__dirname + "/public"));

app.listen(port, hostname, function () {
    console.log(`Server hosted at http://${hostname}:${port}`);
});