const prisma = require("../config/prisma")
const mailer = require("../config/mailer")

exports.createOrder = async(userId,items,email)=>{

 let total = 0

 const orderItems = items.map(i=>{
  total += i.price * i.quantity
  return {
   productId:i.productId,
   quantity:i.quantity,
   price:i.price
  }
 })

 const order = await prisma.$transaction(async(tx)=>{

  const createdOrder = await tx.order.create({
   data:{
    userId,
    totalPrice:total,
    items:{
     create:orderItems
    }
   }
  })

  for(const item of items){

   await tx.product.update({
    where:{id:item.productId},
    data:{
     stock:{
      decrement:item.quantity
     }
    }
   })

  }

  return createdOrder

 })

 await mailer.sendOrderEmail(email,order.id)

 return order

}