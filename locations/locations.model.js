const mongoose = require('mongoose')

const filmSchema = new mongoose.Schema({
	filmType: String,
	filmProducerName: String,
	endDate: Date,
	filmName: String,
	district: Number,
	geolocation: {
		coordinates: [Number],
		type: String,
	},
	sourceLocationId: String,
	filmDirectorName: String,
	address: String,
	startDate: Date,
	year: Number,
}, { typeKey: '$type' }
)

const Location = mongoose.model('Location', filmSchema)

module.exports = Location
