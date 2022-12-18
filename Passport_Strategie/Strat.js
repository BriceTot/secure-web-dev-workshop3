const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const passportJWT = require("passport-jwt");
require('dotenv').config();
const {FindbyUsername, QueryIDUser} = require("./../users/users.service");

const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const JWTSecretKey = process.env.JWT_SECRET_KEY;

//check if the username and its associated password are in the database and return the user document if it is
const checkUser = new LocalStrategy({},
    async function verify(username, password, done) {
        let user = await FindbyUsername(username);
        if (!user) { return done(null, false);}
        if (!bcrypt.compareSync(password, user.password)) { return done(null, false); }
        return done(null, user);
    });

//check if the token corresponds to a user in the database and return a user document if it is
const checkJWT = new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey   : JWTSecretKey
    },
    async function (jwtPayload, cb) {
        let user = await QueryIDUser(jwtPayload.sub);
        if (!user) { return cb(null, false);}
        return cb(null, user);
    }
);

module.exports.checkJWT = checkJWT;
module.exports.checkUser = checkUser;
