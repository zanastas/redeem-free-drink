"use client";

import Link from "next/link";
import Image from "next/image";
import { Indie_Flower } from "next/font/google";
const indie = Indie_Flower({ subsets: ["latin"], weight: ["400"] });
import { useRef, useState } from "react";

export default function HomePage() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const knobRef = useRef<HTMLButtonElement | null>(null);
  const [dragging, setDragging] = useState(false);

  const handlePointerDown = () => setDragging(true);

  const handlePointerUp = () => {
    if (!trackRef.current || !knobRef.current) return;
    const trackRect = trackRef.current.getBoundingClientRect();
    const knobRect = knobRef.current.getBoundingClientRect();
    const progress = (knobRect.right - trackRect.left) / trackRect.width;
    if (progress >= 0.95) {
      // Navigate to redeemed page by clicking hidden link
      document.getElementById("redeem-link")?.click();
    } else {
      // snap back
      knobRef.current.style.transform = "translateX(0px)";
    }
    setDragging(false);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging || !trackRef.current || !knobRef.current) return;
    const trackRect = trackRef.current.getBoundingClientRect();
    const startX = trackRect.left;
    const endX = trackRect.right - knobRef.current.offsetWidth;
    const x = Math.min(Math.max(e.clientX - knobRef.current.offsetWidth / 2, startX), endX);
    const delta = x - startX;
    knobRef.current.style.transform = `translateX(${delta}px)`;
  };

  return (
    <main className="min-h-screen bg-white text-gray-900 flex flex-col items-center justify-between p-6 sm:p-8">
      <div className="w-full max-w-sm mx-auto flex-1 flex flex-col items-center">
        <div className="pt-6 pb-4 text-center">
          <h1 className={`text-3xl font-bold font-thick leading-relaxed ${indie.className}`}>Thank you for your contribution to 
            <span className="block">AI Fusion Labs!</span>
          </h1>
        </div>

        <div className="my-10 w-48 h-48 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
          <div className="w-28 h-28 bg-gray-300 rounded-md" aria-label="coffee-cup-placeholder" />
        </div>

        <div className="w-full mt-auto">
          <div
            ref={trackRef}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="relative w-full max-w-sm mx-auto h-14 rounded-full bg-gray-200 flex items-center select-none touch-none"
          >
            <span className="absolute inset-0 flex items-center justify-center text-gray-600 pointer-events-none">
              Redeem →
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
        </div>
      </div>

      <footer className="w-full max-w-sm mx-auto pb-2 flex items-center justify-between text-xs text-gray-500">
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

      <Link id="redeem-link" href="/redeemed" className="hidden">
        Redeemed
      </Link>
    </main>
  );
}


