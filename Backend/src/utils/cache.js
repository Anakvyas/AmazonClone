const { client: redis, isRedisReady } = require("../config/redis")

async function getJson(key) {
  if (!isRedisReady()) {
    return null
  }

  try {
    const value = await redis.get(key)
    return value ? JSON.parse(value) : null
  } catch (err) {
    console.warn("Redis read failed, skipping cache:", err.message)
    return null
  }
}

async function setJson(key, ttlSeconds, payload) {
  if (!isRedisReady()) {
    return
  }

  try {
    await redis.setEx(key, ttlSeconds, JSON.stringify(payload))
  } catch (err) {
    console.warn("Redis write failed, skipping cache:", err.message)
  }
}

async function deleteByPattern(pattern) {
  if (!isRedisReady()) {
    return
  }

  try {
    const keys = await redis.keys(pattern)

    if (keys.length) {
      await redis.del(keys)
    }
  } catch (err) {
    console.warn("Redis delete failed, skipping cache invalidation:", err.message)
  }
}

module.exports = {
  getJson,
  setJson,
  deleteByPattern
}
