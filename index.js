const express = require('express')
const locationController = require('./locations/locations.controller')
const app = express()
const port = 3000


app.use(locationController)
require('dotenv').config()
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI).then((result)=>{console.log("DB Connected!")}).catch(err => {
	console.log(Error, err.message);})

app.listen(port, async() => {
	console.log(`API listening on port ${port}, visit http://localhost:${port}/`)
})
