'use client';
import { useState, useEffect } from 'react';
import { Flame } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function StreakTracker() {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const today = new Date().toLocaleDateString();
    const lastVisit = localStorage.getItem('lastVisitDate');
    let currentStreak = Number(localStorage.getItem('streakCount')) || 0;

    if (lastVisit) {
      const lastVisitDate = new Date(new Date(lastVisit).toDateString());
      const todayDate = new Date(new Date().toDateString());
      
      const diffTime = todayDate.getTime() - lastVisitDate.getTime();
      const diffDays = diffTime / (1000 * 3600 * 24);

      if (diffDays === 1) {
        // It's a new consecutive day
        currentStreak++;
      } else if (diffDays > 1) {
        // The streak is broken
        currentStreak = 1;
      }
      // If diffDays is 0, do nothing, it's the same day.
    } else {
      // First visit
      currentStreak = 1;
    }
    
    localStorage.setItem('lastVisitDate', today);
    localStorage.setItem('streakCount', String(currentStreak));
    setStreak(currentStreak);

  }, []);

  return (
    <Card className="p-3">
        <div className="flex items-center gap-2">
            <Flame className="h-6 w-6 text-orange-500"/>
            <span className="text-2xl font-bold">{streak}</span>
            <span className="text-muted-foreground">Day Streak</span>
        </div>
    </Card>
  );
}
