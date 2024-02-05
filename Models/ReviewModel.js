const mongoose=require('mongoose')

const Schema=mongoose.Schema(
    {
        uid:String,
        car_no:String,
        overall_rating:String,
        car_review:String,
        general_review:String,
        car_rating:String
    }
)

const ReviewModel=mongoose.model("reviews",Schema)

module.exports={ReviewModel}