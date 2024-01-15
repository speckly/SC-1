const mysql = require("mysql");

var dbconnect = {
  getConnection: function () {

    var conn = mysql.createConnection({
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: 'root',
      database: 'store',
    });

    return conn;
  }
};

module.exports = dbconnect;
