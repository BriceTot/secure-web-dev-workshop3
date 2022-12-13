const router = require('express').Router()
const app=require('express');
router.use(app.json());
const User = require('./users.model');
const {RegisterUser, DeleteByIDUser, QueryAllUser, QueryIDUser, UpdateUser} = require("./users.service");
const passport = require('passport');
const jwt = require('jsonwebtoken');
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const passportJWT = require("passport-jwt");
require('dotenv').config();
const JWTSecretKey = process.env.JWT_SECRET_KEY;
const {checkUser, checkJWT} = require('./../Passport_Strategie/Strat');

passport.use('checkUser', checkUser);
passport.use('checkJWT', checkJWT);

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
        cb(null, { id: user.id, username: user.username });
    });
});

passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
        return cb(null, user);
    });
});


router.get('/users/me', passport.authenticate('checkJWT',
    {failureRedirect : '/403error', failureMessage : true}),  async (req, res) => {
    return res.status(200).send(await QueryIDUser(req.user._id));
})

router.post('/users/register', async(req, res) => {

    if (await User.countDocuments({username : req.body.username}) >= 1 ){
        return res.status(400).send("username already used");
    } else{
        return res.status(200).send(await RegisterUser(req));
    }
})

router.post('/users/login', passport.authenticate('checkUser',
    {failureRedirect : '/403error', failureMessage : true}), async (req, res) => {
    let data = {
        sub:req.user.id
    }
    const token = jwt.sign(data, JWTSecretKey);
    res.status(200).send({token:token});
})

router.delete('/users/me', passport.authenticate('checkJWT',
    {failureRedirect : '/403error', failureMessage : true}), async (req, res) => {
    return res.status(200).send(await DeleteByIDUser(req.user._id));
})

router.patch('/users/me', passport.authenticate('checkJWT',
    {failureRedirect : '/403error', failureMessage : true}), async (req, res) => {
    if (await User.countDocuments({username : req.body.username}) >= 1 ){
        return res.status(400).send("username already used");
    } else{
        return res.status(200).send(await UpdateUser(req));
    }
})

router.get('/users',  async (req, res) => {
    return res.status(200).send(await QueryAllUser());
})

router.get('/404error', async (req, res) => {
    return res.status(404).send();
})

router.get('/403error', async (req, res) => {
    return res.status(403).send();
})

module.exports = router
