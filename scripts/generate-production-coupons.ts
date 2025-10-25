import { nanoid } from "nanoid";
import prisma from "../lib/db";

async function main() {
  const count = Number(process.env.COUNT || 50);
  const baseUrl = process.env.BASE_URL || "https://redeem-free-drink-k7akosh83-zs-projects-d392fe65.vercel.app";

  console.log(`Generating ${count} production coupon codes...`);

  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    // Generate 8-character codes
    const code = nanoid(12).slice(0, 8).toUpperCase();
    codes.push(code);
  }

  await prisma.$transaction(
    codes.map((code) =>
      prisma.coupon.create({ data: { code } })
    )
  );

  console.log("\n✅ Generated codes:\n");
  for (const code of codes) {
    console.log(`${code},${baseUrl}/?c=${code}`);
  }
  
  console.log(`\n📊 Total: ${count} codes generated`);
  console.log(`🌐 Base URL: ${baseUrl}`);
}

main()
  .catch((e) => {
    console.error("❌ Error generating codes:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
