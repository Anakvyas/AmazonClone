const productService = require("../services/productService")

exports.getProducts = async(req,res,next)=>{

 try{

  const {search,category,page,limit} = req.query

  const products = await productService.getProducts({
   search,
   category,
   page,
   limit
  })

  res.json({
   success:true,
   data:products
  })

 }catch(err){
  next(err)
 }

}
