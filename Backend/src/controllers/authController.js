const prisma = require("../config/prisma")
const { hashPassword, comparePassword } = require("../utils/hash")
const { generateToken } = require("../utils/jwt")

exports.register = async (req,res,next)=>{

  try{

    const {username,email,password} = req.body

    const hashed = await hashPassword(password)

    const user = await prisma.user.create({
      data:{
        username,
        email,
        password:hashed
      }
    })

    const token = generateToken(user.id)

    res.json({
      success:true,
      token,
      user
    })

  }catch(err){
    next(err)
  }

}


exports.login = async (req,res,next)=>{

  try{

    const {email,password} = req.body

    const user = await prisma.user.findUnique({
      where:{email}
    })

    if(!user){
      return res.status(401).json({message:"Invalid credentials"})
    }

    const valid = await comparePassword(password,user.password)

    if(!valid){
      return res.status(401).json({message:"Invalid credentials"})
    }

    const token = generateToken(user.id)

    res.json({
      success:true,
      token,
      user
    })

  }catch(err){
    next(err)
  }

}