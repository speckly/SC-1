const db = require("./databaseConfig");

const categoryDB = {
    addNewCategory: (category, description, callback) => {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {
                return callback(err, null);
            } else {
                dbConn.query(
                    `insert into category (category, description) values(?, ?);`,
                    [category, description],
                    function (err, results) {
                        dbConn.end();
                        if (err) {
                            console.log(err)
                        }
                        return callback(err, results);
                    }
                );
            }
        });
    },

    //Get all category
    getAllCategory: (callback) => {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {
                return callback(err, null);
            } else {
                dbConn.query(`SELECT * FROM category;`, [], function (err, results) {
                    dbConn.end();
                    if (err) {
                        console.log(err)
                    }
                    return callback(err, results);
                });
            }
        });
    },
};

module.exports = categoryDB;
