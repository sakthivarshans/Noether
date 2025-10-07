'use client';

import {
  BookOpen,
  BrainCircuit,
  Calendar,
  FileQuestion,
  ListTodo,
  Mic,
  Music,
  Puzzle,
  Search,
  Timer,
  Upload,
  Bed,
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Mascot from '@/components/mascot';
import { Button } from '@/components/ui/button';
import { quotes } from '@/lib/data';
import React from 'react';

const tools = [
  { href: '/dashboard/upload', label: 'Upload Document', icon: Upload, description: 'Summarize & analyze docs' },
  { href: '/dashboard/pyq', label: 'PYQ Solver', icon: FileQuestion, description: 'Get answers for past papers' },
  { href: '/dashboard/notes', label: 'Voice Notes', icon: Mic, description: 'Record and transcribe thoughts' },
  { href: '/dashboard/search', label: 'Topic Search', icon: Search, description: 'Explore any topic' },
  { href: '/dashboard/timetable', label: 'Timetable', icon: Calendar, description: 'Generate a study schedule' },
  { href: '/dashboard/todo', label: 'To-Do List', icon: ListTodo, description: 'Track tasks and deadlines' },
  { href: '/dashboard/pomodoro', label: 'Pomodoro', icon: Timer, description: 'Stay focused with timers' },
  { href: '/dashboard/power-nap', label: 'Power Nap', icon: Bed, description: 'Quick recharge for your brain' },
  { href: '/dashboard/flashcards', label: 'Flashcards', icon: BookOpen, description: 'Memorize key concepts' },
  { href: '/dashboard/games', label: 'Brain Games', icon: Puzzle, description: 'Fun challenges to sharpen mind' },
  { href: '/dashboard/music', label: 'Focus Music', icon: Music, description: 'Instrumental tracks for study' },
];

function QuoteRotator() {
    const [quoteIndex, setQuoteIndex] = React.useState(0);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <p className="text-center text-sm italic text-muted-foreground transition-opacity duration-1000">
            &ldquo;{quotes[quoteIndex]}&rdquo;
        </p>
    );
}

export default function Dashboard() {
  return (
    <>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 rounded-lg bg-card border">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold font-headline tracking-tighter">Meet Your Personal AI Study Assistant</h1>
          <p className="text-muted-foreground max-w-lg">Master any subject with an AI tutor that understands your pace and your goals. Let&apos;s get started.</p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/pomodoro">
              <Timer className="mr-2 h-4 w-4"/> Go Study
            </Link>
          </Button>
        </div>
        <div className="w-40 h-40 md:w-48 md:h-48">
          <Mascot />
        </div>
      </div>
      
      <div className="my-6">
        <QuoteRotator />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tools.map((tool) => (
          <Link href={tool.href} key={tool.href}>
            <Card className="h-full hover:bg-accent hover:border-primary/50 transition-all transform hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <div className="p-2 bg-primary/10 rounded-lg">
                   <tool.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>{tool.label}</CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
