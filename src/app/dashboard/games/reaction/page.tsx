'use client';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePoints } from '@/context/PointsContext';
import { Zap, Pointer, MousePointerClick, RefreshCw, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

type GameState = 'waiting' | 'ready' | 'clicked' | 'tooSoon';

export default function ReactionTimeGamePage() {
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [reactionTime, setReactionTime] = useState(0);
  const [points, setPoints] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef(0);
  const { addPoints } = usePoints();

  const startGame = () => {
    setGameState('waiting');
    setReactionTime(0);
    setPoints(0);
    const randomDelay = Math.random() * 3000 + 1000; // 1-4 seconds
    timerRef.current = setTimeout(() => {
      setGameState('ready');
      startTimeRef.current = Date.now();
    }, randomDelay);
  };

  const handleClick = () => {
    if (gameState === 'waiting') {
      if (timerRef.current) clearTimeout(timerRef.current);
      setGameState('tooSoon');
    } else if (gameState === 'ready') {
      const endTime = Date.now();
      const time = endTime - startTimeRef.current;
      const calculatedPoints = Math.max(1, Math.round(500 / time * 10));

      setReactionTime(time);
      setPoints(calculatedPoints);
      addPoints(calculatedPoints);
      setGameState('clicked');
    }
  };

  const resetGame = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    startGame();
  };

  useEffect(() => {
    startGame();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const getCardContent = () => {
    switch (gameState) {
      case 'waiting':
        return (
          <div className="text-center">
            <Pointer className="mx-auto h-16 w-16 text-muted-foreground" />
            <h2 className="mt-4 text-2xl font-bold">Get Ready...</h2>
            <p className="text-muted-foreground">Click when the screen turns green.</p>
          </div>
        );
      case 'ready':
        return (
          <div className="text-center">
            <MousePointerClick className="mx-auto h-16 w-16 text-white" />
            <h2 className="mt-4 text-2xl font-bold text-white">Click Now!</h2>
          </div>
        );
      case 'tooSoon':
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-destructive">Too Soon!</h2>
            <p className="text-muted-foreground">You clicked before the screen turned green.</p>
            <Button onClick={resetGame} className="mt-6">
              <RefreshCw className="mr-2 h-4 w-4" /> Try Again
            </Button>
          </div>
        );
      case 'clicked':
        return (
          <div className="text-center">
            <Zap className="mx-auto h-16 w-16 text-primary" />
            <h2 className="mt-4 text-3xl font-bold">{reactionTime}ms</h2>
            <p className="text-muted-foreground">That's your reaction time!</p>
            <div className="mt-4 flex items-center justify-center gap-2 text-lg font-medium text-green-500">
                <Award className="h-5 w-5" />
                <span>You earned {points} points!</span>
            </div>
            <Button onClick={resetGame} className="mt-6">
              <RefreshCw className="mr-2 h-4 w-4" /> Play Again
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="flex items-center justify-center">
      <Card
        onClick={handleClick}
        className={cn(
          'w-full max-w-2xl h-96 cursor-pointer transition-colors duration-200',
          gameState === 'ready' && 'bg-green-500',
          gameState === 'tooSoon' && 'bg-destructive/10'
        )}
      >
        <CardHeader className={cn(gameState === 'ready' && 'hidden')}>
            <CardTitle className="text-2xl font-headline">Reaction Time Test</CardTitle>
            <CardDescription>Click as fast as you can when the box turns green.</CardDescription>
        </CardHeader>
        <CardContent className="flex h-full items-center justify-center pt-0">
          {getCardContent()}
        </CardContent>
      </Card>
    </div>
  );
}
