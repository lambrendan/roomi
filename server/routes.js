const mysql = require('mysql');
const express = require('express');
const router = express.Router();
const passwordHash = require('password-hash');
const session = require('express-session');
const passport = require('./passport')
const connection = require('./database.js');
const LocalStrategy = require('./passport/localStrat');


router.get('/check', function(req,res) {
    console.log("req is");
    console.log(req);
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
router.get('/auth', (req,res) => {
    if( req.isAuthenticated()) {
        res.json({ 
            success: true,
            user: req.user
        })
    }
    else {
        res.json({ 
            success: false
        })
    }
})
router.get('/checkHouse', (req,res) => {
    var checkHousehold = 'SELECT householdID from users WHERE email=' + "\"" + req.user.email + "\"";
    connection.query(checkHousehold, function(err, results) {
        if( err ) {
            res.json({
                "code": 400,
                "failed": true,
                "message": "Couldn't make query to get householdID from users"
            })
        }
        else {
            if( results[0].householdID === null ) {
                res.json({
                    "hasHousehold": false
                })
            }
            else {
                res.json({
                    "hasHousehold": true
                })
            }
        }
    })
}) 

router.post('/newHouse', function(req,res) {
    const uniqueID = passwordHash.generate(req.body.uID);
    const household = {
        'uniqueID': uniqueID,
        'houseName': req.body.house,
        'housemate': req.body.name,
    } 
    var insertDB = 'INSERT INTO household SET ?';
    connection.query(insertDB, household, function(err, results, fields) {
        if( err ) {
            res.json({ 
                "code": 400,
                "failed": true,
                "message": "Couldn't insert into household"
            })
        }
        else {
            var insertHousehold = "UPDATE users SET householdID=" + "\""+ uniqueID + "\"" + "WHERE email="+ "\"" + req.user.email + "\"";
            connection.query(insertHousehold, function(err, results) {
                if( err ) {
                    res.json({
                        "code": 400,
                        "failed": true,
                        "message": "Couldn't update user in DB"
                    })
                }
                else {
                    res.json({
                        'code': 200,
                        'failed': false,
                        'message': 'Users table updated correctly with household' 
                    })
                }
            })
        }
    })
    
})

router.post('/joinHouse', function( req, res ) {
    const uniqueID = passwordHash.generate(req.body.uID);
    var insertDB = 'SELECT * from household WHERE uniqueID='+ "\"" + uniqueID + "\"";
    connection.query(insertDB, household, function(err, results, fields) {
        if( err ) {
            res.json({ 
                "code": 400,
                "failed": true,
                "message": "Couldn't insert into household"
            })
        }
        else {
            if( results == undefined || results.length == 0 ) {
                res.json({
                    "code": 400,
                    "failed": true,
                    "message": "You have entered the wrong household ID" 
                })
            }
            else {
                var alterTable = "ALTER TABLE household ADD COLUMN" + "\"" + req.body.name+ "\"";
                connection.query(alterTable, function(err, results) {
                    if( err ) {
                        res.json({
                            "code": 400,
                            "failed": true,
                            "message": "Could not add new housemate to the table"
                        })
                    }
                    else {
                        var insertHousehold = "UPDATE users SET householdID=" + "\""+ uniqueID + "\"" + "WHERE email="+ "\"" + req.user.email + "\"";
                        connection.query(insertHousehold, function(err, results) {
                            if( err ) {
                                res.json({
                                    "code": 400,
                                    "failed": true,
                                    "message": "Couldn't update user in DB"
                                })
                            }
                            else {
                                res.json({
                                    'code': 200,
                                    'failed': false,
                                    'message': 'Users table updated correctly with household' 
                                })
                            }
                        })
                    }
                })
            }  
        }
    })
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
                        res.json({
                            "code": 400,
                            "failed": true,
                            "message": error
                        })
                    }
                    else {
                        res.json({
                            "code": 200,
                            "message": "Successfully registered user",
                            "failed": false
                        })
                    }
                })
            }
            else {
                res.json({
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
