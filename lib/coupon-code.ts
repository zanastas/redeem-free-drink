import { customAlphabet } from "nanoid";

const couponAlphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
const createCode = customAlphabet(couponAlphabet, 8);

export function normalizeCouponCode(code: string | null | undefined) {
  return (code ?? "").trim().toUpperCase();
}

export function generateCouponCodes(count: number) {
  if (!Number.isInteger(count) || count <= 0) {
    throw new Error("COUNT must be a positive integer");
  }

  const codes = new Set<string>();
  while (codes.size < count) {
    codes.add(createCode());
  }

  return [...codes];
}
