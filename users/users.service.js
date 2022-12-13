const User = require('./users.model');
const bcrypt = require('bcrypt');
const Location = require("../locations/locations.model");

async function RegisterUser(req){
    await bcrypt.hash(req.body.password, 10, async function(err, hash){
        let new_user = new User({username : req.body.username, password : hash});
        await new_user.save();
    });
    return "done";
}

async function DeleteByIDUser(ID){
    await User.findByIdAndDelete(ID);
    return "Done";
}

async function QueryIDUser(ID){
    let loc =await User.findById(ID);
    return loc;
}

async function QueryAllUser(){
    let loc =await User.find({}).select('username');
    return loc;
}

async function UpdateUser(req){
    let loc;
    if(Object.keys(req.body).includes("password")){
        bcrypt.hash(req.body.password, 10, async function(err, hash){
            req.body.password=hash;
            console.log(req.body);
            await User.findByIdAndUpdate(req.user.id, req.body, {new : true}).then(doc=> {loc = doc});
        })
        return loc;
    }
    else
    {
        await User.findByIdAndUpdate(req.user.id, req.body, {new : true}).then(doc=> {loc = doc});
        return loc;
    }

}

module.exports.RegisterUser= RegisterUser;
module.exports.DeleteByIDUser= DeleteByIDUser;
module.exports.QueryIDUser= QueryIDUser;
module.exports.QueryAllUser= QueryAllUser;
module.exports.UpdateUser= UpdateUser;
