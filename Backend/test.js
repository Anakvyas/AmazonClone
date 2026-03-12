const redis = require("./src/config/redis")

async function test() {

  await redis.set("test", "hello")

  const value = await redis.get("test")

  console.log(value)

}

test()