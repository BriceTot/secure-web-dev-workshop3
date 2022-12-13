const LocalStrategy = require('passport-local');
const User = require('./../users/users.model');
const bcrypt = require('bcrypt');
const passportJWT = require("passport-jwt");
const passport = require("passport");
require('dotenv').config();

const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const JWTSecretKey = process.env.JWT_SECRET_KEY;


const checkUser = new LocalStrategy({},
    function verify(username, password, done) {
        User.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            if (!bcrypt.compareSync(password, user.password)) { return done(null, false); }
            return done(null, user);
        });
    });

const checkJWT = new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey   : JWTSecretKey
    },
    function (jwtPayload, cb) {
        return User.findById(jwtPayload.sub)
            .then(user => {
                return cb(null, user);
            })
            .catch(err => {
                return cb(err);
            });
    }
);

module.exports.checkJWT = checkJWT;
module.exports.checkUser = checkUser;

