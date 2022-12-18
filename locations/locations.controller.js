// This file is used to map API calls (Presentation Layer) with the
// Business-Logic layer

const router = require('express').Router()
const app=require('express');
router.use(app.json());
const {QueryAll, QueryID, DeleteByID, CreateLocation, UpdateLocation} = require("./locations.service");
const passport = require("passport");

//check if the user has a determined role to do some actions
function roleMiddleware (allowedRoles) {
	return function (req, res, next) {
		if (allowedRoles.includes(req.user?.role)) {
			return next()
		}
		return res.status(403).send("you have not the right to do this action");
	}
}

//get all locations
router.get('/locations',  passport.authenticate('checkJWT',
	{failureRedirect : '/404error', failureMessage : true}), async (req, res) => {
	return res.status(200).send(await QueryAll());

})

//get the location by its id
router.get('/locations/:id', passport.authenticate('checkJWT',
	{failureRedirect : '/404error', failureMessage : true}), async(req, res) => {
	return res.status(200).send(await QueryID(req.params.id))
})

router.get('/', (req, res) =>
	{return res.status(200).send('Hello World')} )

//delete a location
router.delete('/locations/:id', passport.authenticate('checkJWT',
	{failureRedirect : '/404error', failureMessage : true}), roleMiddleware(['admin']),
	async (req, res) => {
	return res.status(200).send(await DeleteByID(req.params.id))
})

//post a location
router.post('/locations', passport.authenticate('checkJWT',
	{failureRedirect : '/404error', failureMessage : true}), roleMiddleware(['admin']),
	async (req, res) => {
	console.log(req.body);
	return res.status(200).send(await CreateLocation(req))
})

//update a location
router.patch('/locations/:id', passport.authenticate('checkJWT',
	{failureRedirect : '/404error', failureMessage : true}), roleMiddleware(['admin']),
	async (req, res) => {
	console.log(req.id);
	return res.status(200).send(await UpdateLocation(req))
})


module.exports = router
