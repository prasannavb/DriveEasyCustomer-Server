var nodemailer=require('nodemailer')
require('dotenv').config();

 var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.AUTH_MAIL_USER,
      pass: process.env.AUTH_MAIL_PASS
    }
  });
  
module.exports={transporter}