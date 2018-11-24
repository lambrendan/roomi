const passport = require('passport');
const LocalStrategy = require('./localStrat');
const connection = require('../database.js')


passport.serializeUser((user, done) => {
    console.log('serializeUser called');
    console.log('user');
    done(null, user);

});

passport.deserializeUser((id, done) => {
    console.log('deserialized called');
    var lookUpUser = "SELECT * from users WHERE email=" + "\"" + id.email + "\"";
    connection.query(lookUpUser, function( err, rows) {
        done(err, rows[0])
    })
})

passport.use('local', LocalStrategy);

module.exports = passport;  