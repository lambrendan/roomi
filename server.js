let express = require('express');
let app = express();
let mysql = require('mysql');
let router = express.Router();
let bodyParser = require('body-parser'); 
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var session = require('express-session');


app.use(bodyParser.urlencoded( { extended: false }));  
app.use(bodyParser.json());

app.use('/', router);

const connection = mysql.createConnection({
    host:"localhost",
    user: "root",
    password: "roomicse110"
});

connection.connect(function(err) {
    if( err ) {
        throw err;
    }
    else {
        console.log("Connected!");
    }
})

router.get('/', function(req, res) {
    res.send( "hi");
});

app.listen(3000, '0.0.0.0');