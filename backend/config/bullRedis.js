const Redis = require("ioredis");

const bullRedis = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null
});

bullRedis.on("connect", () => {
  console.log("✅ BullMQ Redis connected");
});

bullRedis.on("error", (err) => {
  console.error("❌ BullMQ Redis error:", err.message);
});

module.exports = bullRedis;