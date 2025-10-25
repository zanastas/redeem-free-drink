import prisma from "../../../../lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let payload: { code?: string } = {};
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const code = (payload.code || "").trim();
  if (!code || code.length !== 8) {
    return NextResponse.json({ error: "Invalid code" }, { status: 400 });
  }

  try {
    const update = await prisma.coupon.updateMany({
      where: { code, redeemedAt: null },
      data: { redeemedAt: new Date() },
    });
    if (update.count === 1) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }
    // check existence to differentiate not found vs already redeemed
    const exists = await prisma.coupon.findUnique({ where: { code } });
    if (!exists) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ error: "Already redeemed" }, { status: 409 });
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


