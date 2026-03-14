const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

type UpstashSuccess<T> = {
  result: T;
};

type UpstashFailure = {
  error: string;
};

type UpstashResponse<T> = UpstashSuccess<T> | UpstashFailure;

function ensureRedisEnv() {
  if (!redisUrl || !redisToken) {
    throw new Error("Missing Upstash Redis environment variables");
  }
}

export async function runRedisCommand<T>(command: Array<string | number>) {
  ensureRedisEnv();

  const response = await fetch(redisUrl!, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${redisToken!}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });

  const payload = (await response.json()) as UpstashResponse<T>;
  if (!response.ok || "error" in payload) {
    throw new Error("error" in payload ? payload.error : "Redis request failed");
  }

  return payload.result;
}

export async function runRedisPipeline<T>(commands: Array<Array<string | number>>) {
  ensureRedisEnv();

  const response = await fetch(`${redisUrl!}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${redisToken!}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commands),
    cache: "no-store",
  });

  const payload = (await response.json()) as Array<UpstashResponse<T>>;
  if (!response.ok) {
    throw new Error("Redis pipeline request failed");
  }

  const failure = payload.find((item) => "error" in item);
  if (failure && "error" in failure) {
    throw new Error(failure.error);
  }

  return payload.map((item) => ("result" in item ? item.result : null)) as T[];
}
