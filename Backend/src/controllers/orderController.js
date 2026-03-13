const orderService = require("../services/orderService")

exports.createOrder = async(req,res,next)=>{

 try{

  const order = await orderService.createOrder(
    req.userId,
    req.body.items
  )

  res.json({
    success:true,
    data:{
      orderId:order.id
    }
  })

 }catch(err){
  next(err)
 }

}

exports.getOrderHistory = async(req,res,next)=>{

 try{
  const orders = await orderService.getOrderHistory(req.userId, {
    page: req.query.page,
    limit: req.query.limit
  })

  res.json({
    success:true,
    data:orders
  })

 }catch(err){
  next(err)
 }

}
