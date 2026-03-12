const { createClient } = require("redis")

const client = createClient({
  url: process.env.REDIS_URL,
  socket: {
    reconnectStrategy: false
  }
})

let redisAvailable = false
let redisConnectionAttempted = false

client.on("error", (err) => {
  if (!redisConnectionAttempted) {
    return
  }

  console.warn("Redis unavailable, continuing without cache:", err.message)
})

async function connectRedis() {
  if (redisConnectionAttempted || !process.env.REDIS_URL) {
    return redisAvailable
  }

  redisConnectionAttempted = true

  try {
    await client.connect()
    redisAvailable = true
    console.log("Redis connected")
  } catch (err) {
    redisAvailable = false
    console.warn("Redis connection failed, cache disabled:", err.message)
  }

  return redisAvailable
}

const isRedisReady = () => redisAvailable && client.isOpen

connectRedis()

module.exports = {
  client,
  connectRedis,
  isRedisReady
}
