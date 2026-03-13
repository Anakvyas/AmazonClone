const { client: redis, isRedisReady } = require("../config/redis")

const memoryStore = new Map()

function createHttpError(message, statusCode) {
  const error = new Error(message)
  error.statusCode = statusCode
  return error
}

function getMemoryRateLimitKey(prefix, key) {
  return `${prefix}:${key}`
}

function getRequestKey(req, keyGenerator) {
  return keyGenerator ? keyGenerator(req) : req.ip || "unknown"
}

async function incrementRedisCounter(key, windowSeconds) {
  const total = await redis.incr(key)

  if (total === 1) {
    await redis.expire(key, windowSeconds)
  }

  return total
}

function incrementMemoryCounter(key, windowMs) {
  const now = Date.now()
  const current = memoryStore.get(key)

  if (!current || current.resetAt <= now) {
    memoryStore.set(key, {
      count: 1,
      resetAt: now + windowMs
    })
    return 1
  }

  current.count += 1
  memoryStore.set(key, current)
  return current.count
}

function createRateLimiter({
  windowMs,
  max,
  keyPrefix,
  message,
  keyGenerator
}) {
  return async (req, res, next) => {
    const requestKey = getRequestKey(req, keyGenerator)
    const redisKey = `rate-limit:${keyPrefix}:${requestKey}`

    try {
      let total

      if (isRedisReady()) {
        total = await incrementRedisCounter(redisKey, Math.ceil(windowMs / 1000))
      } else {
        total = incrementMemoryCounter(
          getMemoryRateLimitKey(keyPrefix, requestKey),
          windowMs
        )
      }

      if (total > max) {
        return next(createHttpError(message, 429))
      }

      return next()
    } catch (err) {
      try {
        const total = incrementMemoryCounter(
          getMemoryRateLimitKey(keyPrefix, requestKey),
          windowMs
        )

        if (total > max) {
          return next(createHttpError(message, 429))
        }
      } catch (fallbackErr) {
        return next(fallbackErr)
      }

      return next()
    }
  }
}

module.exports = {
  createRateLimiter
}
