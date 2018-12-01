const mysql = require('mysql');
const express = require('express');
const router = express.Router();
const passwordHash = require('password-hash');
const session = require('express-session');
const passport = require('./passport')
const connection = require('./database.js');
const LocalStrategy = require('./passport/localStrat');
const uuiD = require('uuid-by-string');
const crypto = require('crypto');

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
    var checkHouseName = 'SELECT * from household WHERE houseName=' + "\"" + req.body.house + "\"";
    connection.query(checkHouseName, function(err, results) {
        if( err ) {
            res.json({ 
                "code": 400,
                "failed": true,
                "message": "Error occured finding this household"
            })
        }
        else {
            if( results == undefined || results.length === 0 ) {
                const uniqueID = crypto.createHash('sha256').update(req.body.uID).digest('hex')
                const household = {
                    'uniqueID': uniqueID,
                    'houseName': req.body.house,
                    'housemate': req.body.house + "_housemate",
                    'bills': req.body.house + "_bills",
                    'parking': req.body.house+"_parking",
                    'rules': req.body.house+"_rules",
                    'chores': req.body.house+"_chores",
                    'shopping': req.body.house+'_shopping',
                    'polls': req.body.house+'_polls'

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
                                        var createbillsTable = "CREATE TABLE " + household.bills + " (name VARCHAR(255), amount DECIMAL(19,2), dueDate VARCHAR(255), paid TINYINT(1), housemate VARCHAR(255))" ;
                                        connection.query(createbillsTable, function(err, results) {
                                            if( err ) {
                                                res.json({
                                                    "code": 400,
                                                    "failed": true,
                                                    "message": "Couldn't create table bills"
                                                })
                                            }
                                            else {
                                                var createparkingTable = "CREATE TABLE " + household.parking + " (parkingSpot VARCHAR(255), housemate VARCHAR(255))" ;
                                                connection.query(createparkingTable, function(err, results) {
                                                    if( err ) {
                                                        res.json({
                                                            "code": 400,
                                                            "failed": true,
                                                            "message": "Couldn't create table parking"
                                                        })
                                                    }
                                                    else {
                                                        var createrulesTable = "CREATE TABLE " + household.rules + " (rules VARCHAR(255))" ;
                                                        connection.query(createrulesTable, function(err, results) {
                                                            if( err ) {
                                                                res.json({
                                                                    "code": 400,
                                                                    "failed": true,
                                                                    "message": "Couldn't create table rules"
                                                                })
                                                            }
                                                            else {
                                                                var createchoresTable = "CREATE TABLE " + household.chores + " (chore VARCHAR(255), housemate VARCHAR(255), isDone TINYINT(1))" ;
                                                                connection.query(createchoresTable, function(err, results) {
                                                                    if( err ) {
                                                                        res.json({
                                                                            "code": 400,
                                                                            "failed": true,
                                                                            "message": "Couldn't create table chores"
                                                                        })
                                                                    }
                                                                    else {
                                                                        var createshoppingTable = "CREATE TABLE " + household.shopping + " (shopping VARCHAR(255))" ;
                                                                        connection.query(createshoppingTable, function(err, results) {
                                                                            if( err ) {
                                                                                res.json({
                                                                                    "code": 400,
                                                                                    "failed": true,
                                                                                    "message": "Couldn't create table shopping"
                                                                                })
                                                                            }
                                                                            else {
                                                                                var createpollsTable = "CREATE TABLE " + household.polls + " (polls VARCHAR(255))" ;
                                                                                connection.query(createpollsTable, function(err, results) {
                                                                                    if( err ) {
                                                                                        res.json({
                                                                                            "code": 400,
                                                                                            "failed": true,
                                                                                            "message": "Couldn't create table polls "
                                                                                        })
                                                                                    }
                                                                                    else {
                                                                                        const newHousemate = {
                                                                                            'housemate': req.user.firstName + " " + req.user.lastName,
                                                                                        } 
                                                                                        var insertIntoDB = 'INSERT INTO ' + household.houseName + '_housemate SET ?';
                                                                                        connection.query(insertIntoDB, newHousemate, function(err, results, fields) {
                                                                                            if( err ) {
                                                                                                res.json({
                                                                                                    "code": 400,
                                                                                                    "failed": true,
                                                                                                    "message": "Could not add new housemate to the table"
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
                    }
                })
                
            }
            else {
                res.json({ 
                    "code": 400,
                    "failed": true,
                    "message": "This household already exists"
                })
            }
        }
    })
})

router.post('/joinHouse', function( req, res ) {
    const uniqueID = crypto.createHash('sha256').update(req.body.uID).digest('hex')
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
                    'housemate': req.user.firstName + " " + req.user.lastName,
                } 
                var insertIntoDB = 'INSERT INTO ' + results[0].houseName + '_housemate SET ?';
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

router.get('/chores', function(req,res) {
    var getHouseName = 'SELECT houseName from household where uniqueID=' + "\"" + req.user.householdID + "\"";
    connection.query(getHouseName, function(err, results) {
        if( err ) {
            res.json({
                "code": 400,
                "failed": true,
                "message": "Couldn't make query to get current household from users"
            });
        }
        else{
            var getChores = 'SELECT * from ' + results[0].houseName + "_chores";
            connection.query(getChores, function(err, results) {
                if( err ) {
                    res.json({
                        "code": 400,
                        "failed": true,
                        "message": "Couldn't make query to get chores"
                    }); 
                }
                else {
                    res.json({
                        "chores": results,
                    })
                    console.log(results);
                }
            })
        }
    })
})

router.post('/updateChores', function(req, res){
    var getHouseName = 'SELECT houseName from household where uniqueID=' + "\"" + req.user.householdID + "\"";
    connection.query(getHouseName, function(err, results) {
        if( err ) {
            res.json({
                "code": 400,
                "failed": true,
                "message": "Couldn't make query to get current household from users"
            });
        }
        else {
            var updateChoreIsDone = 'UPDATE ' + results[0].houseName + '_chores SET isDone=' + req.body.isDone  + " where chore=" + "\"" + req.body.chore + "\"";
            console.log(updateChoreIsDone);
            var housename = results[0].houseName;
            connection.query(updateChoreIsDone,  housename, function(err, results){
                if( err ) {
                    res.json({
                        "code": 400,
                        "failed": true,
                        "message": "Couldn't make query to update chore"
                    });
                }
                else {
                    var updateChoreAssignee = 'UPDATE ' + housename + '_chores SET housemate=' + "\"" + req.body.housemate + "\"" + " where chore=" + "\"" + req.body.chore + "\"";
                    connection.query(updateChoreAssignee, function(err, results){
                        if( err ) {
                            res.json({
                                "code": 400,
                                "failed": true,
                                "message": "Couldn't make query to update chore"
                            });
                        }  
                        else{
                            res.json({
                                "code": 200,
                                "failed": false,
                                "message": "made query to update chore"
                            });
                        }
                    })
                }
            })
        }
    })
})

router.post('/choreIsDone', function(req, res){
    var getHouseName = 'SELECT houseName from household where uniqueID=' + "\"" + req.user.householdID + "\"";
    connection.query(getHouseName, function(err, results) {
        if( err ) {
            res.json({
                "code": 400,
                "failed": true,
                "message": "Couldn't make query to get current household from users"
            });
        }
        else {
            var getChoreIsDone = "SELECT isDone from " + results[0].houseName + "_chores where chore=" + "\"" + req.body.chore + "\"" + "and housemate=" + "\"" + req.body.housemate + "\"";
            console.log(getChoreIsDone);
            connection.query(getChoreIsDone, function(err, results){
                if( err ) {
                    res.json({
                        "code": 400,
                        "failed": true,
                        "message": "Couldn't make query to get if chore is done"
                    });
                }
                else {
                    res.json({
                        "code": 200,
                        "failed": false,
                        "isDone": results[0].isDone,
                    });
                }
            })
        }
    })
})


router.post('/chores', function(req,res){
    var getHouseName = 'SELECT houseName from household where uniqueID=' + "\"" + req.user.householdID + "\"";
    connection.query(getHouseName, function(err, results) {
        if( err ) {
            res.json({
                "code": 400,
                "failed": true,
                "message": "Couldn't make query to get current household from users"
            });
        }
        else {
            const chore = [req.body.choresID, req.body.housemate, req.body.isDone];
            var insertChore = "INSERT INTO " + results[0].houseName + "_chores(chore, housemate, isDone) VALUES(?, ?, ?)";
            connection.query(insertChore, chore, function(err, results){
                if(err) {
                    res.json({
                        "code": 400,
                        "failed": true,
                        "message": "Can't enter the chore" 
                    })
                }
                else{
                    res.json({
                        'code': 200,
                        'failed': false,
                        'message': 'Chores table updated correctly with new chore' 
                    })
                }
            })
        }
    })
})

router.post('/deleteChore', function(req,res){
    var getHouse = 'SELECT houseName from household where uniqueID=' + "\"" + req.user.householdID + "\"" 
    connection.query(getHouse, function(err,results){
        if(err) {
            res.json({
                "code": 400,
                "failed": true,
                "message": err
            })
        }
        else {
            var deleteFromDB = 'DELETE FROM ' + results[0].houseName + '_chores WHERE chore=' + "\"" + req.body.chore + "\"" +"and housemate=" + "\"" + req.body.housemate + "\"" ;
            connection.query(deleteFromDB, function(err, results) {
                if( err ) {
                    res.json({
                        "code": 400,
                        "failed": true,
                        "message": "Could not delete the chore from the table"
                    })
                }
                else {
                    res.json({
                        "code": 200,
                        "message": "Successfully deleted the chore",
                        'task': req.body.chore,
                        'assignee': req.body.housemate,
                        "failed": false
                    })
                }
            })
        }
    })

})
router.post('/markChore', function(req,res){
    var getHouse = 'SELECT houseName from household where uniqueID=' + "\"" + req.user.householdID + "\"" 
    connection.query(getHouse, function(err,results){
        if(err) {
            res.json({
                "code": 400,
                "failed": true,
                "message": err
            })
        }
        else {
            var updateDB = 'UPDATE ' + results[0].houseName + '_chores SET isDone=' + req.body.isDone + ' where chore=' + "\"" + req.body.chore + "\"" +"and housemate=" + "\"" + req.body.housemate + "\"" ;
            console.log(updateDB)
            connection.query(updateDB, function(err, results) {
                if( err ) {
                    res.json({
                        "code": 400,
                        "failed": true,
                        "message": "Could not mark the chore from the table"
                    })
                }
                else {
                    res.json({
                        "code": 200,
                        "message": "Successfully marked chore as done",
                        'task': req.body.chore,
                        'assignee': req.body.housemate,
                        "failed": false
                    })
                }
            })
        }
    })

})

router.get('/bills', function(req,res) {
    var getHouse = 'SELECT houseName from household where uniqueID=' + "\"" + req.user.householdID + "\""
    connection.query(getHouse, function(err,results){
        if(err) {
            res.json({
                "code": 400,
                "failed": true,
                "message": err
            })
        }
        else {
            var getBills = 'SELECT * from ' + results[0].houseName + "_bills";
            connection.query(getBills, function(err,results){
                if(err) {
                    res.json({
                        "code": 400,
                        "failed": true,
                        "message": err
                    })
                }
                else {
                    res.json({
                        'bills': results
                    })
                }
            }) 
        }
    }) 
})

router.post('/bills', function(req,res) {
    var getHouse = 'SELECT houseName from household where uniqueID=' + "\"" + req.user.householdID + "\"" 
    connection.query(getHouse, function(err,results){
        if(err) {
            res.json({
                "code": 400,
                "failed": true,
                "message": err
            })
        }
        else {
            const bills = {
                'name': req.body.name,
                'amount': req.body.amount,
                'dueDate': req.body.dueDate,
                'paid': req.body.paid,
                'housemate': req.body.housemate
            } 
            console.log(bills);
            var insertIntoDB = 'INSERT INTO ' + results[0].houseName + '_bills SET ?';
            connection.query(insertIntoDB, bills, function(err, results, fields) {
                if( err ) {
                    res.json({
                        "code": 400,
                        "failed": true,
                        "message": "Could not add new bill to the table"
                    })
                }
                else {
                    res.json({
                        "code": 200,
                        "message": "Successfully inserted bills",
                        "failed": false
                    })
                }
            })
        }
    })
})

router.get('/housemates', function(req, res) {
    var getHouseName = 'SELECT houseName from household where uniqueID=' + "\"" + req.user.householdID + "\"";
    connection.query(getHouseName, function(err, results) {
        if( err ) {
            res.json({
                "code": 400,
                "failed": true,
                "message": "Couldn't make query to get current household from users"
            });
        }
        else {
            var getHousemates = 'SELECT * from ' + results[0].houseName + "_housemate";
            connection.query(getHousemates, function(err,results){
                if(err) {
                    res.json({
                        "code": 400,
                        "failed": true,
                        "message": "failed to get housemates"
                    })
                }
                else {
                    res.json({
                        "housemates": results,
                    })
                }
            })
        }         
    }) 
})

router.post('/deleteBills', function(req,res) {
    var getHouse = 'SELECT houseName from household where uniqueID=' + "\"" + req.user.householdID + "\"" 
    connection.query(getHouse, function(err,results){
        if(err) {
            res.json({
                "code": 400,
                "failed": true,
                "message": err
            })
        }
        else {
            var deleteFromDB = 'DELETE FROM ' + results[0].houseName + '_bills where name=' + "\"" + req.body.name + "\"" ;
            connection.query(deleteFromDB, function(err, results) {
                if( err ) {
                    res.json({
                        "code": 400,
                        "failed": true,
                
                        "message": "Could not delete the bill from the table"
                    })
                }
                else {
                    res.json({
                        "code": 200,
                        "message": "Successfully deleted the bill",
                        'body': req.body.name,
                        "failed": false
                    })
                }
            })
        }
    })
})

router.get('/parking', function(req, res) {
    var getHouseName = 'SELECT houseName from household where uniqueID=' + "\"" + req.user.householdID + "\"";
    connection.query(getHouseName, function(err, results) {
        if( err ) {
            res.json({
                "code": 400,
                "failed": true,
                "message": "Couldn't make query to get current household from users"
            });
        }
        else{
            var getParkingSpots = 'SELECT * from ' + results[0].houseName + "_parking";
            connection.query(getParkingSpots, function(err, results) {
                if( err ) {
                    res.json({
                        "code": 400,
                        "failed": true,
                        "message": "Can't enter the parking spot" 
                    })
                }
                else{
                    res.json({
                        'code': 200,
                        'failed': false,
                        'message': 'Parking table updated correctly with parking spot' 
                    })
                }
            })
        }
    })
})

router.get('/rules', function(req,res) {
    var getHouse = 'SELECT houseName from household where uniqueID=' + "\"" + req.user.householdID + "\"" 
    connection.query(getHouse, function(err,results){
        if(err) {
            res.json({
                "code": 400,
                "failed": true,
                "message": err
            })
        }
        else {
            var getRules = 'SELECT * from ' + results[0].houseName + "_rules";
            connection.query(getRules, function(err,results){
                if(err) {
                    res.json({
                        "code": 400,
                        "failed": true,
                        "message": err
                    })
                }
                else {
                    res.json({
                        'rules': results
                    })
                }
            }) 
        }
    }) 
})

router.post('/rules', function(req,res) {
    var getHouse = 'SELECT houseName from household where uniqueID=' + "\"" + req.user.householdID + "\"" 
    connection.query(getHouse, function(err,results){
        if(err) {
            res.json({
                "code": 400,
                "failed": true,
                "message": err
            })
        }
        else {
            const rules = {
                'rules': req.body.rules
            } 
            var insertIntoDB = 'INSERT INTO ' + results[0].houseName + '_rules SET ?';
            connection.query(insertIntoDB, rules, function(err, results, fields) {
                if( err ) {
                    res.json({
                        "code": 400,
                        "failed": true,
                        "message": "Couldn't make query to get parking spots"
                    }); 
                }
                else {
                    res.json({
                        "parking": results,
                    })
                    console.log(results);
                }
            })
        }
    })
})

router.post('/parking', function(req, res) {
    var getHouseName = 'SELECT houseName from household where uniqueID=' + "\"" + req.user.householdID + "\"";
    connection.query(getHouseName, function(err, results) {
        if( err ) {
            res.json({
                "code": 400,
                "failed": true,
                "message": "Couldn't make query to get current household from users"
            });
        }
        else {
            const parking = [req.body.parkingID, req.body.housemate];
            var insertParkingSpot = "INSERT INTO " + results[0].houseName + "_parking(parkingSpot, housemate) VALUES(?, ?)";
            connection.query(insertParkingSpot, parking, function(err, results){
                if(err){
                    res.json({
                        "code": 400,
                        "message": "failed to insert parking",
                        "failed": true
                    })
                }
                else {
                    res.json({
                        "code": 200,
                        "message": "Successfully inserted parking",
                        "failed": false
                    })
                }
            })
        }
    }) 
})

router.get('/shopping', function(req,res){
    var getHouse = 'SELECT houseName from household where uniqueID=' + "\"" + req.user.householdID + "\"" 
    connection.query(getHouse, function(err,results){
        if(err) {
            res.json({
                "code": 400,
                "failed": true,
                "message": err
            })
        }
        else {
            var getShopping = 'SELECT * from ' + results[0].houseName + "_shopping";
            connection.query(getShopping, function(err,results){
                if(err) {
                    res.json({
                        "code": 400,
                        "failed": true,
                        "message": err
                    })
                }
                else {
                    res.json({
                        'shopping': results
                    })
                }
            }) 
        }
    }) 
})

router.post('/shopping', function(req,res) {
    var getHouse = 'SELECT houseName from household where uniqueID=' + "\"" + req.user.householdID + "\"" 
    connection.query(getHouse, function(err,results){
        if(err) {
            res.json({
                "code": 400,
                "failed": true,
                "message": err
            })
        }
        else {
            const shoppingList = {
                'shopping': req.body.name
            } 
            var insertIntoDB = 'INSERT INTO ' + results[0].houseName + '_shopping SET ?';
            connection.query(insertIntoDB, shoppingList, function(err, results, fields) {
                if( err ) {
                    res.json({
                        "code": 400,
                        "failed": true,
                        "message": "Could not add new shopping list item to the table"
                    })
                }
                else {
                    res.json({
                        "code": 200,
                        "message": "Successfully inserted shopping list item",
                        "failed": false
                    })
                }
            })
        }
    }) 
})

router.post('/deleteShoppingItem', function(req,res) {
    var getHouse = 'SELECT houseName from household where uniqueID=' + "\"" + req.user.householdID + "\"" 
    connection.query(getHouse, function(err,results){
        if(err) {
            res.json({
                "code": 400,
                "failed": true,
                "message": err
            })
        }
        else {
            var deleteFromDB = 'DELETE FROM ' + results[0].houseName + '_shopping where name=' + "\"" + req.body.item + "\"" ;
            connection.query(deleteFromDB, function(err, results) {
                if( err ) {
                    res.json({
                        "code": 400,
                        "failed": true,
                        "message": "Could not delete the shopping item from the table"
                    })
                }
                else {
                    res.json({
                        "code": 200,
                        "message": "Successfully deleted the shoping item",
                        'body': req.body.item,
                        "failed": false
                    })
                }
            })
        }
    }) 
})

module.exports = router;
