import { normalizeCouponCode } from "./coupon-code";
import { getRedisClient } from "./redis";

export type CouponStatus = "available" | "redeemed" | "missing";

const definitionPrefix = "coupon:def:";
const redemptionPrefix = "coupon:red:";

function definitionKey(code: string) {
  return `${definitionPrefix}${code}`;
}

function redemptionKey(code: string) {
  return `${redemptionPrefix}${code}`;
}

function parseOptionalTtl(rawValue: string | undefined) {
  if (!rawValue) return null;

  const ttl = Number(rawValue);
  if (!Number.isInteger(ttl) || ttl <= 0) {
    throw new Error("COUPON_TTL_SECONDS must be a positive integer");
  }

  return ttl;
}

export async function getCouponStatus(rawCode: string | null | undefined) {
  const code = normalizeCouponCode(rawCode);
  if (code.length !== 8) {
    return "missing" as const;
  }

  const redis = await getRedisClient();
  const [exists, redeemed] = await Promise.all([
    redis.exists(definitionKey(code)),
    redis.exists(redemptionKey(code)),
  ]);

  if (exists !== 1) {
    return "missing" as const;
  }

  return redeemed === 1 ? "redeemed" : "available";
}

export async function redeemCoupon(rawCode: string | null | undefined) {
  const code = normalizeCouponCode(rawCode);
  if (code.length !== 8) {
    return "missing" as const;
  }

  const redis = await getRedisClient();
  const now = new Date().toISOString();
  const result = await redis.eval(
    [
      "if redis.call('EXISTS', KEYS[1]) == 0 then",
      "  return 'missing'",
      "end",
      "if redis.call('EXISTS', KEYS[2]) == 1 then",
      "  return 'redeemed'",
      "end",
      "local ttl = redis.call('PTTL', KEYS[1])",
      "if ttl > 0 then",
      "  redis.call('PSETEX', KEYS[2], ttl, ARGV[1])",
      "else",
      "  redis.call('SET', KEYS[2], ARGV[1])",
      "end",
      "return 'available'",
    ].join("\n"),
    {
      keys: [definitionKey(code), redemptionKey(code)],
      arguments: [now],
    }
  );

  return result as CouponStatus;
}

export async function seedCoupons(codes: string[], options?: { ttlSeconds?: number | null }) {
  const normalizedCodes = codes.map((code) => normalizeCouponCode(code));
  const ttlSeconds = options?.ttlSeconds ?? null;
  const redis = await getRedisClient();
  const results = await Promise.all(
    normalizedCodes.map((code) => {
      const key = definitionKey(code);
      const value = new Date().toISOString();

      if (ttlSeconds) {
        return redis.set(key, value, { EX: ttlSeconds, NX: true });
      }

      return redis.set(key, value, { NX: true });
    })
  );

  const duplicates = normalizedCodes.filter((_, index) => results[index] !== "OK");

  if (duplicates.length > 0) {
    throw new Error(`Duplicate coupon codes already exist: ${duplicates.join(", ")}`);
  }

  return normalizedCodes;
}

export async function closeRedisClient() {
  if (!global.redisClientPromise) {
    return;
  }

  const client = await global.redisClientPromise;
  if (client.isOpen) {
    await client.quit();
  }
  global.redisClientPromise = undefined;
}

export function getCouponTtlFromEnv() {
  return parseOptionalTtl(process.env.COUPON_TTL_SECONDS);
}
