const jwt = require("jsonwebtoken")

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required"
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.userId = decoded.id

    return next()
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    })
  }
}

module.exports = auth
