const { default: mongoose } = require("mongoose");
const { type } = require("os");

require("mongoose");

const Schema=mongoose.Schema(
    {
        uid:String,
        name:String,
        email:String,
        password:String,
        phone:String,
        location:String,
        gender:String,
        address:String
    }
)

const UserModel=mongoose.model("userDetails",Schema)

module.exports={UserModel}