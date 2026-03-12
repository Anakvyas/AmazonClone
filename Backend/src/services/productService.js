const prisma = require("../config/prisma")
const { client: redis, isRedisReady } = require("../config/redis")

exports.getProducts = async ({ search, category, page = 1, limit = 10 }) => {
  const normalizedPage = Math.max(Number(page) || 1, 1)
  const normalizedLimit = Math.max(Number(limit) || 10, 1)

  const cacheKey = `products:${search || ""}:${category || ""}:${normalizedPage}:${normalizedLimit}`

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

  const where = {
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
  }

  const [products, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        images: true
      },
      skip: (normalizedPage - 1) * normalizedLimit,
      take: normalizedLimit
    }),
    prisma.product.count({ where })
  ])

  const payload = {
    items: products,
    page: normalizedPage,
    limit: normalizedLimit,
    total,
    hasMore: normalizedPage * normalizedLimit < total
  }

  if (isRedisReady()) {
    try {
      await redis.setEx(cacheKey, 60, JSON.stringify(payload))
    } catch (err) {
      console.warn("Redis write failed, skipping cache:", err.message)
    }
  }

  return payload
}

exports.getProductById = async (productId) => {
  const normalizedId = Number(productId)

  if (!normalizedId) {
    return null
  }

  const cacheKey = `product:${normalizedId}`

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

  const product = await prisma.product.findUnique({
    where: { id: normalizedId },
    include: {
      category: true,
      images: true
    }
  })

  if (!product) {
    return null
  }

  if (isRedisReady()) {
    try {
      await redis.setEx(cacheKey, 60, JSON.stringify(product))
    } catch (err) {
      console.warn("Redis write failed, skipping cache:", err.message)
    }
  }

  return product
}
