require("dotenv").config()

const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const morgan = require("morgan")

const productRoutes = require("./src/routes/productRoutes")
const authRoutes = require("./src/routes/authRoutes")
const productRoutes = require("./src/routes/productRoutes")
const cartRoutes = require("./src/routes/cartRoutes")
const orderRoutes = require("./src/routes/orderRoutes")
const wishlistRoutes = require("./src/routes/wishlistRoutes")

app.use("/api/auth",authRoutes)
app.use("/api/products",productRoutes)
app.use("/api/cart",cartRoutes)
app.use("/api/orders",orderRoutes)
app.use("/api/wishlist",wishlistRoutes)

const errorMiddleware = require("./src/middlewares/errorMiddleware")

const app = express()

app.use(cors())
app.use(helmet())
app.use(express.json())
app.use(morgan("dev"))

app.use("/api/products",productRoutes)


app.use(errorMiddleware)

const PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
 console.log(`Server running on ${PORT}`)
})