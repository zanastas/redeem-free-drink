import { redeemCoupon } from "../../../../lib/coupons";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let payload: { code?: string } = {};
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const code = payload.code;
  if (!code) {
    return NextResponse.json({ error: "Invalid code" }, { status: 400 });
  }

  try {
    const status = await redeemCoupon(code);
    if (status === "available") {
      return NextResponse.json({ ok: true }, { status: 200 });
    }
    if (status === "missing") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Already redeemed" }, { status: 409 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
