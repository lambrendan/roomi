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


connection.connect(function(err) {
    if( err ) {
        throw err;
    }
    else {
        console.log("Connected!");
        var sql = "CREATE TABLE IF NOT EXISTS users (firstName VARCHAR(255), lastName VARCHAR(255), email VARCHAR(255), password VARCHAR(255) )";
        connection.query(sql, function(err, result) {
            if( err ) {
                console.log(err);
            }
            else {
                console.log("Table Done");
            }
        })
    }
})
const sessionStore = new MySQLStore({}, connection);

app.use(bodyParser.urlencoded( { extended: false }));  
app.use(bodyParser.json());

app.use(session({
    secret: 'roomi',
    store: sessionStore,
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

app.listen(3000, '0.0.0.0');