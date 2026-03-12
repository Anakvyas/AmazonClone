const router = require("express").Router()

const controller = require("../controllers/cartController")
const auth = require("../middlewares/authMiddleware")

router.post("/", auth, controller.addToCart)

router.get("/", auth, controller.getCart)

router.delete("/:id", auth, controller.removeFromCart)

module.exports = router