const prisma = require("../config/prisma")
const redis = require("../config/redis")

exports.getProducts = async({search,category,page=1,limit=10})=>{

 const cacheKey = `products:${search}:${category}:${page}`

 const cached = await redis.get(cacheKey)

 if(cached){
  return JSON.parse(cached)
 }

 const products = await prisma.product.findMany({

  where:{
   name:{
    contains:search || "",
    mode:"insensitive"
   },
   category:{
    name:category || undefined
   }
  },

  include:{
   category:true
  },

  skip:(page-1)*limit,
  take:limit

 })

 await redis.setEx(cacheKey,60,JSON.stringify(products))

 return products

}