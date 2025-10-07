import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function MemoryGamePage() {
  return (
    <div className="flex items-center justify-center">
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Memory Game</CardTitle>
                <CardDescription>This game is under construction.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-center text-muted-foreground">Check back later to test your memory!</p>
            </CardContent>
        </Card>
    </div>
  );
}
