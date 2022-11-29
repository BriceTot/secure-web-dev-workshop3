// This file holds the Business-Logic layer, interacting with Data Layer

const Location = require('./locations.model')

async function DeleteByID(ID){
	await Location.findByIdAndDelete(ID);
	return "Done";
}

async function QueryID(ID){
	let loc =await Location.findById(ID);
	return loc;
}

async function QueryAll(){
	let loc =await Location.find({});
	return loc;
}

async function UpdateLocation(req){
	let loc;
	await Location.findByIdAndUpdate(req.params.id, req.body, {new : true}).then(doc=> {loc = doc});
	return loc;
}

async function CreateLocation(req) {
	let loc;
	let new_location = new Location(req.body);
	await new_location.save().then( doc => {loc = doc});
	return loc;
}

module.exports.DeleteByID= DeleteByID
module.exports.QueryID= QueryID
module.exports.QueryAll= QueryAll
module.exports.UpdateLocation= UpdateLocation
module.exports.CreateLocation= CreateLocation

