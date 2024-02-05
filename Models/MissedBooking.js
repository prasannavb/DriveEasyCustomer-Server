const mongoose=require('mongoose')

const Schema=mongoose.Schema(
    {
        sid:String,
        car_no:String,
        uid:String,
        start_date:String,
        drop_date:String,
        amount:String
    }
)
const MissedBookingModel=mongoose.model("MissedBookings",Schema);
module.exports={MissedBookingModel}