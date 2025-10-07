'use client';
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGameScores } from '@/context/GameScoreContext';
import { cn } from '@/lib/utils';
import { Brain, Check, Eraser, Lightbulb, Play, RefreshCw, Timer, X } from 'lucide-react';

type Difficulty = 'easy' | 'medium' | 'hard';

// --- Sudoku Logic ---

// Basic Sudoku solver using backtracking
function solve(board: number[][]): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (solve(board)) {
              return true;
            }
            board[row][col] = 0; // backtrack
          }
        }
        return false;
      }
    }
  }
  return true;
}

function isValid(board: number[][], row: number, col: number, num: number): boolean {
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num || board[x][col] === num || board[3 * Math.floor(row / 3) + Math.floor(x / 3)][3 * Math.floor(col / 3) + x % 3] === num) {
      return false;
    }
  }
  return true;
}

function generatePuzzle(difficulty: Difficulty): [number[][], number[][]] {
  const board = Array(9).fill(0).map(() => Array(9).fill(0));
  
  // Fill the diagonal 3x3 matrices
  fillDiagonal(board);

  // Fill remaining cells
  fillRemaining(board, 0, 3);
  
  const solution = JSON.parse(JSON.stringify(board));

  // Remove digits to create the puzzle
  let attempts: number;
  switch (difficulty) {
    case 'medium':
      attempts = 45;
      break;
    case 'hard':
      attempts = 55;
      break;
    case 'easy':
    default:
      attempts = 35;
      break;
  }

  while (attempts > 0) {
    // Math.random() is safe here as this is a client component
    let row = Math.floor(Math.random() * 9);
    let col = Math.floor(Math.random() * 9);
    if (board[row][col] !== 0) {
      board[row][col] = 0;
      attempts--;
    }
  }

  return [board, solution];
}

function fillDiagonal(board: number[][]) {
  for (let i = 0; i < 9; i = i + 3) {
    fillBox(board, i, i);
  }
}

function fillBox(board: number[][], row: number, col: number) {
  let num;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      do {
        // Math.random() is safe here as this is a client component
        num = Math.floor(Math.random() * 9) + 1;
      } while (!isSafeInBox(board, row, col, num));
      board[row + i][col + j] = num;
    }
  }
}

function isSafeInBox(board: number[][], row: number, col: number, num: number): boolean {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[row + i][col + j] === num) {
        return false;
      }
    }
  }
  return true;
}

function fillRemaining(board: number[][], i: number, j: number): boolean {
    if (j >= 9 && i < 8) {
        i = i + 1;
        j = 0;
    }
    if (i >= 9 && j >= 9) {
        return true;
    }

    if (i < 3) {
        if (j < 3) {
            j = 3;
        }
    } else if (i < 6) {
        if (j === Math.floor(i / 3) * 3) {
            j = j + 3;
        }
    } else {
        if (j === 6) {
            i = i + 1;
            j = 0;
            if (i >= 9) {
                return true;
            }
        }
    }

    for (let num = 1; num <= 9; num++) {
        if (isSafe(board, i, j, num)) {
            board[i][j] = num;
            if (fillRemaining(board, i, j + 1)) {
                return true;
            }
            board[i][j] = 0;
        }
    }
    return false;
}

function isSafe(board: number[][], i: number, j: number, num: number): boolean {
    return (
        isSafeInRow(board, i, num) &&
        isSafeInCol(board, j, num) &&
        isSafeInBox(board, i - (i % 3), j - (j % 3), num)
    );
}

function isSafeInRow(board: number[][], i: number, num: number): boolean {
    for (let k = 0; k < 9; k++) {
        if (board[i][k] === num) {
            return false;
        }
    }
    return true;
}

function isSafeInCol(board: number[][], j: number, num: number): boolean {
    for (let i = 0; i < 9; i++) {
        if (board[i][j] === num) {
            return false;
        }
    }
    return true;
}

