const router = require('express').Router()
const app=require('express');
router.use(app.json());
const {RegisterUser, DeleteByIDUser, QueryAllUser, QueryIDUser,
    UpdateUser, VerifyAlreadyTakenUsername} = require("./users.service");
const passport = require('passport');
const jwt = require('jsonwebtoken');
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

//user get the informations stored in the database about him
router.get('/users/me', passport.authenticate('checkJWT',
    {failureRedirect : '/403error', failureMessage : true}),  async (req, res) => {
    return res.status(200).send(await QueryIDUser(req.user._id));
})

//a new user register to the database (need a username not taken)
router.post('/users/register', async(req, res) => {

    if (await VerifyAlreadyTakenUsername(req.body.username)){
        return res.status(400).send("username already used");
    } else{
        return res.status(200).send(await RegisterUser(req));
    }
})

//a user login with his username and password
router.post('/users/login', passport.authenticate('checkUser',
    {failureRedirect : '/403error', failureMessage : true}), async (req, res) => {
    let data = {
        sub:req.user.id
    }
    const token = jwt.sign(data, JWTSecretKey);
    res.status(200).send({token:token});
})

//a user delete himself from the database
router.delete('/users/me', passport.authenticate('checkJWT',
    {failureRedirect : '/403error', failureMessage : true}), async (req, res) => {
    return res.status(200).send(await DeleteByIDUser(req.user._id));
})

//a user modify himself (can't change his role nor have a username already taken)
router.patch('/users/me', passport.authenticate('checkJWT',
    {failureRedirect : '/403error', failureMessage : true}), async (req, res) => {
    if (await VerifyAlreadyTakenUsername(req.body.username)){
        return res.status(400).send("username already used");
    }
    else{
        if(Object.keys(req.body).includes("role")) {
            return res.status(400).send("You can't change your role")
        }
        else{
            return res.status(200).send(await UpdateUser(req));
        }
    }
})

//get information about all users in the database (except their password)
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
