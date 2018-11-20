let express = require('express');
let app = express();
let mysql = require('mysql');
let router = require('./routes');
let bodyParser = require('body-parser'); 
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var session = require('express-session');

app.use(bodyParser.urlencoded( { extended: false }));  
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

app.use(session({
    secret: 'roomi',
    resave: false,
    saveUninitialized: false
}))
app.use('/', router);

app.listen(3000, '0.0.0.0');