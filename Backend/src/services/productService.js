const prisma = require("../config/prisma")
const { getJson, setJson } = require("../utils/cache")

exports.getProducts = async ({ search, category, page = 1, limit = 10 }) => {
  const normalizedPage = Math.max(Number(page) || 1, 1)
  const normalizedLimit = Math.max(Number(limit) || 10, 1)

  const cacheKey = `products:${search || ""}:${category || ""}:${normalizedPage}:${normalizedLimit}`

  const cached = await getJson(cacheKey)

  if (cached) {
    return cached
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

  await setJson(cacheKey, 60, payload)

  return payload
}

exports.getProductById = async (productId) => {
  const normalizedId = Number(productId)

  if (!normalizedId) {
    return null
  }

  const cacheKey = `product:${normalizedId}`

  const cached = await getJson(cacheKey)

  if (cached) {
    return cached
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

  await setJson(cacheKey, 60, product)

  return product
}
