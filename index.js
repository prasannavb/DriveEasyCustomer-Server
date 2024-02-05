//EXpress and mongo
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');

//Functions
const {ExtendTripCars}=require('./Models/ExtendTripCars')
const {findAvailableCars}=require("./Models/BookAvailableCars");
const { FindListCars } = require('./Models/ListAvailableCars');
const xlsx=require('xlsx')
const {transporter}=require('./Mailer/Mail')

//Models
const { UserModel } = require('./Models/UserModel');
const {CarModel} =require('./Models/CarModel');
const {BookingModel}=require('./Models/BookingModel')
const {CarMetaData}=require("./Models/CarMetaData")
const {ReviewModel}=require('./Models/ReviewModel')
const {PastBookingModel}=require('./Models/PastBookingModel')
const {MissedBookingModel}=require('./Models/MissedBooking')
const {DescriptionModel}=require('./Models/CarDescription')
const {CouponModel}=require('./Models/CouponModel')
const {SellerModel}=require('./Models/SellerModel')

//firebase
const firebase = require('./firebase');
const { getAuth } = require('firebase-admin/auth');
const { async } = require('@firebase/util');
const { start } = require('repl');

//ENV
require('dotenv').config()

const DATABASE_URL=process.env.DATABASE_URL
const app = express();
const auth = getAuth(firebase);
app.use(cors());
app.use(express.json());

    mongoose.connect(DATABASE_URL)
    .then(()=>
    {
        app.listen(8000,()=>{
        console.log("Server connected")
        console.log("Running at 8000")
        })
    }).catch()
    {
        console.log("error") 
    } 


//Create a new user

app.post("/CreateUser",async(req,res)=>
{
  const {name,email,password,phone,location}=req.body
  try
  {
    const userDetails=await UserModel.find({phone})
    if(userDetails.length>0)
    {
      res.send({status:"The phone number you entered is already registered",action:false})
    }
    else
    {
      const acc = await auth.createUser({email,password});
      const uid = acc.uid;
      await UserModel.insertMany({uid:String(uid),name:name.charAt(0).toUpperCase()+name.slice(1),email:email,password:password,phone:phone,location:location.charAt(0).toUpperCase()+location.slice(1),gender:'',address:''})
      res.send({status:"Profile Created Successfully",action:true})  
    }
    }
  catch(err)
  {
    res.send({status:"The email address you provided is already registered",action:false})
  }
})

// Login
 
app.post("/findUser",async(req,res)=>{

    const {uid}=req.body
    try
    {
      const response=await UserModel.findOne({uid}).select({uid:1,location:1})
      res.json(response)
    }
    catch(err)
    {
       console.log("Invalid Email")
    }

})

//ForgotPassword

app.post('/forgotPassword',async(req,res)=>
{
    const {Email,Password}=req.body
    await UserModel.updateOne({email:Email},{$set:{password:Password}})
    res.send({action:true})
})


//CARLIST FETCH

app.get("/findCars",async(req,res)=>
{
    const CarList = await CarModel.find({isverified:true});
    res.send(CarList)
})


//Available List of Cars

