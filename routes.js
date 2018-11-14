const mysql = require('mysql');
const express = require('express');
const router = express.Router();

const connection = mysql.createConnection({
    host:"localhost",
    user: "root",
    password: "roomicse110",
    database: "roomiDB"
});

connection.connect(function(err) {
    if( err ) {
        throw err;
    }
    else {
        console.log("Connected!");
        var sql = "CREATE TABLE IF NOT EXISTS users (firstName VARCHAR(255), lastName VARCHAR(255), email VARCHAR(255), password VARCHAR(255) )";
        connection.query(sql, function(err, result) {
            if( err ) {
                throw err;
            }
            else {
                console.log("Table Done");
            }
        })
    }
})

router.get('/', function(req,res) {
    console.log("hi");
    res.send("hi");
})

router.post('/signup', function(req,res ) {
    var user = {
        "firstName": req.body.firstName,
        "lastName": req.body.lastName,
        "email": req.body.email,
        "password": req.body.password,
    }
    connection.query('INSERT INTO users SET ?', user, function(error, results, fields) {
        if( error ) {
            res.send({
                "code": 400,
                "failed": true
            })
        }
        else {
            res.send({
                "code": 200,
                "message": "Successfully registered user",
                "failed": false
            })
        }
    })
})

router.post('/signin', function(req,res) {

})

router.post('/reset', function(req,res) {
})

module.exports = router;
