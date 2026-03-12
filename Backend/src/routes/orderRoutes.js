const router = require("express").Router()

const controller = require("../controllers/orderController")
const auth = require("../middlewares/authMiddleware")

router.post("/", auth, controller.createOrder)

router.get("/history", auth, controller.getOrderHistory)

module.exports = router