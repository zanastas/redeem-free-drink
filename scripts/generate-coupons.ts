import { nanoid } from "nanoid";
import prisma from "../lib/db";

async function main() {
  const count = Number(process.env.COUNT || 10);
  const baseUrl = process.env.BASE_URL || "http://localhost:3000";

  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    // default nanoid alphabet; slice to 8 chars from a longer id to reduce bias
    const code = nanoid(12).slice(0, 8).toUpperCase();
    codes.push(code);
  }

  await prisma.$transaction(
    codes.map((code) =>
      prisma.coupon.create({ data: { code } })
    )
  );

  console.log("Generated codes:\n");
  for (const code of codes) {
    console.log(`${code},${baseUrl}/?c=${code}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


