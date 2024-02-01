const db = require("./databaseConfig");

const productImagesDB = {
	addImage: (productid, name, type, path, callback) => {
		var dbConn = db.getConnection();
		dbConn.connect(function (err) {
			if (err) {
				return callback(err, null);
			} else {
				dbConn.query(
					`insert into productimages 
					(productid, name, type, path)
					values(?, ?, ?, ?);`,
					[productid, name, type, path],
					function (err, results) {
						//End connection
						dbConn.end();
						if (err) {
							console.log(err);
						}
						return callback(err, results);
					}
				);
			}
		});
	},

	//Get product image by productid
	getProductImage: (productid, callback) => {
		var dbConn = db.getConnection();
		dbConn.connect(function (err) {
			if (err) {
				return callback(err, null);
			} else {
				dbConn.query(
					`select name, type, path from productimages
					where productid=?`, [productid],
					function (err, results) {
						dbConn.end();
						if (err) {
							console.log(err);
						}
						return callback(err, results);
					}
				);
			}
		});
	},
};

module.exports = productImagesDB;
