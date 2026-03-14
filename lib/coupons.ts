import { normalizeCouponCode } from "./coupon-code";
import { runRedisCommand, runRedisPipeline } from "./upstash";

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

  const [exists, redeemed] = await runRedisPipeline<number>([
    ["EXISTS", definitionKey(code)],
    ["EXISTS", redemptionKey(code)],
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

  const now = new Date().toISOString();
  const result = await runRedisCommand<string>([
    "EVAL",
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
    2,
    definitionKey(code),
    redemptionKey(code),
    now,
  ]);

  return result as CouponStatus;
}

export async function seedCoupons(codes: string[], options?: { ttlSeconds?: number | null }) {
  const normalizedCodes = codes.map((code) => normalizeCouponCode(code));
  const ttlSeconds = options?.ttlSeconds ?? null;
  const commands = normalizedCodes.map((code) => {
    const command: Array<string | number> = ["SET", definitionKey(code), new Date().toISOString(), "NX"];
    if (ttlSeconds) {
      command.push("EX", ttlSeconds);
    }
    return command;
  });

  const results = await runRedisPipeline<"OK" | null>(commands);
  const duplicates = normalizedCodes.filter((_, index) => results[index] === null);

  if (duplicates.length > 0) {
    throw new Error(`Duplicate coupon codes already exist: ${duplicates.join(", ")}`);
  }

  return normalizedCodes;
}

export function getCouponTtlFromEnv() {
  return parseOptionalTtl(process.env.COUPON_TTL_SECONDS);
}
