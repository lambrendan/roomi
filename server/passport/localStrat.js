const LocalStrategy = require('passport-local').Strategy;
const connection = require('../database.js')
const passwordHash = require('password-hash');

const strategy = new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
},
    function( req, username, password, done) {
        const signinInfo = "SELECT username, password from users WHERE username =" + "\"" + username + "\"";
        connection.query(signinInfo, function( err, result) {
            if( err ) {
                return done(err);
            }
            else {
                if( result == undefined || result.length == 0 ) {
                    return done(null, false, { message: 'Incorrect username'} );
                }
                else {
                    const isPassword = passwordHash.verify(password, result[0].password)
                    if( isPassword == true  ) {
                        return done(null, result[0])
                    }
                    else {
                        return done(null, false, { message: 'Incorrect password'} );
                    }
                }
            }
        })
    }
);

module.exports = strategy;