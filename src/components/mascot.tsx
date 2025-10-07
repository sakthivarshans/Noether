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
        <path
          fill="hsl(var(--primary))"
          d="M45.5,-62.5C59.3,-53.6,71.2,-41.4,76.5,-26.7C81.9,-12,80.7,5.2,74.5,20.2C68.4,35.2,57.3,48,44.2,58.3C31.1,68.6,15.5,76.4,0.4,75.9C-14.7,75.4,-29.4,66.6,-43.7,56.8C-58,47,-71.9,36.2,-78,21.6C-84.1,7,-82.4,-11.3,-75.4,-27.1C-68.4,-42.9,-56.1,-56.2,-42,-65.3C-27.9,-74.4,-14,-79.3,0.9,-79.7C15.7,-80.1,31.7,-71.4,45.5,-62.5Z"
          transform="translate(100 100)"
        />
        {/* Eyes */}
        <circle cx="85" cy="80" r="10" fill="white" />
        <circle cx="115" cy="80" r="10" fill="white" />
        <circle cx="87" cy="82" r="5" fill="hsl(var(--foreground))" className="animate-[blink_4s_infinite_2s]" />
        <circle cx="117" cy="82" r="5" fill="hsl(var(--foreground))" className="animate-[blink_4s_infinite_2.2s]" />

        {/* Mouth */}
        <path
          d="M 95 105 A 10 10 0 0 0 105 105"
          stroke="white"
          strokeWidth="3"
          fill="none"
        />

        {/* Antenna */}
        <line x1="100" y1="40" x2="100" y2="20" stroke="hsl(var(--accent-foreground))" strokeWidth="3" />
        <circle cx="100" cy="15" r="5" fill="hsl(var(--accent))" />
      </svg>
      <style jsx>{`
        @keyframes blink {
          0%, 100% { transform: scale(1, 1); }
          50% { transform: scale(1, 0.1); }
        }
      `}</style>
    </div>
  );
}
