'use client';
import { usePomodoro } from '@/context/PomodoroContext';
import { usePathname } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Timer } from 'lucide-react';
import Link from 'next/link';

export default function FloatingPomodoroTimer() {
  const { minutes, seconds, isActive, isBreak } = usePomodoro();
  const pathname = usePathname();

  if (!isActive || pathname === '/dashboard/pomodoro') {
    return null;
  }

  return (
    <Link href="/dashboard/pomodoro">
      <Card className="fixed bottom-6 right-6 z-50 p-4 w-48 cursor-pointer hover:bg-accent transition-colors">
        <div className="flex items-center gap-3">
          <Timer className="h-6 w-6 text-primary" />
          <div>
            <p className="font-semibold text-sm">{isBreak ? 'Break Time' : 'Focus Time'}</p>
            <p className="font-mono text-lg font-bold">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
