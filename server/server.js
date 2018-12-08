let express = require('express');
let app = express();
let mysql = require('mysql');
let router = require('./routes');
let bodyParser = require('body-parser'); 
var passport = require('./passport');
var localStrategy = require('passport-local').Strategy;
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
const connection = require('./database.js');

const preConnection = mysql.createConnection({
    host:"localhost",
    user: "root",
    password: "roomicse110",
});

preConnection.connect(function(err) {
    if( err ) {
        throw err;
    }
    else {
        preConnection.query("CREATE DATABASE IF NOT EXISTS roomiDB", function( err, result) {
            if(err) {
                console.log(err)
            }
            else {
                console.log("DB Initialized")
                preConnection.query('USE roomiDB', function(err, result){
                    if ( err) {
                        throw err;
                    }
                    else {
                        var userTable= "CREATE TABLE IF NOT EXISTS users (firstName VARCHAR(255), lastName VARCHAR(255), username VARCHAR(255), password VARCHAR(255), householdID VARCHAR(255) )";
                        preConnection.query(userTable, function(err, result) {
                            if( err ) {
                                console.log(err);
                            }
                            else {
                                console.log("Users Table Initialized");
                            }
                        })
                        var household = "CREATE TABLE IF NOT EXISTS household (uniqueID VARCHAR(255), houseName VARCHAR(255), housemate VARCHAR(255), bills VARCHAR(255), parking VARCHAR(255), rules VARCHAR(255), chores VARCHAR(255), shopping VARCHAR(255), reminders VARCHAR(255))";
                        preConnection.query(household, function(err, result) {
                            if( err ) {
                                console.log(err);
                            }
                            else {
                                console.log("Household Initialized");
                            }
                        })
                    }
                })
                
            }
        })
    }
})
//preConnection.end();
// connection.connect(function(err) {
//     if( err ) {
//         throw err;
//     }
//     else {
//         connection.query("CREATE DATABASE IF NOT EXISTS roomiDB", function( err, result) {
//             if( err ){
//                 console.log(error)
//             }
//             else {
//                 console.log( "DB Initialized")
//             }
//         })
//         console.log("Connected!");
        // var userTable= "CREATE TABLE IF NOT EXISTS users (firstName VARCHAR(255), lastName VARCHAR(255), username VARCHAR(255), password VARCHAR(255), householdID VARCHAR(255) )";
        // connection.query(userTable, function(err, result) {
        //     if( err ) {
        //         console.log(err);
        //     }
        //     else {
        //         console.log("Users Table Initialized");
        //     }
        // })
        // var household = "CREATE TABLE IF NOT EXISTS household (uniqueID VARCHAR(255), houseName VARCHAR(255), housemate VARCHAR(255), bills VARCHAR(255), parking VARCHAR(255), rules VARCHAR(255), chores VARCHAR(255), shopping VARCHAR(255), reminders VARCHAR(255))";
        // connection.query(household, function(err, result) {
        //     if( err ) {
        //         console.log(err);
        //     }
        //     else {
        //         console.log("Household Initialized");
        //     }
        // })
//     }
// })
//const sessionStore = new MySQLStore({}, connection);

app.use(bodyParser.urlencoded( { extended: false }));  
app.use(bodyParser.json());

app.use(session({
    secret: 'roomi',
    //store: sessionStore,
    resave: false,
    saveUninitialized: false
}));

app.use( (req, res, next) => {
    console.log('req.session', req.session);
    return next();
});

app.use(passport.initialize());
app.use(passport.session());

app.use('/', router);

app.listen(3001, '0.0.0.0');