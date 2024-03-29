const db = require("./databaseConfig");

const discountDB = {
	//Add new discount to database
	addNewDiscount: (
		productid, discount_percentage, start_at, 
		end_at, name, description, callback
	) => {
		var dbConn = db.getConnection();
		dbConn.connect(function (err) {
			if (err) {
				return callback(err, null);
			} else {
				dbConn.query(
					`insert into discount 
					(productid, discount_percentage, start_at, end_at, name, description) values
					(?, ?, ?, ?, ?, ?);`,
					[productid, discount_percentage, start_at, end_at, name, description],
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

	//Get all user
	getAllDiscount: (callback) => {
		var dbConn = db.getConnection();
		dbConn.connect(function (err) {
			if (err) {
				return callback(err, null);
			} else {
				dbConn.query(
					`SELECT * FROM discount;`,
					[],
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

	//Get discount by productid
	getProductDiscount: (productid, callback) => {
		var dbConn = db.getConnection();
		dbConn.connect(function (err) {
			if (err) {
				return callback(err, null);
			} else {
				dbConn.query(
					`SELECT * FROM discount d WHERE d.productid = ?;`,
					[productid],
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

	//Update discount by discountid
	updateDiscount: (
		productid, discount_percentage, start_at, end_at, 
		name, description, discountid, callback
	) => {
		var dbConn = db.getConnection();
		dbConn.connect(function (err) {
			if (err) {
				return callback(err, null);
			} else {
				dbConn.query(
					`Update discount set 
					productid=?, 
					discount_percentage=?, 
					start_at=?, 
					end_at=?,
					name=?, 
					description=?
					where discountid=?;`,
					[
						productid, discount_percentage, start_at, 
						end_at, name, description, discountid,
					],
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

	//Delete discount by discountid
	deleteDiscount: (discountid, callback) => {
		var dbConn = db.getConnection();
		dbConn.connect(function (err) {
			if (err) {
				return callback(err, null);
			} else {
				dbConn.query(
					`delete from discount where discountid=?;`,
					[discountid],
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

module.exports = discountDB;