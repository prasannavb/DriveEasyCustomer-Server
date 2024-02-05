var nodemailer=require('nodemailer')

 var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'prasannavb04@gmail.com',
      pass: 'szfgyieafqarutex'
    }
  });
  
module.exports={transporter}