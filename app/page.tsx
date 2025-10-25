"use client";

import Link from "next/link";
import Image from "next/image";
import { Indie_Flower } from "next/font/google";
const indie = Indie_Flower({ subsets: ["latin"], weight: ["400"] });
import { useRef, useState, useEffect } from "react";
import VideoFirstFrame from "./components/VideoFirstFrame";
import { useRouter } from "next/navigation";
import { useCouponFromQuery, useCouponValidity } from "./hooks/useCoupon";

export default function HomePage() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const knobRef = useRef<HTMLButtonElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [redeeming, setRedeeming] = useState(false);
  const router = useRouter();
  const code = useCouponFromQuery();
  const status = useCouponValidity(code);

  const handlePointerDown = (e: React.PointerEvent) => {
    setDragging(true);
    if (knobRef.current) {
      try { knobRef.current.setPointerCapture?.(e.pointerId); } catch {}
    }
  };

  const handlePointerUp = async () => {
    if (!trackRef.current || !knobRef.current) return;
    const trackRect = trackRef.current.getBoundingClientRect();
    const knobRect = knobRef.current.getBoundingClientRect();
    const progress = (knobRect.right - trackRect.left) / trackRect.width;
    
    setDragging(false);
    
    if (progress >= 0.8) {
      // redeem attempt
      if (!code) {
        router.push("/error");
        return;
      }
      if (redeeming) {
        console.log('Already redeeming, ignoring duplicate attempt');
        return;
      }
      setRedeeming(true);
      try {
        console.log('Attempting to redeem code:', code);
        const res = await fetch('/api/coupons/redeem', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code }) });
        const data = await res.json();
        console.log('API response:', res.status, data);
        
        if (res.ok) {
          // Successfully redeemed
          console.log('Success - redirecting to redeemed page');
          router.push(`/redeemed?c=${encodeURIComponent(code)}`);
        } else {
          // Any error (404 not found, 409 already redeemed, 400 invalid, 500 server error)
          console.log('Error - redirecting to error page');
          router.push(`/error?c=${encodeURIComponent(code)}`);
        }
      } catch (error) {
        console.log('Network error:', error);
        router.push(`/error?c=${encodeURIComponent(code)}`);
      }
    } else {
      // snap back
      knobRef.current.style.transition = "transform 200ms ease";
      knobRef.current.style.transform = "translateX(0px)";
      setTimeout(() => {
        if (knobRef.current) knobRef.current.style.transition = "";
      }, 210);
    }
  };

  const handlePointerMove = (e: React.PointerEvent | PointerEvent) => {
    if (!dragging || !trackRef.current || !knobRef.current) return;
    const trackRect = trackRef.current.getBoundingClientRect();
    const startX = trackRect.left;
    const endX = trackRect.right - knobRef.current.offsetWidth;
    const x = Math.min(Math.max(e.clientX - knobRef.current.offsetWidth / 2, startX), endX);
    const delta = x - startX;
    knobRef.current.style.transform = `translateX(${delta}px)`;
  };

  // Capture pointer move globally while dragging so it doesn't feel sticky
  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: PointerEvent) => handlePointerMove(e);
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
    };
  }, [dragging]);

  // Pre-check on load
  useEffect(() => {
    if (status === 'invalid' || status === 'redeemed') {
      const q = code ? `?c=${encodeURIComponent(code)}` : '';
      router.replace(`/error${q}`);
    }
  }, [status, code, router]);

  return (
    <main className="min-h-screen bg-white text-gray-900 flex flex-col items-center justify-between p-6 sm:p-8 pb-footer">
      <div className="w-full max-w-sm mx-auto flex-1 flex flex-col items-center">
        <div className="pt-6 pb-4 text-center h-32 flex flex-col justify-center">
          <h1 className={`text-3xl font-bold font-thick leading-relaxed ${indie.className}`}>Thank you for your contribution to 
            <span className="block">AI Fusion Labs!</span>
          </h1>
        </div>

          <div className="my-10 w-48 h-48 rounded-full overflow-hidden flex items-center justify-center">
            <VideoFirstFrame src="/coffee-logo.mp4" size={192} alt="Empty coffee cup" />
          </div>

        <div className="w-full">
          <div
            ref={trackRef}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="relative w-full max-w-sm mx-auto h-14 rounded-full bg-gray-200 flex items-center select-none touch-none"
          >
            <span className="absolute inset-0 flex items-center justify-center text-gray-600 pointer-events-none font-bold">
              Slide to Redeem →
            </span>
            <button
              ref={knobRef}
              onPointerDown={handlePointerDown}
              className="z-10 w-14 h-14 rounded-full bg-black text-white flex items-center justify-center shadow-md active:scale-[0.98]"
              aria-label="Slide to redeem"
            >
              ▶
            </button>
          </div>
          
          <footer className="w-full max-w-sm mx-auto mt-32 pb-2 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-20 h-20 rounded-full overflow-hidden">
            <Image src="/webe-cafe-logo.jpg" alt="webe cafe logo" width={80} height={80} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span>Vibe coded by AI Fusion Labs</span>
          <Image src="/aifusionlabs-logo.png" alt="AI Fusion Labs logo" width={30} height={30} />
          </div>
        </footer>
        </div>
      </div>

      <Link id="redeem-link" href="/redeemed" className="hidden">
        Redeemed
      </Link>
    </main>
  );
}


