const router = require("express").Router()

const controller = require("../controllers/wishlistController")
const auth = require("../middlewares/authMiddleware")

router.post("/", auth, controller.addWishlist)

router.get("/", auth, controller.getWishlist)

module.exports = router