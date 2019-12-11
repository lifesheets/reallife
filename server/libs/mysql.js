var mysql = require('mysql');
class MYSQLConstructor {
    constructor() {
        this._connectionPool = mysql.createPool({
            host: "",
            user: "",
            password: "",
            database: "",
            multipleStatements: true
        });
        this._connectionPool.getConnection(function(err, connection) {
            connection.release();
            if (err) {
                process.exit();
            }
        });
    }
    query(sql, data) {
        var self = this;
        //console.log(self);
        return new Promise(function(fulfill, reject) {
            self._connectionPool.getConnection(function(err, connection) {
                if (err) {
                    if (connection) {
                        connection.release();
                    }
                    return reject(err);
                }
                connection.query(sql, data, function(error, results, fields) {
                    if (error) {
                        connection.release();
                        return reject(error);
                    }
                    connection.release();
                    return fulfill({
                        error: error,
                        results: results,
                        fields: fields
                    });
                });
            });
        });
    }
}
module.exports = new MYSQLConstructor();