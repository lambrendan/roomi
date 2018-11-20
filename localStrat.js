const LocalStrategy = require('passport-local').Strategy;

const strategy = new LocalStrategy( function( username, password, done) {
    const signinInfo = "SELECT password from users WHERE email =" + "\"" + username + "\"";
    connection.query(signinInfo, function( err, result) {
        if( err ) {
            return done(err);
        }
        else {
            if( result == undefined || result.length == 0 ) {
                return done(null, false, { message: 'Incorrect email'} );
            }
            else {
                const isPassword = passwordHash.verify(password, result[0].password)
                const user = {
                    userName: username,
                    password: result[0].password
                }
                if( isPassword == true  ) {
                    return done(null, user)
                }
                else {
                    return done(null, false, { message: 'Incorrect password'} );
                }
            }
        }
    })
})

module.exports = strategy;