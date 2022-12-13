// This file is used to map API calls (Presentation Layer) with the
// Business-Logic layer

const router = require('express').Router()
const locationsService = require('./locations.service')
const app=require('express');
router.use(app.json());
const {QueryAll, QueryID, DeleteByID, CreateLocation, UpdateLocation} = require("./locations.service");
const passport = require("passport");

router.get('/locations',  passport.authenticate('checkJWT',
	{failureRedirect : '/404error', failureMessage : true}), async (req, res) => {
	return res.status(200).send(await QueryAll());

})

router.get('/locations/:id', passport.authenticate('checkJWT',
	{failureRedirect : '/404error', failureMessage : true}), async(req, res) => {
	return res.status(200).send(await QueryID(req.params.id))
})

router.get('/', (req, res) =>
	{return res.status(200).send('Hello World')} )

router.delete('/locations/:id', passport.authenticate('checkJWT',
	{failureRedirect : '/404error', failureMessage : true}), async (req, res) => {
	return res.status(200).send(await DeleteByID(req.params.id))
})

router.post('/locations', passport.authenticate('checkJWT',
	{failureRedirect : '/404error', failureMessage : true}), async (req, res) => {
	console.log(req.body);
	return res.status(200).send(await CreateLocation(req))
})

router.patch('/locations/:id', passport.authenticate('checkJWT',
	{failureRedirect : '/404error', failureMessage : true}), async (req, res) => {
	return res.status(200).send(await UpdateLocation(req))
})


module.exports = router
