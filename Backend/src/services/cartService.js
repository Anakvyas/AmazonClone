const prisma = require("../config/prisma")

exports.addToCart = async(userId,productId,quantity)=>{

 return prisma.cart.create({
  data:{
   userId,
   productId,
   quantity
  }
 })

}