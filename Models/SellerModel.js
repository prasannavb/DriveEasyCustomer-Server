const { default: mongoose } = require("mongoose");

require("mongoose");

const Schema=mongoose.Schema(
    {
        sid:String,
        name:String,
        email:String,
        password:String,
        phone:String,
        location:String,
        gender:String,
        address:String
    }
)

const SellerModel=mongoose.model("sellerDetails",Schema)

module.exports={SellerModel}