const mysql = require('mysql');

const connection = mysql.createConnection({
    host:"localhost",
    user: "root",
    password: "roomicse110",
    database: "roomiDB"
});

module.exports = connection;