app.post("/findAvailableCars",async(req,res)=>
{
    const {uid,start_date,drop_date,status,Fuel,price,Model,Make,location,Type,ratings}=req.body

    var startdate=Number(start_date.split("-")[2]);
    var dropdate=Number(drop_date.split("-")[2]);
    var startmonth=Number(start_date.split("-")[1]);
    var dropmonth=Number(drop_date.split("-")[1])
    var startyear=Number(start_date.split("-")[0])
    var dropyear=Number(drop_date.split("-")[0]) 

    const bookingDetails=await BookingModel.find({})

    var {newdata,bookeddata}=await findAvailableCars(bookingDetails,{startdate,dropdate,startmonth,dropmonth,startyear,dropyear})

    const CarList = await CarModel.find({$and:[{car_no: { $nin: [...bookeddata, ...newdata]} },{isverified:true}]}).select({car_no: 1});

    for (let i = 0; i < CarList.length; i++)    
    {
        if(!newdata.includes(CarList[i].car_no) && !bookeddata.includes(CarList[i].car_no))
        {
            const obj = await FindListCars(newdata, bookeddata, CarList[i], {startdate, dropdate, startmonth, dropmonth, startyear, dropyear}, "RemainingCars");
            newdata=obj.newdata
        }
    }

    if(status==="BookingDetails")
    {
        var ListofCars=await CarModel.find({car_no:newdata})
    } 
    else
    {
        var query = { car_no: { $in: newdata } };

        if (location !== "") {
            query.location = location;
        }
        
        if (Model && Model.length > 0) {
            query.model = { $in: Model }; 
        }
        if(Type && Type.length>0)
        {
            query.type={$in:Type}
        }

        if (Make && Make.length > 0) {
            query.make = { $in: Make };
        } 
        
        if (Fuel && Fuel.length > 0) {
            query.fuel = { $in: Fuel };
        }

        if(price && price.length>0)
        {
                query.price = {
                    $gte: parseInt(price[0], 10),
                    $lte: parseInt(price[1], 10)
                };           
            
        }
        if(ratings)
        {
            query.ratings={
                $gte:parseInt(ratings,10)
            }
        }

        var ListofCars = await CarModel.find(query);
    }

    if(ListofCars.length>0) 
    {
        res.json(ListofCars) 
    }
    else
    {
        if(status==="BookingDetails")
        {
            res.send({
                "status": "We're sorry, but there are no cars available for the selected date.",
                "message": "Please consider the following options:",
                "options": [
                  "Try a different date or time range.",
                  "Check for availability on nearby dates.",
                  "Contact our support team for assistance."
                ]
              }
              )
        }
        else
        {
           res.send({
                "status": "We're sorry, but there are no cars available for the selected date.",
                "message": "Please consider the following options:",
                "options": [ 
                  "Try a different Filters.",
                  "Check for availability on nearby dates.",
                  "Contact our support team for assistance."
                ]
              }
              )
        }
    }
})


//FiltersMetaData

app.get("/FiltersMetaData",async(req,res)=>{

    const FiltersMetaData=await CarMetaData.find({})
    res.send(FiltersMetaData)
})

//SingleCarDetails 
app.post("/findsinglecar",async(req,res)=>{

    const {car_no}=req.body;
    const cardetails= await CarModel.findOne({car_no})
    res.send(cardetails)
})
 

//FindReviews

app.post("/findReviews",async(req,res)=>
{
    const {car_no}=req.body
    ReviewModel.aggregate([
        {
            $match:{
                car_no:car_no
            }
        },
        {
            $lookup:{
                from:'userdetails',
                localField:"uid",
                foreignField:"uid",
                as:"userdetails"
            }
        },
        {
            $unwind:'$userdetails'
        },
        {
            $project:{
                _id:1,
                name: '$userdetails.name', 
                car_rating:1,
                car_review:1
            }
        },
        {
            $sort:{
                car_rating:-1
            }
        }
    ])
    .then((result)=>res.send(result))
    .catch((err)=>{
        console.log(err)
     })
    
})

//ActiveBookings

app.post("/ActiveBookings",async(req,res)=>{

    const {uid}=req.body;

BookingModel.aggregate([
  {
    $match: {
          uid: uid
  }
},
  {
    $lookup: {
      from: 'sellerdetails',
      localField: 'sid',
      foreignField: 'sid',
      as: 'sellerdetails',
    },
  },

  {
        $lookup: {
            from: "cardetails",
            localField: "car_no",
            foreignField: "car_no",
            as: "cardetails"
        }
},
{
    $unwind: "$cardetails"
},
{
    $unwind: "$sellerdetails",
  },
  {
    $project: {
      _id: 1,
      'bookingDetails.uid': '$$ROOT.uid',
      'bookingDetails.car_no': '$$ROOT.car_no',
      'bookingDetails.sid': '$$ROOT.sid',
      'bookingDetails.start_date': '$$ROOT.start_date',
      'bookingDetails.drop_date': '$$ROOT.drop_date',
      'bookingDetails.amount': '$$ROOT.amount',
      'sellerdetails.name': 1,
      'sellerdetails.phone': 1,
      'cardetails.name':1,
      'cardetails.img':1,
      'cardetails.fuel':1,
      'cardetails.make':1,
      'cardetails.model':1,
      'cardetails.type':1,
      'cardetails.location':1,
      'cardetails.year':1,
      'cardetails.price':1,


    },
  },
])
  .then((result) => {
      res.send(result)
  })
  .catch((error) => {
    console.error(error);
  });

})  


