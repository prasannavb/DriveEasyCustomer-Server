const mongoose=require('mongoose')

const Schema=mongoose.Schema(
    {
        sid:String,
        car_no:String,
        img:String,
        name:String,
        year:String,
        fuel:String,
        make:String,
        model:String,
        // seats:String,
        price:String,
        ratings:String,
        location:String,
        list_start:String,
        list_drop:String,
        isverified:Boolean
    }
)

const CarModel=mongoose.model("cardetails",Schema)

module.exports={CarModel}