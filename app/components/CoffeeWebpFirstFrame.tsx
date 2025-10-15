"use client";

import { useEffect, useRef } from "react";

type Props = {
  src: string;
  size: number; // canvas square size in px
  alt?: string;
};

export default function CoffeeWebpFirstFrame({ src, size, alt = "Coffee" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = src;
    img.onload = () => {
      // draw first rendered frame; canvas won't auto-update with animation
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // cover behavior
      const scale = Math.max(size / img.width, size / img.height);
      const drawW = img.width * scale;
      const drawH = img.height * scale;
      const dx = (size - drawW) / 2;
      const dy = (size - drawH) / 2;
      ctx.drawImage(img, dx, dy, drawW, drawH);
    };
  }, [src, size]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      aria-label={alt}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}


