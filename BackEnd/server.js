var app = require('./controller/app')
var hostname = "0.0.0.0"
var port = 8081;

app.listen(port, hostname, function () {
    console.log(`Server hosted at http://${hostname}:${port}`)
})