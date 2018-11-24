const mysql = require('mysql');
const express = require('express');
const router = express.Router();
const passwordHash = require('password-hash');
const session = require('express-session');
const passport = require('./passport')
const connection = require('./database.js');
const LocalStrategy = require('./passport/localStrat');


router.get('/', function(req,res) {
    if( req.user) {
        res.json({
            user: req.user
        });
    }
    else {
        res.json({
            user: null
        })
    }
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
                            "failed": true,
                            "message": error
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
                    "code": 409,
                    "failed": true,
                    "message": "This email already exists"
                })
            }
        }

    })
})

router.post('/signin', function(req,res, next) {
    next();
    },
    passport.authenticate('local'), (req, res) => {
        res.send(req.user);
    }
)

router.post('/logout', function(req,res) {
    if( req.user ) {
        req.logout();
        res.send({
            "message": "Logging out"
        })
    }
    else {
        res.send({
            "message": "Something went wrong! No user to logout"
        })
    }
})

module.exports = router;
