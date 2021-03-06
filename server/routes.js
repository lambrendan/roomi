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
    var checkHousehold = 'SELECT householdID from users WHERE username=' + "\"" + req.user.username + "\"";
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
    const uniqueID = crypto.createHash('sha256').update(req.body.uID).digest('hex')
    var checkHouseID = 'SELECT * from household WHERE uniqueID=' + "\"" + uniqueID + "\"";
    connection.query(checkHouseID, function(err, results) {
        if( err ) {
            res.json({ 
                "code": 400,
                "failed": true,
                "message": "Error occured finding this household"
            })
        }
        else {  
            if( results == undefined || results.length === 0 ) {
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
                        console.log(results);
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
                                'reminders': req.body.house+'_reminders'
            
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
                                                                                    var createRemindersTable = "CREATE TABLE " + household.reminders + " (reminders VARCHAR(255))" ;
                                                                                    connection.query(createRemindersTable, function(err, results) {
                                                                                        if( err ) {
                                                                                            res.json({
                                                                                                "code": 400,
                                                                                                "failed": true,
                                                                                                "message": "Couldn't create table reminders "
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
                                                                                                    var insertHousehold = "UPDATE users SET householdID=" + "\""+ uniqueID + "\"" + "WHERE username="+ "\"" + req.user.username + "\"";
                                                                                                    connection.query(insertHousehold, function(err, results) {
                                                                                                        if( err ) {
                                                                                                            res.json({
                                                                                                                "code": 400,
                                                                                                                "failed": true,
                                                                                                                "message": "Couldn't update user table in DB"
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
                        var insertHousehold = "UPDATE users SET householdID=" + "\""+ uniqueID + "\"" + "WHERE username="+ "\"" + req.user.username + "\"";
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
        "username": req.body.username,
        "password": hashedPass
    }
    var lookUpUser = "SELECT * from users WHERE username=" + "\"" + req.body.username + "\"";
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
                    "message": "This username already exists"
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

router.get('/housemates', function(req,res){
    console.log( req.user.householdID);
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
            var getChores = 'SELECT * from ' + results[0].houseName + "_housemate";
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
                        "housemates": results,
                    })
                }
            })
        }
    })
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

router.post('/shuffleChores', function(req, res) {
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
            var updateChoresAssignments = 'UPDATE ' + results[0].houseName + '_chores SET housemate=' + "\"" + req.body.housemate + "\"" + ", isDone=" +req.body.isDone+ " where chore=" + "\"" + req.body.chore + "\"";
            console.log(updateChoresAssignments);
            connection.query(updateChoresAssignments, function(err, results){
                if( err ) {
                    res.json({
                        "code": 400,
                        "failed": true,
                        "message": "Couldn't make query to update chores"
                    });
                }
                else {
                    res.json({
                        "code": 200,
                        "failed": false,
                        "message": "Made query to update chores assginments"
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
router.post('/changePaid', function(req,res) {
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
            var updatePaid  = "UPDATE " + results[0].houseName + "_bills SET paid="+ req.body.paid + " WHERE name="+ "\"" + req.body.name + "\"";
            console.log(updatePaid);
            connection.query(updatePaid, function(err, results) {
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

router.post('/resetPaid', function(req,res) {
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
            var updatePaid  = "UPDATE " + results[0].houseName + "_bills SET paid="+ req.body.paid;
            connection.query(updatePaid, function(err, results) {
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
                        'message': 'Parking table updated correctly with parking spot', 
                        'parking': results,
                    })
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
            const parking = [req.body.parkingSpot, req.body.housemate];
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

router.post('/deleteParking', function(req,res){
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
            var deleteFromDB = 'DELETE FROM ' + results[0].houseName + '_parking WHERE parkingSpot=' + "\"" + req.body.parkingSpot + "\"" +" and housemate=" + "\"" + req.body.housemate + "\"" ;
            console.log(deleteFromDB);
            connection.query(deleteFromDB, function(err, results) {
                if( err ) {
                    res.json({
                        "code": 400,
                        "failed": true,
                        "message": "Could not delete the parking spot from the table"
                    })
                }
                else {
                    res.json({
                        "code": 200,
                        "message": "Successfully deleted the parkingspot",
                        'parkingSpot': req.body.parkingSpot,
                        //'assignee': req.body.housemate,
                        "failed": false
                    })
                }
            })
        }
    })
})

router.post('/shuffleParking', function(req, res) {
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
            var updateParkingAssignments = 'UPDATE ' + results[0].houseName + '_parking SET housemate=' + "\"" + req.body.housemate + "\"" + " where parkingSpot=" + "\"" + req.body.parkingSpot + "\"";
            connection.query(updateParkingAssignments, function(err, results){
                if( err ) {
                    res.json({
                        "code": 400,
                        "failed": true,
                        "message": "Couldn't make query to update parking"
                    });
                }
                else {
                    res.json({
                        "code": 200,
                        "failed": false,
                        "message": "Made query to update parking assginments"
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
            console.log(insertIntoDB);
            connection.query(insertIntoDB, rules, function(err, results, fields) {
                if( err ) {
                    res.json({
                        "code": 400,
                        "failed": true,
                        "message": "Couldn't make query to get parking spots"
                    }); 
                }
                else {
                    console.log('what');
                    res.json({
                        "code": 200,
                        "message": "Successfully inserted rules",
                        "failed": false
                    })
                }
            })
        }
    }) 
})

router.post('/deleteRules', function(req,res) {
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
            var deleteFromDB = 'DELETE FROM ' + results[0].houseName + '_rules where rules=' + "\"" + req.body.rules + "\"" ;
            connection.query(deleteFromDB, function(err, results) {
                if( err ) {
                    res.json({
                        "code": 400,
                        "failed": true,
                        "message": "Could not add new rule to the table"
                    })
                }
                else {
                    res.json({
                        "code": 200,
                        "message": "Successfully deleted the rule",
                        'body': req.body.rules,
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
                'shopping': req.body.shopping
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
            var deleteFromDB = 'DELETE FROM ' + results[0].houseName + '_shopping where shopping=' + "\"" + req.body.shopping + "\"" ;
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
                        'body': req.body.shopping,
                        "failed": false
                    })
                }
            })
        }
    }) 
})

router.get('/reminders', function(req, res){
    var getHouse = 'SELECT houseName from household where uniqueID=' + "\"" + req.user.householdID + "\"";
    connection.query(getHouse, function(err,results){
        if(err) {
            res.json({
                "code": 400,
                "failed": true,
                "message": err
            })
        }
        else{
            var getReminders = "SELECT * from " + results[0].houseName + "_reminders";
            connection.query(getReminders, function(err, results) {
                if( err ) {
                    res.json({
                        "code": 400,
                        "failed": true,
                        "message": "Couldn't update reminders"
                    })
                }
                else {
                    res.json({
                        'code': 200,
                        'failed': false,
                        'currentMsg': results,
                        'message': 'table updated correctly with current reminder' 
                    })
                }
            })
        }
    })
})

router.post('/reminders', function(req, res){
    var getHouse = 'SELECT houseName from household where uniqueID=' + "\"" + req.user.householdID + "\"";
    connection.query(getHouse, function(err,results){
        if(err) {
            res.json({
                "code": 400,
                "failed": true,
                "message": err
            })
        }
        else{
            var updateDB = "UPDATE " + results[0].houseName + "_reminders" + " SET reminders=" + "\""+ req.body.currentMsg + "\"";
            connection.query(updateDB, function(err, results) {
                if( err ) {
                    res.json({
                        "code": 400,
                        "failed": true,
                        "message": "Couldn't update reminders"
                    })
                }
                else {
                    res.json({
                        'code': 200,
                        'failed': false,
                        'message': 'table updated correctly with current reminder' 
                    })
                }
            })
        }
    })
})

router.post('/insertReminders', function(req, res){
    var getHouse = 'SELECT houseName from household where uniqueID=' + "\"" + req.user.householdID + "\"";
    connection.query(getHouse, function(err,results){
        if(err) {
            res.json({
                "code": 400,
                "failed": true,
                "message": err
            })
        }
        else{
            var updateDB = "INSERT INTO " + results[0].houseName + "_reminders" + " SET ?";
            var data = {
                "reminders": req.body.currentMsg,
            }
            connection.query(updateDB, data, function(err, results) {
                if( err ) {
                    res.json({
                        "code": 400,
                        "failed": true,
                        "message": "Couldn't insert into reminders"
                    })
                }
                else {
                    res.json({
                        'code': 200,
                        'failed': false,
                        'message': 'table inserted correctly with current reminder' 
                    })
                }
            })
        }
    })
})

router.get('/housename', function(req, res){
    var getHouse = 'SELECT houseName from household where uniqueID=' + "\"" + req.user.householdID + "\"";
    connection.query(getHouse, function(err,results){
        if(err) {
            res.json({
                "code": 400,
                "failed": true,
                "message": err
            })
        }
        else{
            res.json({
                'code': 200,
                'failed': false,
                'housename': results[0]
            })
        }
    })
})



module.exports = router;
