'use client';
import { usePomodoro } from '@/context/PomodoroContext';
import { usePathname } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Timer, GripVertical } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

export default function FloatingPomodoroTimer() {
  const { minutes, seconds, isActive, isBreak } = usePomodoro();
  const pathname = usePathname();
  const [position, setPosition] = useState({ x: window.innerWidth - 220, y: window.innerHeight - 120 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const timerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setPosition(prev => ({
        x: Math.min(prev.x, window.innerWidth - (timerRef.current?.offsetWidth || 200)),
        y: Math.min(prev.y, window.innerHeight - (timerRef.current?.offsetHeight || 100)),
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    dragStartPos.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      const newX = e.clientX - dragStartPos.current.x;
      const newY = e.clientY - dragStartPos.current.y;
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  if (!isActive || pathname === '/dashboard/pomodoro') {
    return null;
  }

  return (
    <div
      ref={timerRef}
      className="fixed z-50"
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <Card className="w-48 shadow-lg">
        <div
          className="flex items-center gap-1 p-2 cursor-grab active:cursor-grabbing bg-secondary/50 rounded-t-lg"
          onMouseDown={handleMouseDown}
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
          <p className="font-semibold text-sm text-muted-foreground">{isBreak ? 'Break Time' : 'Focus Time'}</p>
        </div>
        <Link href="/dashboard/pomodoro">
          <div className="p-4 pt-2 cursor-pointer hover:bg-accent transition-colors rounded-b-lg">
            <div className="flex items-center gap-3">
              <Timer className="h-6 w-6 text-primary" />
              <div>
                <p className="font-mono text-lg font-bold">
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </p>
              </div>
            </div>
          </div>
        </Link>
      </Card>
    </div>
  );
}
