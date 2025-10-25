import prisma from "../../../../lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = (searchParams.get("code") || "").trim();
  if (!code || code.length !== 8) {
    return NextResponse.json({ exists: false, redeemed: false }, { status: 400 });
  }
  const coupon = await prisma.coupon.findUnique({ where: { code } });
  if (!coupon) return NextResponse.json({ exists: false, redeemed: false }, { status: 200 });
  return NextResponse.json({ exists: true, redeemed: !!coupon.redeemedAt }, { status: 200 });
}


