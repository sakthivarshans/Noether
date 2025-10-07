'use client';

import { cn } from "@/lib/utils";

export default function Mascot({ className }: { className?: string }) {
  return (
    <div className={cn("w-full h-full relative", className)}>
      <svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="animate-[float_4s_ease-in-out_infinite]"
      >
        <defs>
          <radialGradient id="energeticGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" style={{stopColor: 'hsl(var(--accent))', stopOpacity:1}} />
            <stop offset="100%" style={{stopColor: 'hsl(var(--primary))', stopOpacity:1}} />
          </radialGradient>
        </defs>

        {/* Main energetic shape */}
        <path
          fill="url(#energeticGradient)"
          d="M 100,20 C 140,20 180,60 180,100 C 180,140 140,180 100,180 C 60,180 20,140 20,100 C 20,60 60,20 100,20 Z"
          className="path"
        ></path>

        {/* Inner glow / core */}
        <circle cx="100" cy="100" r="30" fill="white" opacity="0.8" className="pulse"/>

        {/* Sparkles */}
        <circle cx="50" cy="50" r="5" fill="hsl(var(--accent))" className="sparkle" style={{animationDelay: '0s'}} />
        <circle cx="150" cy="60" r="7" fill="hsl(var(--accent))" className="sparkle" style={{animationDelay: '1s'}}/>
        <circle cx="60" cy="150" r="6" fill="hsl(var(--accent))" className="sparkle" style={{animationDelay: '2s'}}/>

      </svg>
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(5deg);
          }
          100% {
            transform: translateY(0px) rotate(0deg);
          }
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 0.8; }
        }
        .pulse {
          animation: pulse 2.5s ease-in-out infinite;
          transform-origin: center;
        }

        @keyframes sparkle {
          0%, 100% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1); opacity: 1; }
          75% { transform: scale(0); opacity: 0; }
        }
        .sparkle {
          animation: sparkle 3s ease-in-out infinite;
          transform-origin: center;
        }

        @keyframes morph {
          0% {
            d: path("M 100,20 C 140,20 180,60 180,100 C 180,140 140,180 100,180 C 60,180 20,140 20,100 C 20,60 60,20 100,20 Z");
          }
          50% {
            d: path("M 100,30 C 130,10 190,70 170,110 C 150,150 110,190 70,170 C 30,150 10,110 30,70 C 50,30 70,50 100,30 Z");
          }
          100% {
            d: path("M 100,20 C 140,20 180,60 180,100 C 180,140 140,180 100,180 C 60,180 20,140 20,100 C 20,60 60,20 100,20 Z");
          }
        }
        .path {
          animation: morph 8s ease-in-out infinite;
        }

      `}</style>
    </div>
  );
}
