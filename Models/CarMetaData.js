const {mongoose}=require('mongoose')

const Schema=mongoose.Schema({
    Fuel:Array,
    Model:Array,
    Make:Array
})

const CarMetaData=mongoose.model("carmetadatas",Schema)

module.exports={CarMetaData}  