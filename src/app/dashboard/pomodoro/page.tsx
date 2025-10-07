'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, RefreshCw } from 'lucide-react';

const WORK_MINUTES = 25;
const BREAK_MINUTES = 5;

export default function PomodoroPage() {
  const [minutes, setMinutes] = useState(WORK_MINUTES);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Timer ended
            if (isBreak) {
              setMinutes(WORK_MINUTES);
              setIsBreak(false);
            } else {
              setMinutes(BREAK_MINUTES);
              setIsBreak(true);
            }
            setSeconds(0);
            setIsActive(false);
            // Optional: Play a sound
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds, minutes, isBreak]);

  const toggle = () => {
    setIsActive(!isActive);
  };

  const reset = () => {
    setIsActive(false);
    setIsBreak(false);
    setMinutes(WORK_MINUTES);
    setSeconds(0);
  };

  return (
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">{isBreak ? 'Break Time' : 'Focus Session'}</CardTitle>
          <CardDescription>Stay on track and boost your productivity.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <div className="relative h-64 w-64">
            <svg className="h-full w-full" viewBox="0 0 100 100">
              <circle
                className="stroke-current text-secondary"
                strokeWidth="7"
                cx="50"
                cy="50"
                r="45"
                fill="transparent"
              ></circle>
              <circle
                className="stroke-current text-primary"
                strokeWidth="7"
                cx="50"
                cy="50"
                r="45"
                fill="transparent"
                strokeDasharray="283"
                strokeDashoffset={283 - ( (isBreak ? (minutes * 60 + seconds) / (BREAK_MINUTES * 60) : (minutes * 60 + seconds) / (WORK_MINUTES * 60)) * 283)}
                transform="rotate(-90 50 50)"
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              ></circle>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-5xl font-bold font-mono">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
          <div className="flex gap-4">
            <Button size="lg" onClick={toggle}>
              {isActive ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              <span className="ml-2">{isActive ? 'Pause' : 'Start'}</span>
            </Button>
            <Button size="lg" variant="outline" onClick={reset}>
              <RefreshCw className="h-6 w-6" />
              <span className="ml-2">Reset</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