//PastBookings 

app.post("/PastBookings",async(req,res)=>{

const {uid}=req.body

PastBookingModel.aggregate([
  {
      $match:{
          uid:uid
      }
  },
  {
    $lookup: {
      from: 'sellerdetails',
      localField: 'sid',
      foreignField: 'sid',
      as: 'sellerdetails',
    },
  },

  {
        $lookup: {
            from: "cardetails",
            localField: "car_no",
            foreignField: "car_no",
            as: "cardetails"
        }
},
{
    $unwind: "$cardetails"
},
{
    $unwind: "$sellerdetails",
  },
  {
      $project:{
          _id:1,
          'bookingDetails.sid': '$$ROOT.sid',
          'bookingDetails.car_no': '$$ROOT.car_no',
          'bookingDetails.uid': '$$ROOT.uid',
          'bookingDetails.start_date': '$$ROOT.start_date',
          'bookingDetails.drop_date': '$$ROOT.drop_date',
          'bookingDetails.amount': '$$ROOT.amount',
          'sellerdetails.name': 1,
          'sellerdetails.phone': 1,
          'cardetails.name':1,
          'cardetails.img':1,
          'cardetails.fuel':1,
          'cardetails.make':1,
          'cardetails.model':1,
          'cardetails.type':1,
          'cardetails.location':1,
          'cardetails.year':1,
          'cardetails.price':1,
      }
  }

])
.then(result => {
  res.send(result)
})
.catch(error => {
  res.send({status:"Error"})
});
})

//ENDTRIP

app.post("/EndTrip",async(req,res)=>{

    const {car_no,start_date,drop_date,uid}=req.body
    const bookingDetails=await BookingModel.findOne({car_no:car_no,start_date:start_date,drop_date:drop_date,uid:uid})
    await PastBookingModel.insertMany({sid:bookingDetails.sid,car_no:bookingDetails.car_no,uid:bookingDetails.uid,start_date:bookingDetails.start_date,drop_date:bookingDetails.drop_date,amount:bookingDetails.amount})
    await BookingModel.deleteOne({car_no:car_no,start_date:start_date,drop_date:drop_date,uid:uid})

    const {email}=await UserModel.findOne({uid:uid}).select({email:1})

    var mailOptions = {
        from: 'prasannavb04@gmail.com',
        to: email,
        subject: 'Thank You for Choosing Us!',
        html: `
          <div>
            <h1>Dear Customer,</h1>
            <p>We hope you had a fantastic journey with Us. Thank you for choosing us for your recent trip. Your satisfaction is our top priority, and we appreciate the trust you've placed in us.</p>
            
            <p>Your feedback is valuable to us, so if you have a moment, please share your thoughts about your experience. We are always looking for ways to enhance our services and ensure your future journeys are even more enjoyable.</p>

            <p>We look forward to serving you again and providing you with the same excellent service on your next adventure.</p>
            
            <p>Safe travels!</p>
            
            <p>Best regards,<br>
            DriveEasy<br>
            prasannavb04@gmail.com<br>
          </div>
        `,
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    });

    res.send({action:true})
})

//CANCELTRIP

