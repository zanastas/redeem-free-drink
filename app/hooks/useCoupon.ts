"use client";

import { useEffect, useState } from "react";

export function useCouponFromQuery() {
  const [code, setCode] = useState<string | null>(null);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const c = params.get("c");
    setCode(c);
  }, []);
  return code;
}

export function useCouponValidity(code: string | null) {
  const [status, setStatus] = useState<"checking" | "ok" | "invalid" | "redeemed">("checking");

  useEffect(() => {
    if (code === null) {
      setStatus("checking");
      return;
    }
    if (!code) {
      setStatus("invalid");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/coupons/status?code=${encodeURIComponent(code)}`);
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setStatus("invalid");
          return;
        }
        if (!data.exists) {
          setStatus("invalid");
        } else if (data.redeemed) {
          setStatus("redeemed");
        } else {
          setStatus("ok");
        }
      } catch (error) {
        if (!cancelled) setStatus("invalid");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [code]);

  return status;
}


