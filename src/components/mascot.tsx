'use client';

import { cn } from "@/lib/utils";

export default function Mascot({ className }: { className?: string }) {
  return (
    <div className={cn("w-full h-full relative", className)}>
      <svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="animate-[float_3s_ease-in-out_infinite]"
      >
        {/* Robot Head Shape */}
        <path
          fill="hsl(var(--primary))"
          d="M 50,50 C 40,50 40,50 40,60 V 140 C 40,150 40,150 50,150 H 150 C 160,150 160,150 160,140 V 60 C 160,50 160,50 150,50 Z"
          transform="translate(0, -10)"
        />

        {/* Eyes */}
        <circle cx="80" cy="90" r="12" fill="white" />
        <circle cx="120" cy="90" r="12" fill="white" />
        <circle cx="80" cy="90" r="6" fill="hsl(var(--foreground))" className="animate-[blink_4s_infinite_2s]" />
        <circle cx="120" cy="90" r="6" fill="hsl(var(--foreground))" className="animate-[blink_4s_infinite_2.2s]" />

        {/* Mouth */}
        <path
          d="M 90 125 Q 100 135 110 125"
          stroke="white"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />

        {/* Antennas */}
        <line x1="70" y1="40" x2="60" y2="20" stroke="hsl(var(--accent-foreground))" strokeWidth="4" />
        <circle cx="58" cy="18" r="6" fill="hsl(var(--accent))" />

        <line x1="130" y1="40" x2="140" y2="20" stroke="hsl(var(--accent-foreground))" strokeWidth="4" />
        <circle cx="142" cy="18" r="6" fill="hsl(var(--accent))" />

      </svg>
      <style jsx>{`
        @keyframes blink {
          0%, 100% { transform: scale(1, 1); transform-origin: center; }
          50% { transform: scale(1, 0.1); transform-origin: center; }
        }
      `}</style>
    </div>
  );
}
