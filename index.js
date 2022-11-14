const express = require('express')
const locationController = require('./locations/locations.controller')
const app = express()
const port = 3000


app.use(locationController)

app.listen(port, () => {
	console.log(`API listening on port ${port}, visit http://localhost:${port}/`)
})
