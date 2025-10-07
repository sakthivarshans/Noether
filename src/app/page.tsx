'use client';

import { Button } from '@/components/ui/button';
import Mascot from '@/components/mascot';
import { useRouter } from 'next/navigation';
import { Play, User } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/dashboard');
  };

  return (
    <div className="flex h-screen w-full flex-col bg-background">
      <header className="absolute top-0 left-0 right-0 p-4 sm:p-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="font-headline text-2xl font-bold text-foreground">
              Noether
            </h1>
            <p className="text-sm text-muted-foreground">
              Simple and Lovely Learning
            </p>
          </div>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/dashboard/profile">
                <User className="mr-2 h-4 w-4" /> Profile
              </Link>
            </Button>
            <Button variant="outline" onClick={handleLogin}>
              Sign In
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center p-4 text-center">
        <div className="mx-auto w-40 sm:w-48">
          <Mascot />
        </div>
        <h2 className="mt-8 bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text font-headline text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl lg:text-6xl">
          Meet Your Personal AI Study Assistant
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
          Master any subject with an AI tutor that understands your pace and
          your goals.
        </p>
        <Button
          onClick={handleLogin}
          className="mt-10 group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 px-8 py-3 font-medium text-white transition-all duration-300 hover:scale-105"
          size="lg"
        >
          <Play className="mr-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          Start Studying Now
        </Button>
      </main>

      <footer className="py-4 text-center text-sm text-muted-foreground">
        <p>Built for the Google Hackathon.</p>
      </footer>
    </div>
  );
}
