"use client";

import { useEffect, useRef } from "react";

type Props = {
  src: string;
  size: number; // canvas square size in px
  alt?: string;
};

export default function VideoFirstFrame({ src, size, alt = "Video first frame" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const video = document.createElement("video");
    video.src = src;
    video.muted = true;
    video.crossOrigin = "anonymous";
    
    video.onloadeddata = () => {
      // Seek to first frame
      video.currentTime = 0;
    };
    
    video.onseeked = () => {
      // Draw first frame when seeked
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Cover behavior
      const scale = Math.max(size / video.videoWidth, size / video.videoHeight);
      const drawW = video.videoWidth * scale;
      const drawH = video.videoHeight * scale;
      const dx = (size - drawW) / 2;
      const dy = (size - drawH) / 2;
      ctx.drawImage(video, dx, dy, drawW, drawH);
    };
    
    video.load();
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
