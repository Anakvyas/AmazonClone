const prisma = require("../config/prisma")
const { hashPassword, comparePassword } = require("../utils/hash")
const { generateToken } = require("../utils/jwt")
const axios = require("axios")
const crypto = require("crypto")
const DEMO_EMAIL = "demo.user@amazonclone.local"
const DEMO_USERNAME = "demo_user"

async function buildUniqueUsername(baseUsername) {
  const normalized = (baseUsername || "user")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 20) || "user"

  let candidate = normalized
  let suffix = 1

  while (await prisma.user.findUnique({ where: { username: candidate } })) {
    candidate = `${normalized}${suffix}`
    suffix += 1
  }

  return candidate
}

async function getOrCreateDemoUser() {
  let user = await prisma.user.findUnique({
    where: { email: DEMO_EMAIL }
  })

  if (user) {
    return user
  }

  const hashedPassword = await hashPassword(crypto.randomUUID())

  user = await prisma.user.create({
    data: {
      username: DEMO_USERNAME,
      email: DEMO_EMAIL,
      password: hashedPassword
    }
  })

  return user
}

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

exports.googleLogin = async (req,res,next)=>{

  try{

    const { credential } = req.body

    if(!credential){
      return res.status(400).json({ success:false, message:"Google credential is required" })
    }

    const googleClientId = process.env.AUTH_GOOGLE_ID

    if(!googleClientId){
      return res.status(500).json({ success:false, message:"Google auth is not configured" })
    }

    const { data } = await axios.get("https://oauth2.googleapis.com/tokeninfo", {
      params: {
        id_token: credential
      }
    })

    if(data.aud !== googleClientId){
      return res.status(401).json({ success:false, message:"Invalid Google client" })
    }

    if(!data.email || data.email_verified !== "true"){
      return res.status(401).json({ success:false, message:"Google account email is not verified" })
    }

    let user = await prisma.user.findUnique({
      where:{ email:data.email }
    })

    if(!user){
      const username = await buildUniqueUsername(
        data.name || data.email.split("@")[0]
      )

      user = await prisma.user.create({
        data:{
          username,
          email:data.email,
          password:crypto.randomUUID()
        }
      })
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

exports.demoLogin = async (req, res, next) => {

  try {

    const user = await getOrCreateDemoUser()
    const token = generateToken(user.id)

    res.json({
      success: true,
      token,
      user
    })

  } catch (err) {
    next(err)
  }

}
