const db = require("./databaseConfig");

const productDB = {
	//Add new product to database
	addNewProduct: (name, description, categoryid, brand, price, callback) => {
		var dbConn = db.getConnection();
		dbConn.connect(function (err) {
			if (err) {
				return callback(err, null);
			} else {
				dbConn.query(
					`insert into product 
					(name, description, categoryid, brand, price)
					values(?, ?, ?, ?, ?);`,
					[name, description, categoryid, brand, price],
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

	// 16: Get product by productid
	getProduct: (productid, callback) => {
		var dbConn = db.getConnection();
		dbConn.connect(function (err) {
			if (err) {
				return callback(err, null);
			} else {
				dbConn.query(
					`select p.productid, p.name, p.description, c.categoryid, category categoryname, p.brand, p.price, COUNT(distinct r.reviewid) reviewcount, pi.path imagepath, AVG( r.rating) rating, d.discountid, d.discount_percentage
					from product p
					join category c on c.categoryid = p.categoryid  
					left join reviews r on r.productid = p.productid
					left join productimages pi on pi.productid = p.productid 
					left join discount d on d.productid = p.productid 
					where p.productid = ?
					GROUP BY p.productid`, [productid], 
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

	//Get all product
	getAllProduct: (callback) => {
		var dbConn = db.getConnection();
		dbConn.connect(function (err) {
			if (err) {
				return callback(err, null);
			} else {
				dbConn.query(
					`select p.productid, p.name, p.description, c.categoryid, category categoryname, p.brand, p.price, COUNT(distinct r.reviewid) reviewcount, pi.path imagepath, AVG( r.rating) rating, d.discountid, d.discount_percentage
					from product p
					join category c on c.categoryid = p.categoryid  
					left join reviews r on r.productid = p.productid
					left join productimages pi on pi.productid = p.productid 
					left join discount d on d.productid = p.productid 
					GROUP BY p.productid;`, [],
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

	//6: Get all product
	getAllProductByBrand: (brand, callback) => {
		var dbConn = db.getConnection();
		dbConn.connect(function (err) {
			if (err) {
				return callback(err, null);
			} else {
				dbConn.query(
					`select p.productid, p.name, p.description, c.categoryid, category categoryname, p.brand, p.price, COUNT(distinct r.reviewid) reviewcount, pi.path imagepath, AVG(distinct r.rating) rating
					from product p
					join category c on c.categoryid = p.categoryid  and p.brand =?
					left join reviews r on r.productid = p.productid
					left join productimages pi on pi.productid = p.productid 
					GROUP BY p.productid;`, [brand],
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

	//Delete product by productid
	deleteProduct: (productid, callback) => {
		//Connects
		var dbConn = db.getConnection();
		dbConn.connect(function (err) {
			//Return error
			if (err) {
				return callback(err, null);
			} else {
				//Sql query
				dbConn.query(
					`
        delete from product where productid=?;`,
					[productid],
					function (err, results) {
						//End connection
						dbConn.end();

						if (err) console.log(err);

						return callback(err, results);
					}
				);
			}
		});
	},

	//Get 3 cheapest product based on categoryid
	get3CheapestFromCategory: (categoryid, callback) => {
		//Connects
		var dbConn = db.getConnection();
		dbConn.connect(function (err) {
			//Return error
			if (err) {
				return callback(err, null);
			} else {
				//Sql query
				dbConn.query(
					`SELECT * FROM product where categoryid=? order by price asc LIMIT 3;`,
					[categoryid],
					function (err, results) {
						//End connection
						dbConn.end();

						if (err) console.log(err);

						return callback(err, results);
					}
				);
			}
		});
	},

	updateProduct: (
		name, description, categoryid,
		brand, price, productid, callback
	) => {
		var dbConn = db.getConnection();
		dbConn.connect(function (err) {
			if (err) {
				return callback(err, null);
			} else {
				dbConn.query(
					`Update product set 
					name=?, 
					description=?, 
					categoryid=?, 
					brand=?,
					price=?
					where productid=?;`,
					[name, description, categoryid, brand, price, productid],
					function (err, results) {
						//End connection
						dbConn.end();

						if (err) console.log(err);

						return callback(err, results);
					}
				);
			}
		});
	},
};

module.exports = productDB;