app.post("/CancelTrip",async(req,res)=>
{
    const {singlecar,Reason}=req.body
    await BookingModel.deleteOne({car_no:singlecar.car_no,start_date:singlecar.start_date,drop_date:singlecar.drop_date,uid:singlecar.uid})
    const sellerdetails=await SellerModel.findOne({sid:singlecar.sid}).select({email:1,name:1})
    const cardetails=await CarModel.findOne({car_no:singlecar.car_no}).select({name:1,make:1})

    var mailOptions = {
        from: 'prasannavb04@gmail.com',
        to: sellerdetails.email,
        subject: 'Booking Cancellation Notification',
        html: `
        <div class="container">
        <p>Dear ${sellerdetails.name},</p>

    <p>We wanted to inform you that a booking for the car you hosted has been canceled by the user. Here are the details:</p>

    <table border>
    <tr>
        <th>Car Number</th>
        <th>Car </th>
        <th>Reason</th>
    </tr> 
    <tr>
        <td>${singlecar.car_no}</td>
        <td>${cardetails.make} ${cardetails.name} </td>
        <td>${Reason}</td>
        </tr>
    </table>

    <p>The user has canceled their reservation, and we wanted to keep you informed. If you have any questions or concerns, please don't hesitate to contact our support team.</p>

    <p>We appreciate your cooperation and understanding.</p>

    <p>Best regards,<br>
    DriveEasy<br>
prasannavb04@gmail.com<br>
  </div>
        `,
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    });

    res.send({action:true})
})

//ExtendTrip

app.put("/ExtendTrip",async(req,res)=>
{
    const {singlecar}=req.body
    
    var startdate=Number(singlecar.start_date.split("-")[2]);
    var dropdate=Number(singlecar.drop_date.split("-")[2]);
    var startmonth=Number(singlecar.start_date.split("-")[1]);
    var dropmonth=Number(singlecar.drop_date.split("-")[1])
    var startyear=Number(singlecar.start_date.split("-")[0])
    var dropyear=Number(singlecar.drop_date.split("-")[0]) 

    await BookingModel.updateOne({car_no:singlecar.car_no,start_date:singlecar.start_date,uid:singlecar.uid},{$set:{drop_date:singlecar.drop_date,amount:singlecar.amount}})

    const bookingDetails=await BookingModel.find({car_no:singlecar.car_no})

    const bookeddata=await ExtendTripCars(bookingDetails,{startdate,dropdate,startmonth,dropmonth,startyear,dropyear},singlecar.uid)
    if(bookeddata.length>0)
    {
        await MissedBookingModel.insertMany({sid:bookeddata[0].sid,car_no:bookeddata[0].car_no,uid:bookeddata[0].uid,start_date:bookeddata[0].start_date,drop_date:bookeddata[0].drop_date})
        await BookingModel.deleteOne({sid:bookeddata[0].sid,car_no:bookeddata[0].car_no,uid:bookeddata[0].uid,start_date:bookeddata[0].start_date,drop_date:bookeddata[0].drop_date})
    }
    res.send({action:true})
    
})

//Reviews

app.post('/Reviews',async(req,res)=>
{
    const {car_no,uid,car_review,overall_rating,general_review,ratings}=req.body

    await ReviewModel.insertMany({uid:uid,car_no:car_no,overall_rating:overall_rating,car_review:car_review,general_review:general_review,car_rating:ratings})

    const oldrating=await CarModel.findOne({car_no}).select({_id:0,ratings:1})
    if(oldrating.ratings==="0")
    {
        var newratings=ratings
    }   
    else
    {
        var newratings=(Number(oldrating.ratings)+Number(ratings))/2

    } 
    await CarModel.updateOne({car_no:car_no},{$set:{ratings:String(newratings)}})    

    res.send({action:true})
})

//PAY