export default function SudokuPage() {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [puzzle, setPuzzle] = useState<number[][] | null>(null);
  const [solution, setSolution] = useState<number[][] | null>(null);
  const [board, setBoard] = useState<number[][] | null>(null);
  const [initialPuzzle, setInitialPuzzle] = useState<number[][] | null>(null);
  const [selectedCell, setSelectedCell] = useState<{ row: number, col: number } | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [errors, setErrors] = useState(0);
  const [time, setTime] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const { addScore } = useGameScores();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isStarted && !isWon) {
      timer = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isStarted, isWon]);

  const startNewGame = useCallback(() => {
    const [newPuzzle, newSolution] = generatePuzzle(difficulty);
    setPuzzle(newPuzzle);
    setSolution(newSolution);
    setBoard(JSON.parse(JSON.stringify(newPuzzle)));
    setInitialPuzzle(JSON.parse(JSON.stringify(newPuzzle)));
    setIsStarted(true);
    setIsWon(false);
    setErrors(0);
    setTime(0);
    setSelectedCell(null);
  }, [difficulty]);
  
  const checkWin = useCallback((currentBoard: number[][]) => {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (currentBoard[r][c] === 0) return false;
      }
    }
    setIsWon(true);
    const timePenalty = Math.floor(time / 60);
    const errorPenalty = errors * 5;
    const difficultyMultiplier = { easy: 1, medium: 2, hard: 3 };
    const score = Math.max(10, (100 - timePenalty - errorPenalty) * difficultyMultiplier[difficulty]);
    addScore('sudoku', score);
    setIsStarted(false);
  }, [time, errors, addScore, difficulty]);


  const handleCellClick = (row: number, col: number) => {
    if (isStarted && initialPuzzle && initialPuzzle[row][col] === 0) {
      setSelectedCell({ row, col });
    }
  };

  const handleNumberInput = (num: number) => {
    if (!selectedCell || !board || !solution) return;
    const { row, col } = selectedCell;

    const newBoard = JSON.parse(JSON.stringify(board));
    newBoard[row][col] = num;
    
    if (solution[row][col] !== num) {
      setErrors(errors + 1);
    }

    setBoard(newBoard);
    checkWin(newBoard);
  };
  
  const handleErase = () => {
    if (!selectedCell || !board) return;
    const { row, col } = selectedCell;
    const newBoard = JSON.parse(JSON.stringify(board));
    newBoard[row][col] = 0;
    setBoard(newBoard);
  }
  
  const handleHint = () => {
    if (!selectedCell || !board || !solution) return;
    const { row, col } = selectedCell;
    const newBoard = JSON.parse(JSON.stringify(board));
    newBoard[row][col] = solution[row][col];
    setBoard(newBoard);
    checkWin(newBoard);
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline flex items-center justify-center gap-2"><Brain className="w-8 h-8"/>Sudoku</CardTitle>
          <CardDescription>A classic logic puzzle to test your mind.</CardDescription>
        </CardHeader>
        <CardContent>
          {!isStarted ? (
            <div className="flex flex-col items-center gap-4 py-10">
              {isWon && (
                <div className="text-center mb-4 p-4 rounded-lg bg-green-100 dark:bg-green-900/50">
                    <h2 className="text-2xl font-bold text-green-700 dark:text-green-300">Congratulations!</h2>
                    <p className="text-green-600 dark:text-green-400">You solved the puzzle in {formatTime(time)} with {errors} errors.</p>
                </div>
              )}
              <h3 className="text-lg font-medium">Select Difficulty</h3>
              <Select value={difficulty} onValueChange={(value: Difficulty) => setDifficulty(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
              <Button size="lg" onClick={startNewGame}>
                <Play className="mr-2" /> New Game
              </Button>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              <div className="flex-shrink-0">
                <div className="grid grid-cols-9 bg-secondary dark:bg-background rounded-md p-1.5 gap-0.5">
                {(board || []).flat().map((cell, index) => {
                    const rIndex = Math.floor(index / 9);
                    const cIndex = index % 9;
                    return (
                      <div
                        key={`${rIndex}-${cIndex}`}
                        onClick={() => handleCellClick(rIndex, cIndex)}
                        className={cn(
                          'w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center text-lg lg:text-xl font-bold rounded-sm transition-colors duration-200',
                          'border-r border-b',
                          (cIndex + 1) % 3 === 0 && cIndex !== 8 ? 'border-r-2 border-r-muted-foreground/50' : 'border-r-muted-foreground/20',
                          (rIndex + 1) % 3 === 0 && rIndex !== 8 ? 'border-b-2 border-b-muted-foreground/50' : 'border-b-muted-foreground/20',
                          cIndex === 0 ? 'border-l-2 border-l-transparent' : '',
                          rIndex === 0 ? 'border-t-2 border-t-transparent' : '',
                          initialPuzzle && initialPuzzle[rIndex][cIndex] !== 0 ? 'bg-secondary text-foreground' : 'bg-background cursor-pointer hover:bg-accent',
                          selectedCell?.row === rIndex && selectedCell?.col === cIndex && 'bg-primary/20 ring-2 ring-primary',
                          board && solution && board[rIndex][cIndex] !== 0 && board[rIndex][cIndex] !== solution[rIndex][cIndex] && 'text-destructive'
                        )}
                      >
                        {cell !== 0 ? cell : ''}
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="w-full lg:w-auto flex flex-col gap-4">
                 <div className="flex justify-around items-center p-2 rounded-lg bg-secondary">
                     <div className="text-center"><div className="flex items-center gap-1 font-bold text-lg"><Timer className="w-5 h-5 text-primary"/>{formatTime(time)}</div><div className="text-xs text-muted-foreground">Time</div></div>
                     <div className="text-center"><div className="flex items-center gap-1 font-bold text-lg"><X className="w-5 h-5 text-destructive"/>{errors}</div><div className="text-xs text-muted-foreground">Errors</div></div>
                 </div>
                 <div className="grid grid-cols-5 gap-2">
                    {Array.from({ length: 9 }, (_, i) => i + 1).map(num => (
                        <Button key={num} variant="outline" size="icon" className="h-12 w-12 text-lg" onClick={() => handleNumberInput(num)}>{num}</Button>
                    ))}
                    <Button variant="outline" size="icon" className="h-12 w-12" onClick={handleErase}><Eraser /></Button>
                 </div>
                 <div className="flex flex-col gap-2">
                    <Button variant="secondary" onClick={handleHint}><Lightbulb className="mr-2"/>Get Hint</Button>
                    <Button variant="destructive" onClick={() => setIsStarted(false)}><RefreshCw className="mr-2"/>New Game</Button>
                 </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
