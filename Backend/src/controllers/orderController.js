const orderService = require("../services/orderService")

exports.createOrder = async(req,res,next)=>{

 try{

  const order = await orderService.createOrder(
    req.userId,
    req.body.items,
    req.user.email
  )

  res.json({
    success:true,
    orderId:order.id
  })

 }catch(err){
  next(err)
 }

}

exports.getOrderHistory = async(req,res,next)=>{

 try{

  const orders = await prisma.order.findMany({
    where:{userId:req.userId},
    include:{items:true}
  })

  res.json({
    success:true,
    data:orders
  })

 }catch(err){
  next(err)
 }

}