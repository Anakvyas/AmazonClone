const wishlistService = require("../services/wishlistService")

exports.addWishlist = async(req,res,next)=>{

 try{

  const {productId} = req.body

  const item = await wishlistService.addWishlist(req.userId,productId)

  res.json({
   success:true,
   data:item
  })

 }catch(err){
  next(err)
 }

}

exports.getWishlist = async(req,res,next)=>{

 try{

  const items = await wishlistService.getWishlist(req.userId)

  res.json({
   success:true,
   data:items
  })

 }catch(err){
  next(err)
 }

}