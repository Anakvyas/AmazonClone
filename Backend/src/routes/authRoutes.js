const router = require("express").Router()

const controller = require("../controllers/authController")
const { createRateLimiter } = require("../middlewares/rateLimitMiddleware")

const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  keyPrefix: "auth",
  message: "Too many login attempts. Please wait and try again."
})

router.post("/register", authRateLimiter, controller.register)

router.post("/login", authRateLimiter, controller.login)
router.post("/google", authRateLimiter, controller.googleLogin)

module.exports = router
