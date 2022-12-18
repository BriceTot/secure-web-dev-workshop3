const express = require('express')
const app = express()
const port = 3000
const session =require('express-session');
const passport = require("passport");
const path = require("path");
const locationController = require('./locations/locations.controller')
const userController = require('./users/users.controller')


app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(locationController)
app.use(userController)

require('dotenv').config()
const mongoose = require('mongoose');

//connect to the database
mongoose.connect(process.env.MONGO_URI).then((result)=>{console.log("DB Connected!")}).catch(err => {
	console.log(Error, err.message);})


app.listen(port, async() => {
	console.log(`API listening on port ${port}, visit http://localhost:${port}/`)
})
