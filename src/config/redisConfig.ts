import { createClient } from "redis";

const redis = createClient({
  url: process.env.REDIS_URL,
});

redis.on("error", (err) =>
  console.log("Error connecting to redis client", err),
);

export default redis;
