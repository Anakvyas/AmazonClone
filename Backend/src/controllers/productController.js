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

exports.getProductById = async(req,res,next)=>{

 try{

  const product = await productService.getProductById(req.params.id)

  if(!product){
   return res.status(404).json({
    success:false,
    message:"Product not found"
   })
  }

  res.json({
   success:true,
   data:product
  })

 }catch(err){
  next(err)
 }

}
