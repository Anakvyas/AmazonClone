const prisma = require("../config/prisma")
const { deleteByPattern, getJson, setJson } = require("../utils/cache")

function createHttpError(message, statusCode) {
  const error = new Error(message)
  error.statusCode = statusCode
  return error
}

function normalizePagination(page, limit) {
  const normalizedPage = Math.max(Number(page) || 1, 1)
  const normalizedLimit = Math.min(Math.max(Number(limit) || 5, 1), 20)

  return {
    page: normalizedPage,
    limit: normalizedLimit
  }
}

function normalizeOrderItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw createHttpError("Add at least one item before placing an order.", 400)
  }

  const mergedItems = new Map()

  for (const item of items) {
    const productId = Number(item?.productId)
    const quantity = Number(item?.quantity)

    if (!Number.isInteger(productId) || productId <= 0) {
      throw createHttpError("Invalid product selected for the order.", 400)
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw createHttpError("Order quantities must be whole numbers greater than zero.", 400)
    }

    const existing = mergedItems.get(productId)

    mergedItems.set(productId, {
      productId,
      quantity: (existing?.quantity || 0) + quantity
    })
  }

  return Array.from(mergedItems.values())
}

async function invalidateOrderRelatedCache(userId) {
  await Promise.all([
    deleteByPattern(`orders:${userId}:*`),
    deleteByPattern("products:*"),
    deleteByPattern("product:*")
  ])
}

exports.createOrder = async (userId, items) => {
  const normalizedItems = normalizeOrderItems(items)
  const productIds = normalizedItems.map((item) => item.productId)

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds
      }
    },
    select: {
      id: true,
      name: true,
      price: true,
      stock: true
    }
  })

  if (products.length !== productIds.length) {
    throw createHttpError("One or more products could not be found.", 404)
  }

  const productMap = new Map(products.map((product) => [product.id, product]))

  let totalPrice = 0

  const orderItems = normalizedItems.map((item) => {
    const product = productMap.get(item.productId)

    if (!product) {
      throw createHttpError("One or more products could not be found.", 404)
    }

    if (product.stock < item.quantity) {
      throw createHttpError(
        `${product.name} has only ${product.stock} item(s) left in stock.`,
        409
      )
    }

    totalPrice += product.price * item.quantity

    return {
      productId: item.productId,
      quantity: item.quantity,
      price: product.price
    }
  })

  const order = await prisma.$transaction(async (tx) => {
    for (const item of orderItems) {
      const updated = await tx.product.updateMany({
        where: {
          id: item.productId,
          stock: {
            gte: item.quantity
          }
        },
        data: {
          stock: {
            decrement: item.quantity
          }
        }
      })

      if (updated.count !== 1) {
        const product = productMap.get(item.productId)
        throw createHttpError(
          `${product?.name || "This product"} is no longer available in the requested quantity.`,
          409
        )
      }
    }

    const createdOrder = await tx.order.create({
      data: {
        userId,
        totalPrice,
        items: {
          create: orderItems
        }
      }
    })

    await tx.cart.deleteMany({
      where: {
        userId,
        productId: {
          in: productIds
        }
      }
    })

    return createdOrder
  })

  await invalidateOrderRelatedCache(userId)

  return order
}

exports.getOrderHistory = async (userId, { page, limit }) => {
  const pagination = normalizePagination(page, limit)
  const cacheKey = `orders:${userId}:${pagination.page}:${pagination.limit}`
  const cached = await getJson(cacheKey)

  if (cached) {
    return cached
  }

  const where = { userId }

  const [orders, total] = await prisma.$transaction([
    prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
                category: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit
    }),
    prisma.order.count({ where })
  ])

  const payload = {
    items: orders,
    page: pagination.page,
    limit: pagination.limit,
    total,
    hasMore: pagination.page * pagination.limit < total
  }

  await setJson(cacheKey, 60, payload)

  return payload
}
