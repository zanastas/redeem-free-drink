import { generateCouponCodes } from "../lib/coupon-code";
import { getCouponTtlFromEnv, seedCoupons } from "../lib/coupons";

async function main() {
  const count = Number(process.env.COUNT || 50);
  const baseUrl = process.env.BASE_URL || "https://redeem-free-drink-k7akosh83-zs-projects-d392fe65.vercel.app";
  const ttlSeconds = getCouponTtlFromEnv();

  console.log(`Generating ${count} production coupon codes...`);
  const codes = generateCouponCodes(count);
  await seedCoupons(codes, { ttlSeconds });

  console.log("\n✅ Generated codes:\n");
  for (const code of codes) {
    console.log(`${code},${baseUrl}/?c=${code}`);
  }
  
  console.log(`\n📊 Total: ${count} codes generated`);
  console.log(`🌐 Base URL: ${baseUrl}`);
  if (ttlSeconds) {
    console.log(`⏳ TTL: ${ttlSeconds} seconds`);
  }
}

main()
  .catch((e) => {
    console.error("❌ Error generating codes:", e);
    process.exit(1);
  });
