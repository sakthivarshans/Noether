import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { games } from '@/lib/data';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function GamesPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-headline text-3xl font-bold">Brain Games</h1>
        <p className="text-muted-foreground">Take a break and sharpen your mind with these fun games.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {games.map(game => (
          <Link href={`/dashboard/games/${game.id}`} key={game.id}>
            <Card className="group h-full flex flex-col justify-between hover:bg-accent hover:border-primary/50 transition-all transform hover:-translate-y-1">
              <div>
                <CardHeader>
                  <CardTitle>{game.name}</CardTitle>
                  <CardDescription>{game.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">High Score: 0</p>
                </CardContent>
              </div>
              <div className="p-6 pt-0">
                  <p className="text-sm font-medium text-primary flex items-center">
                    Play Now <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
