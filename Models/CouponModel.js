const mongoose=require('mongoose')

const schema=mongoose.Schema(
    {
        code:String,
        Discount:String,
    }
)

const CouponModel=mongoose.model('couponcodes',schema)

module.exports={CouponModel}