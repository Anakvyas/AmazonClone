const prisma = require("../config/prisma")
const { hashPassword, comparePassword } = require("../utils/hash")
const { generateToken } = require("../utils/jwt")

exports.registerUser = async ({ username, email, password }) => {

  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    throw new Error("Email already registered")
  }

  const hashedPassword = await hashPassword(password)
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword
    }
  })

  // Generate JWT token
  const token = generateToken(user.id)

  return {
    user,
    token
  }

}


/*
 Login user
*/
exports.loginUser = async ({ email, password }) => {

  // Find user
  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    throw new Error("Invalid email or password")
  }

  
  const isValid = await comparePassword(password, user.password)

  if (!isValid) {
    throw new Error("Invalid email or password")
  }

  const token = generateToken(user.id)

  return {
    user,
    token
  }

}


// get profile

exports.getProfile = async (userId) => {

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      createdAt: true
    }
  })

  if (!user) {
    throw new Error("User not found")
  }

  return user
}