app.post("/Pay",async(req,res)=>
{
    const {Card_number,CVV,Biller_name,expiry_date,start_date,drop_date,car_no,amount,uid,sid}=req.body

    var startdate=Number(start_date.split("-")[2]);
    var dropdate=Number(drop_date.split("-")[2]);
    var startmonth=Number(start_date.split("-")[1]);
    var dropmonth=Number(drop_date.split("-")[1])
    var startyear=Number(start_date.split("-")[0])
    var dropyear=Number(drop_date.split("-")[0]) 

    const userdetails=await UserModel.findOne({uid:uid}).select({email:1,name:1,phone:1})
    const cardetails=await CarModel.findOne({car_no:car_no})
    const sellerdetails=await SellerModel.findOne({sid:sid}).select({email:1,address:1,phone:1,name:1})

    var usermailOptions = {
        from: 'prasannavb04@gmail.com',
        to: userdetails.email,
        subject: 'Booking Details',
        html:`
        <div class="container">
        <h1>Your Booking Details</h1>
        
        <table border>
        <tr>
            <th>CarNumber</th>
            <th>Car</th>
            <th>Host</th>
            <th>Address</th>
            <th>Contact No</th>
            <th>Pickup Date & Time</th>
            <th>Return Date & Time</th>
            <th>Total Fair</th>
        </tr>
        <tr>
            <td>${cardetails.car_no}</td>
            <td>${cardetails.make} ${cardetails.name} </td>
            <td>${sellerdetails.name}</td>
            <td>${sellerdetails.phone}</td>
            <td>${sellerdetails.address}</td>
            <td>${startdate}-${startmonth}-${startyear} 00:00 AM</td>
            <td>${dropdate}-${dropmonth}-${dropyear} 00:00 AM</td>
            <td>&#8377;${amount}</td>
            </tr>
        </table>
    
        <p>Thank you for choosing us! We look forward to serving you on your upcoming trip. If you have any questions or need further assistance, feel free to contact us.</p>
        
        <p>Safe travels!</p>
        
        <p>Best regards,<br>
        DriveEasy<br>
        prasannavb04@gmail.com<br>
        `,
    };
    var sellermailOptions = {
        from: 'prasannavb04@gmail.com',
        to: sellerdetails.email,
        subject: 'Booking Details',
        html:`
        <div class="container">
        <h1>Your Booking Details</h1>
        
        <table border>
        <tr>
            <th>CarNumber</th>
            <th>Car</th>
            <th>Customer</th>
            <th>Contact No</th>
            <th>Pickup Date & Time</th>
            <th>Return Date & Time</th>
            <th>Total Fair</th>
        </tr>
        <tr>
            <td>${cardetails.car_no}</td>
            <td>${cardetails.make} ${cardetails.name} </td>
            <td>${userdetails.name}</td>
            <td>${userdetails.phone}</td>
            <td>${startdate}-${startmonth}-${startyear} 00:00 AM</td>
            <td>${dropdate}-${dropmonth}-${dropyear} 00:00 AM</td>
            <td>&#8377;${amount}</td>
            </tr>
        </table>
    
        <p>Thank you for choosing us! We look forward to serving you on your upcoming trip. If you have any questions or need further assistance, feel free to contact us.</p>
        
        <p>Safe travels!</p>
        
        <p>Best regards,<br>
        DriveEasy<br>
        prasannavb04@gmail.com<br>
        `,
    };
 

    const bookingDetails=await BookingModel.find({car_no:car_no})

    var {newdata,bookeddata}=await findAvailableCars(bookingDetails,{startdate,dropdate,startmonth,dropmonth,startyear,dropyear})
    if(bookingDetails.length===0)
    {
        if(newdata.length==0 && bookeddata.length===0)
        {
            await BookingModel.insertMany({sid:sid,uid:uid,car_no:car_no,start_date:start_date,drop_date:drop_date,amount:amount})
                      
              transporter.sendMail(usermailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
              transporter.sendMail(sellermailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });

            res.send({status:"Successfully booked",action:true})
        }
        else
        {
            res.send({status:"sorry booked now",action:false})

        }
    }
    else
    {
        if(!bookeddata.includes(car_no) && newdata.includes(car_no))
        {
            await BookingModel.insertMany({sid:sid,uid:uid,car_no:car_no,start_date:start_date,drop_date:drop_date,amount:amount})
                      
              transporter.sendMail(usermailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });

              transporter.sendMail(sellermailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });

            res.send({status:"Successfully booked",action:true})

        }
        else
        {
            res.send({status:"sorry booked now",action:false})

        }
   }
})

