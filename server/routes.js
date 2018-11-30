const mysql = require('mysql');
const express = require('express');
const router = express.Router();
const passwordHash = require('password-hash');
const session = require('express-session');
const passport = require('./passport')
const connection = require('./database.js');
const LocalStrategy = require('./passport/localStrat');
const uuiD = require('uuid-by-string');

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
    const uniqueID = uuiD(req.body.uID);
    const household = {
        'uniqueID': uniqueID,
        'houseName': req.body.house,
        'housemate': uniqueID + "-housemate",
        'bills': uniqueID + "-bills",
        'parking': uniqueID+"-parking",
        'rules': uniqueID+"-rules",
        'chores': uniqueID+"-chores",
        'shopping': uniqueID+'-shopping',
        'polls': polls+'-polls'

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
                        "message": "Couldn't update user table in DB"
                    })
                }
                else {
                    var createhouseTable = "CREATE TABLE " + household.housemate + " (housemate VARCHAR(255))" ;
                    connection.query(createhouseTable, function(err, results) {
                        if( err ) {
                            res.json({
                                "code": 400,
                                "failed": true,
                                "message": "Couldn't create table housemate"
                            })
                        }
                        else {
                            var createhouseTable = "CREATE TABLE " + household.bills + " (name VARCHAR(255), amount DECIMAL(19,2), dueDate DATE )" ;
                            connection.query(createhouseTable, function(err, results) {
                                if( err ) {
                                    res.json({
                                        "code": 400,
                                        "failed": true,
                                        "message": "Couldn't create table bills"
                                    })
                                }
                                else {
                                    var createhouseTable = "CREATE TABLE " + household.parking + " (parking VARCHAR(255))" ;
                                    connection.query(createhouseTable, function(err, results) {
                                        if( err ) {
                                            res.json({
                                                "code": 400,
                                                "failed": true,
                                                "message": "Couldn't create table parking"
                                            })
                                        }
                                        else {
                                            var createhouseTable = "CREATE TABLE " + household.rules + " (rules VARCHAR(255))" ;
                                            connection.query(createhouseTable, function(err, results) {
                                                if( err ) {
                                                    res.json({
                                                        "code": 400,
                                                        "failed": true,
                                                        "message": "Couldn't create table rules"
                                                    })
                                                }
                                                else {
                                                    var createhouseTable = "CREATE TABLE " + household.chores + " (chores VARCHAR(255))" ;
                                                    connection.query(createhouseTable, function(err, results) {
                                                        if( err ) {
                                                            res.json({
                                                                "code": 400,
                                                                "failed": true,
                                                                "message": "Couldn't create table chores"
                                                            })
                                                        }
                                                        else {
                                                            var createhouseTable = "CREATE TABLE " + household.shopping + " (shopping VARCHAR(255))" ;
                                                            connection.query(createhouseTable, function(err, results) {
                                                                if( err ) {
                                                                    res.json({
                                                                        "code": 400,
                                                                        "failed": true,
                                                                        "message": "Couldn't create table shopping"
                                                                    })
                                                                }
                                                                else {
                                                                    var createhouseTable = "CREATE TABLE " + household.polls + " (polls VARCHAR(255))" ;
                                                                    connection.query(createhouseTable, function(err, results) {
                                                                        if( err ) {
                                                                            res.json({
                                                                                "code": 400,
                                                                                "failed": true,
                                                                                "message": "Couldn't create table polls "
                                                                            })
                                                                        }
                                                                        else {
                                                                            res.json({
                                                                                "code": 200,
                                                                                "failed": false,
                                                                                "message": "All tables created successfully"
                                                                            })
                                                                        }
                                                                    }) 
                                                                }
                                                            }) 
                                                        }
                                                    }) 
                                                }
                                            })
                                        }
                                    }) 
                                }
                            }) 
                        }
                    })
                }
            })
        }
    })
    
})

router.post('/joinHouse', function( req, res ) {
    const uniqueID = uuiD(req.body.uID);
    var getDB = 'SELECT * from household WHERE uniqueID='+ "\"" + uniqueID + "\"";
    connection.query(getDB, function(err, results) {
        if( err ) {
            res.json({ 
                "code": 400,
                "failed": true,
                "message": "This DB does not contain this household"
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
                const housemate = {
                    'housemate': req.body.name,
                } 
                var insertIntoDB = 'INSERT INTO' + uniqueID + '-housemate SET ?';
                connection.query(insertIntoDB, housemate, function(err, results, fields) {
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
