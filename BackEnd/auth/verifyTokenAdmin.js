// Author: Ritchie Yapp
// https://github.com/speckly

// Additional function that checks if the token is an admin, decided not to append to verifyToken.js
// because runtime complexity go out of the window for easier integration also occurrences yes

var jwt = require('jsonwebtoken');
var config = require('../config');

function verifyTokenAdmin(req, res, next) {
    var token = req.headers['authorization'];
    if (!token || !token.includes('Bearer')) { 
        res.status(403);
		return res.send({ auth: 'false', message: 'Not authorized!' });
    } else {
        token = token.split('Bearer ')[1];
        jwt.verify(token, config.getCurrentKey(), function (err, decoded) { 
            console.log(decoded)
            if (err || decoded.type != 'Admin') { // Add another condition: if not admin, HTTP 403
                res.status(403);
                return res.json({ auth: false, message: 'Not authorized!' });
            } else {
                req.userid = decoded.userid; //decode the userid and store in req for use
                req.type = decoded.type; //decode the role and store in req for use
                next();
            }
        });
    }
}

module.exports = verifyTokenAdmin;