//Count

app.get("/Counts",async(req,res)=>
{
        var usercount=await UserModel.count()
        var hostcount=await SellerModel.count()
        var carcount=await CarModel.count()
        var Activebookingcount=await BookingModel.count();
        var Pastbookingscount=await PastBookingModel.count();
        Activebookingcount=Activebookingcount+Pastbookingscount

        res.send({usercount,hostcount,carcount,Activebookingcount}) 
})

//Description of Car

app.post('/findDescription',async(req,res)=>
{
    const {car_no}=req.body;
    const Description=await DescriptionModel.findOne({car_no:car_no })
    res.send(Description)
})

//findBookingsCount

app.post('/findBookingsCount',async(req,res)=>{

    const {uid}=req.body
    var pastcnt=await PastBookingModel.find({uid:uid});
    var Activebookingcount=await BookingModel.find({uid}).count()
    res.send({pastcnt,Activebookingcount})

})


//File
app.get('/getFile', async (req, res) => {
    try {
      const url = 'https://firebasestorage.googleapis.com/v0/b/car-rental-9b4a5.appspot.com/o/MapLocation%2Fmaps.xlsx?alt=media&token=a38a5cf8-9e8d-4523-a333-6d7a0239de75';
      const response = await fetch(url);
      const data = await response.arrayBuffer();

      const workbook = xlsx.read(new Uint8Array(data), { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = xlsx.utils.sheet_to_json(sheet);      
      res.send(parsedData);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  //findUserProfile

  app.post('/findUserProfile',async(req,res)=>{
    const {uid}=req.body

    const ProfileDetails=await UserModel.findOne({uid})
    res.send(ProfileDetails)
  })

  //UpdateProfileDetails

  app.post('/UpdateProfileDetails',async(req,res)=>
  {
    const {uid,name,gender,email,phone,location,address}=req.body
    if(gender==='' && address==='')
    {
        await UserModel.updateOne({uid:uid},{$set:{
            location:location,
            phone:phone
        }})

    }
    else if(address==='')
    {
        await UserModel.updateOne({uid:uid},{$set:{
            location:location,
            phone:phone,
            gender:gender
        }})

    }
    else if(gender==='')
    {
        await UserModel.updateOne({uid:uid},{$set:{
        location:location,
        phone:phone,
        address:address
    }})
        
    }
    else  
    {await UserModel.updateOne({uid:uid},{$set:{
        location:location,
        phone:phone,
        gender:gender,
        address:address
    }}) 
}

    res.send({action:true})

})

//ApplyCoupon

app.post('/ApplyCoupon',async(req,res)=>
{
    const {amount,CouponCode}=req.body

    const result=await CouponModel.findOne({code:CouponCode})

        if(result)
        {
            let newamount=(amount)-(amount*(Number(result.Discount)/100))
            await CouponModel.deleteOne({code:CouponCode})  
            res.send({newamount,status:"Coupon Code Applied Succesfully",action:true})
        }
        else
        {
            res.send({status:"Invalid Coupon Code",action:false})
        }

})

//UserName
app.post('/findusername',async(req,res)=>{
    const {uid}=req.body

    const uname=await UserModel.findOne({uid:uid}).select({name:1})
    res.send(uname)
})

//username and Email
app.post('/FindNameandEmail',async(req,res)=>{
    const {uid}=req.body

    const detail=await UserModel.findOne({uid:uid}).select({name:1,email:1})
    res.send(detail)
})

//Contact us

app.post('/ContactUs',async(req,res)=>
{   
    const {uid,Message}=req.body
    const {email}=await UserModel.findOne({uid:uid}).select({email:1})
  
    var mailOptions = {
        from: email,
        to:'prasannavb04@gmail.com' ,
        subject: 'Priority Support Request',
        text:Message
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

    res.send({action:true})
})
