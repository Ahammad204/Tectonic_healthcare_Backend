import { createClient } from "redis";
import config from "../config";

export const RedisClient = createClient({
  username: config.redis_user,
  password: config.redis_password,
  socket: {
    host: config.redis_host,
    port: Number(config.redis_port),
  },
});

// RedisClient.on("error", (err) => console.log("Redis Client Error", err));

// await RedisClient.connect();

// await RedisClient.set("foo", "bar");
// const result = await RedisClient.get("foo");
// console.log(result); // >>> bar
