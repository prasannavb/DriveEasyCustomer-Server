const mongoose=require('mongoose')

const Schema=mongoose.Schema(
    {
        car_no:String,
        description:String
    }
)

const DescriptionModel=mongoose.model("cardescription",Schema)

module.exports={DescriptionModel}

