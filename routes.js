const mysql = require('mysql');
const express = require('express');
const router = express.Router();
const passwordHash = require('password-hash');
const session = require('express-session');
const passport = require('passport')


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
    const hashedPass = passwordHash.generate(req.body.password);
    var user = {
        "firstName": req.body.firstName,
        "lastName": req.body.lastName,
        "email": req.body.email,
        "password": hashedPass
    }
    var lookUpUser = "SELECT * from users WHERE email=" + "\"" + req.body.email + "\"";
    connection.query(lookUpUser, function(err, results) {
        if( err ) {
            console.log(err);
        }
        else {
            if( results == undefined || results.length == 0 ) {
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
            }
            else {
                res.send({
                    "code": 400,
                    "message": "This email already exists"
                })
            }
        }

    })
})

router.post('/signin', function(req,res) {
    const signinInfo = "SELECT password from users WHERE email =" + "\"" + req.body.email + "\"";
    connection.query(signinInfo, function( err, result) {
        if( err ) {
            throw err;
        }
        else {
            if( result == undefined || result.length == 0 ) {
                res.send({
                    "code": 350,
                    "message": "This user doesn't exist! Go register"
                })
            }
            else {
                const isPassword = passwordHash.verify(req.body.password, result[0].password)
                if( isPassword == true  ) {
                    res.send({
                        "login": true,
                        "message": "Successfully logged in"
                    });
                }
                else {
                    res.send({
                        "login": false,
                        "message": "Wrong password, try again"
                    });
                }
            }
        }
    })
})

router.post('/reset', function(req,res) {
})

module.exports = router;
