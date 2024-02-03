const db = require("./databaseConfig");

const reviewDB = {
	addReview: (userid, rating, review, productid, callback) => {
		var dbConn = db.getConnection();
		dbConn.connect(function (err) {
			if (err) {
				return callback(err, null)
			} else {
				dbConn.query(`
					insert into reviews
					(userid, rating, review, productid)
					values(?, ?, ?, ?);`, 
					[userid, rating, review, productid], 
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

	//Retrieves all the reviews of a particular product
	getProductReview: (productid, callback) => {
		var dbConn = db.getConnection();
		dbConn.connect(function (err) {
			if (err) {
				return callback(err, null)
			} else {
				dbConn.query(`
					select reviewid, productid, u.userid, username, rating, review, r.created_at
					from reviews r, user u 
					where productid=?
					and r.userid = u.userid;`, [productid], 
					function (err, results) {
					dbConn.end();
					if (err) {
						console.log(err)
					}
					return callback(err, results)
				});
			}
		});
	},
	deleteReview: (reviewid, userid, callback) => {
		var dbConn = db.getConnection();
		console.log(reviewid)
		dbConn.connect(function (err) {
			if (err) {
				return callback(err, null)
			} else {
				dbConn.query(`delete from reviews where reviewid = ? and userid = ?;`, 
				[reviewid, userid], function (err, results) {
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
};

module.exports = reviewDB;