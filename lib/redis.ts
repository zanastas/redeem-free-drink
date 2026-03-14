import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL;

declare global {
  var redisClientPromise: Promise<ReturnType<typeof createClient>> | undefined;
}

function createRedisClient() {
  if (!redisUrl) {
    throw new Error("Missing REDIS_URL");
  }

  const client = createClient({ url: redisUrl });
  client.on("error", (error) => {
    console.error("Redis client error", error);
  });

  return client;
}

export function getRedisClient() {
  if (!global.redisClientPromise) {
    const client = createRedisClient();
    global.redisClientPromise = client.connect().then(() => client);
  }

  return global.redisClientPromise;
}
