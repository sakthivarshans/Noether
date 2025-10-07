'use client';

import { Button } from '@/components/ui/button';
import Mascot from '@/components/mascot';
import { useRouter } from 'next/navigation';
import { Chrome } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = () => {
    // Placeholder for Firebase Google OAuth
    // On successful login, redirect to dashboard
    router.push('/dashboard');
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto w-48">
          <Mascot />
        </div>
        <h1 className="mt-8 font-headline text-5xl font-bold text-foreground">
          Noether
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Simply and Lovely Learning
        </p>
        <p className="mt-8 text-foreground">
          Meet your personal AI study assistant. Master any subject with an AI
          tutor that understands your pace and your goals.
        </p>
        <Button
          onClick={handleLogin}
          className="mt-12 w-full max-w-xs"
          size="lg"
        >
          <Chrome className="mr-2 h-5 w-5" />
          Sign in with Google
        </Button>
      </div>
      <footer className="absolute bottom-4 text-center text-sm text-muted-foreground">
        <p>Built for the Google Hackathon.</p>
      </footer>
    </div>
  );
}
