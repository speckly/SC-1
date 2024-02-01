

const db = require("./databaseConfig");
var config = require('../config.js');
var jwt = require('jsonwebtoken');

const userDB = {
	addNewUser: (username, email, contact, password, type, profile_pic_url, callback) => {
		var dbConn = db.getConnection();
		dbConn.connect(function (err) {
			if (err) {
				return callback(err, null)
			} else {
				dbConn.query(`
					insert into user 
					(username, email, contact, password, type, profile_pic_url) values
					(?, ?, ?, ?, ?, ?);`, 
					[username, email, contact, password, type, profile_pic_url], 
					function (err, results) {
						dbConn.end();
						if (err)
							console.log(err)
						return callback(err, results)
					}
				);
			}
		});
	},
	getAllUser: callback => {
		var dbConn = db.getConnection();
		dbConn.connect(function (err) {
			if (err) {
				return callback(err, null)
			} else {
				dbConn.query(`
					SELECT 
					u.userid, 
					u.username, 
					u.email, 
					u.contact, 
					u.type, 
					u.profile_pic_url, 
					u.created_at 
					FROM user u;`, [], 
					function (err, results) {
						dbConn.end();
						if (err){
							console.log(err)
						}
						return callback(err, results)
				});
			}
		});
	},
	getUser: (userid, callback) => {
		var dbConn = db.getConnection();
		dbConn.connect(function (err) {
			if (err) {
				return callback(err, null)
			} else {
				dbConn.query(`
					SELECT 
					u.userid, 
					u.username, 
					u.email, 
					u.contact, 
					u.type, 
					u.profile_pic_url, 
					u.created_at 
					FROM user u 
					WHERE u.userid = ?;`, 
					[userid], 
					function (err, results) {
						dbConn.end();
						if (err) {
							console.log(err)
						}
						return callback(err, results)
					}
				);
			}
		});
	},
	updateUser: (username, email, contact, password, type, profile_pic_url, userid, oldPassword, callback) => {
		var dbConn = db.getConnection();
		dbConn.connect(function (err) {
			if (err) {
				return callback(err, null)
			} else {
				dbConn.query(`
					Update user set 
					username=?, 
					email=?, 
					contact=?, 
					password=?, 
					type=?, 
					profile_pic_url=?
					where userid=? and password=?;`, 
					[username, email, contact, password, type, profile_pic_url, userid, oldPassword], 
					function (err, results) {
						dbConn.end();
						if (err){
							console.log(err)
						}
						return callback(err, results)
					}
				);
			}
		});
	},
	loginUser: function (username, password, callback) {
		var conn = db.getConnection();
		conn.connect(function (err) {
			if (err) {
				console.log(err);
				return callback(err, null);
			}
			else {
				// Think hard about the various return cases
				let sql = 'select * from user where username=? and password=?';
				conn.query(sql, [username, password], function (err, result) {
					conn.end();
					if (err) {
						console.log("Err: " + err);
						return callback(err, null);
					} else {
						if (result.length == 1) {
							token = jwt.sign({
								userid: result[0].userid,
								type: result[0].type,
							}, config.key, {
								expiresIn: 86400 // Expires in 24 hours
							});
							return callback(null, result, token);
						} else {
							var err2 = new Error("UserID/Password does not match.");
							err2.statusCode = 500;
							return callback(err2, null, null);
						}
					}
				});
			}
		});
	},

};

module.exports = userDB;