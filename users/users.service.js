const User = require('./users.model');
const bcrypt = require('bcrypt');


//register a user and hash his password for the database
async function RegisterUser(req){
    await bcrypt.hash(req.body.password, 10, async function(err, hash){
        let new_user = new User({username : req.body.username, password : hash, role : req.body.role});
        await new_user.save();
    });
    return "done";
}


async function DeleteByIDUser(ID){
    await User.findByIdAndDelete(ID);
    return "Done";
}

async function QueryIDUser(ID){
    let user =await User.findById(ID);
    return user;
}

async function QueryAllUser(){
    let user =await User.find({}).select(['username','role']);
    return user;
}

//update a user and hash his new password if he changed the previous one
async function UpdateUser(req) {
    let user;
    if (Object.keys(req.body).includes("password")) {
        bcrypt.hash(req.body.password, 10, async function (err, hash) {
            req.body.password = hash;
            await User.findByIdAndUpdate(req.user.id, req.body, {new: true}).then(doc => {
                user = doc
            });
        })
        return user;
    } else {
        await User.findByIdAndUpdate(req.user.id, req.body, {new: true}).then(doc => {
            user = doc
        });
        return user;
    }
}

async function FindbyUsername(searchedUsername){
            let user =await User.findOne({username : searchedUsername});
            return user;
}

//verify if the username that a user give or want to change is already taken by another one
async function VerifyAlreadyTakenUsername(username){
    let takenUsername = await User.countDocuments({username : username}) >= 1;
    return takenUsername;
}



module.exports.RegisterUser= RegisterUser;
module.exports.DeleteByIDUser= DeleteByIDUser;
module.exports.QueryIDUser= QueryIDUser;
module.exports.QueryAllUser= QueryAllUser;
module.exports.UpdateUser= UpdateUser;
module.exports.FindbyUsername= FindbyUsername;
module.exports.VerifyAlreadyTakenUsername= VerifyAlreadyTakenUsername;
