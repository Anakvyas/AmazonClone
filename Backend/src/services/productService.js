const prisma = require("../config/prisma")
const { client: redis, isRedisReady } = require("../config/redis")

exports.getProducts = async ({ search, category, page = 1, limit = 10 }) => {

  const cacheKey = `products:${search}:${category}:${page}`

  if (isRedisReady()) {
    try {
      const cached = await redis.get(cacheKey)

      if (cached) {
        return JSON.parse(cached)
      }
    } catch (err) {
      console.warn("Redis read failed, skipping cache:", err.message)
    }
  }

  const products = await prisma.product.findMany({
    where: {
      name: {
        contains: search || "",
        mode: "insensitive"
      },
      category: category
        ? {
            is: {
              name: category
            }
          }
        : undefined
    },

    include: {
      category: true,
      images:true
    },

    skip: (page - 1) * limit,
    take: limit
  })

  if (isRedisReady()) {
    try {
      await redis.setEx(cacheKey, 60, JSON.stringify(products))
    } catch (err) {
      console.warn("Redis write failed, skipping cache:", err.message)
    }
  }

  return products
}
