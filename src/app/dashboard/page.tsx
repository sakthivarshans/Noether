'use client';

import {
  BookOpen,
  Calendar,
  FileQuestion,
  ListTodo,
  Mic,
  Music,
  Puzzle,
  Search,
  Timer,
  Upload,
} from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import Mascot from '@/components/mascot';
import { Button } from '@/components/ui/button';
import { quotes } from '@/lib/data';
import React from 'react';

const tools = [
  { href: '/dashboard/upload', label: 'Upload Document', icon: Upload, description: 'Upload PPT/PDF for AI summaries and flashcards' },
  { href: '/dashboard/timetable', label: 'Timetable', icon: Calendar, description: 'Generate your personalized study schedule' },
  { href: '/dashboard/todo', label: 'To-Do List', icon: ListTodo, description: 'Track assignments and deadlines' },
  { href: '/dashboard/flashcards', label: 'Flashcards', icon: BookOpen, description: 'Review with AI-generated flashcards' },
  { href: '/dashboard/games', label: 'Games', icon: Puzzle, description: 'Take a brain break with fun games' },
  { href: '/dashboard/music', label: 'Focus Music', icon: Music, description: 'Listen to concentration-boosting tracks' },
  { href: '/dashboard/pyq', label: 'PYQ Answers', icon: FileQuestion, description: 'Get AI-generated answers for past papers' },
  { href: '/dashboard/pomodoro', label: 'Pomodoro', icon: Timer, description: 'Stay focused with 25-minute sessions' },
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
      
      <div className="text-center my-8">
        <h2 className="text-2xl font-bold font-headline mb-2 text-foreground/80">Your Study Tools</h2>
        <QuoteRotator />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tools.map((tool, index) => (
          <Link href={tool.href} key={tool.href}>
            <Card className="group h-full p-6 text-center flex flex-col items-center justify-center rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20">
              <div 
                className={`absolute inset-0 rounded-2xl opacity-80 group-hover:opacity-100 transition-opacity duration-300 ${index % 3 === 0 ? 'bg-gradient-to-br from-purple-100 to-blue-100' : index % 3 === 1 ? 'bg-gradient-to-br from-green-100 to-cyan-100' : 'bg-gradient-to-br from-purple-100 to-pink-100'} dark:from-purple-900/20 dark:to-blue-900/20`}>
              </div>
              <div className="relative flex flex-col items-center justify-center">
                  <div className="p-4 bg-white/50 dark:bg-black/20 rounded-full mb-4">
                    <tool.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg text-foreground">{tool.label}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{tool.description}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
