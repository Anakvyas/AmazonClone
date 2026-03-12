const prisma = require("../config/prisma")

exports.addToCart = async(req,res,next)=>{

 try{

  const {productId,quantity} = req.body

  const cart = await prisma.cart.create({
   data:{
    userId:req.userId,
    productId,
    quantity
   }
  })

  res.json({
   success:true,
   data:cart
  })

 }catch(err){
  next(err)
 }

}

exports.getCart = async(req,res,next)=>{

 try{

  const cart = await prisma.cart.findMany({
   where:{userId:req.userId},
   include:{product:true}
  })

  res.json({
   success:true,
   data:cart
  })

 }catch(err){
  next(err)
 }

}

exports.removeFromCart = async(req,res,next)=>{

 try{

  const {id} = req.params

  await prisma.cart.delete({
   where:{id:Number(id)}
  })

  res.json({
   success:true,
   message:"Item removed"
  })

 }catch(err){
  next(err)
 }

}