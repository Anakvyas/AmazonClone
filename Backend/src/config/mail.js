const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
 service:"gmail",
 auth:{
  user:process.env.EMAIL_USER,
  pass:process.env.EMAIL_PASS
 }
})

exports.sendOrderEmail = async(email,orderId)=>{

 await transporter.sendMail({
  from:"store@example.com",
  to:email,
  subject:"Order Confirmation",
  text:`Your order ${orderId} has been placed successfully`
 })

}
