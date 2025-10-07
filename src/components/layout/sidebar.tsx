'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  BrainCircuit,
  Calendar,
  FileQuestion,
  Home,
  ListTodo,
  Mic,
  Music,
  Puzzle,
  Search,
  Timer,
  Upload,
  User,
  Bed,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Mascot from '@/components/mascot';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/dashboard/upload', label: 'Upload', icon: Upload },
  { href: '/dashboard/pyq', label: 'PYQ', icon: FileQuestion },
  { href: '/dashboard/notes', label: 'Voice Notes', icon: Mic },
  { href: '/dashboard/search', label: 'Topic Search', icon: Search },
];

const toolsItems = [
  { href: '/dashboard/timetable', label: 'Timetable', icon: Calendar },
  { href: '/dashboard/todo', label: 'To-Do List', icon: ListTodo },
  { href: '/dashboard/pomodoro', label: 'Pomodoro', icon: Timer },
  { href: '/dashboard/power-nap', label: 'Power Nap', icon: Bed },
  { href: '/dashboard/flashcards', label: 'Flashcards', icon: BookOpen },
  { href: '/dashboard/games', label: 'Games', icon: Puzzle },
  { href: '/dashboard/music', label: 'Music', icon: Music },
];

export function Sidebar() {
  const pathname = usePathname();

  const NavLink = ({ href, label, icon: Icon }: { href: string; label: string; icon: React.ElementType }) => (
    <li>
      <Link
        href={href}
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground hover:bg-accent',
          pathname === href && 'bg-accent text-foreground'
        )}
      >
        <Icon className="h-4 w-4" />
        {label}
      </Link>
    </li>
  );
  
  return (
    <div className="hidden border-r bg-card md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-headline font-semibold">
            <div className="w-8 h-8"><Mascot /></div>
            <span className="font-brand text-2xl text-primary">Noether</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-4 text-sm font-medium">
            <ul className="space-y-1">
              {navItems.map(item => <NavLink key={item.href} {...item} />)}
              <li className="px-3 py-2 text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider">Tools</li>
              {toolsItems.map(item => <NavLink key={item.href} {...item} />)}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
