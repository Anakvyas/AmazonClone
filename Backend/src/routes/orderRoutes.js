const router = require("express").Router()

const controller = require("../controllers/orderController")
const auth = require("../middlewares/authMiddleware")
const { createRateLimiter } = require("../middlewares/rateLimitMiddleware")

const orderWriteRateLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1000,
  max: 20,
  keyPrefix: "orders-write",
  message: "Too many order requests. Please slow down."
})

const orderReadRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 60,
  keyPrefix: "orders-read",
  message: "Too many order history requests. Please try again shortly."
})

router.post("/", auth, orderWriteRateLimiter, controller.createOrder)

router.get("/history", auth, orderReadRateLimiter, controller.getOrderHistory)

module.exports = router
