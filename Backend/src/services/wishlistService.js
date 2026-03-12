const prisma = require("../config/prisma")

exports.addWishlist = async(userId,productId)=>{

 return prisma.wishlist.create({
  data:{
   userId,
   productId
  }
 })

}

exports.getWishlist = async(userId)=>{

 return prisma.wishlist.findMany({
  where:{userId},
  include:{product:true}
 })

}