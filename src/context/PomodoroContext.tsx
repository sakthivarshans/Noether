'use client';
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

const WORK_MINUTES = 25;
const BREAK_MINUTES = 5;

interface PomodoroContextType {
  minutes: number;
  seconds: number;
  isActive: boolean;
  isBreak: boolean;
  toggle: () => void;
  reset: () => void;
}

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined);

export const PomodoroProvider = ({ children }: { children: ReactNode }) => {
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
    <PomodoroContext.Provider value={{ minutes, seconds, isActive, isBreak, toggle, reset }}>
      {children}
    </PomodoroContext.Provider>
  );
};

export const usePomodoro = () => {
  const context = useContext(PomodoroContext);
  if (context === undefined) {
    throw new Error('usePomodoro must be used within a PomodoroProvider');
  }
  return context;
};
