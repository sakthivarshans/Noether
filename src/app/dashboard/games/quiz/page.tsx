'use client';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Check, X, Award, Timer } from 'lucide-react';
import { useGameScores } from '@/context/GameScoreContext';
import { Progress } from '@/components/ui/progress';

const TIME_LIMIT = 10; // 10 seconds per question

const generateProblem = () => {
  const operators = ['+', '-', '×'];
  // Math.random() is not safe to use on server, but this is a client component
  // so it's fine.
  const operator = operators[Math.floor(Math.random() * operators.length)];
  let num1, num2, answer;

  switch (operator) {
    case '+':
      num1 = Math.floor(Math.random() * 20) + 1;
      num2 = Math.floor(Math.random() * 20) + 1;
      answer = num1 + num2;
      break;
    case '-':
      num1 = Math.floor(Math.random() * 20) + 10;
      num2 = Math.floor(Math.random() * 10) + 1;
      answer = num1 - num2;
      break;
    case '×':
      num1 = Math.floor(Math.random() * 10) + 2;
      num2 = Math.floor(Math.random() * 10) + 2;
      answer = num1 * num2;
      break;
    default: // Should not happen
      num1 = 1;
      num2 = 1;
      answer = 2;
  }
  return { question: `${num1} ${operator} ${num2}`, answer: String(answer) };
};

export default function MathQuizPage() {
  const [problem, setProblem] = useState(generateProblem());
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const { addScore } = useGameScores();
  const inputRef = useRef<HTMLInputElement>(null);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [pointsAwarded, setPointsAwarded] = useState(0);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(TIME_LIMIT);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
  };

  const nextQuestion = () => {
    setProblem(generateProblem());
    setUserAnswer('');
    setFeedback(null);
    setPointsAwarded(0);
    startTimer();
  };

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      setFeedback('incorrect');
      setTimeout(nextQuestion, 1500);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  useEffect(() => {
    if (!feedback && inputRef.current) {
      inputRef.current.focus();
    }
  }, [problem, feedback]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (timerRef.current) clearInterval(timerRef.current);
    
    const points = timeLeft;
    

    if (userAnswer === problem.answer) {
      setFeedback('correct');
      setPointsAwarded(points);
      addScore('quiz', points);
    } else {
      setFeedback('incorrect');
    }
    setQuestionsAnswered(questionsAnswered + 1);

    setTimeout(nextQuestion, 1500);
  };

  return (
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Math Quiz</CardTitle>
          <CardDescription>Solve the problem to earn points!</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <div className="w-full space-y-3">
              <div className="flex justify-center items-center gap-2 text-muted-foreground">
                  <Timer className="w-5 h-5"/>
                  <span>Time Left: {timeLeft}s</span>
              </div>
              <Progress value={(timeLeft / TIME_LIMIT) * 100} className="h-2" />
          </div>

          <div className="text-4xl font-bold font-mono tracking-widest p-6 bg-secondary rounded-lg">
            {problem.question} = ?
          </div>

          <form onSubmit={handleSubmit} className="w-full flex items-center space-x-2">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Your answer"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={!!feedback}
              className="text-center text-lg"
            />
            <Button type="submit" disabled={!userAnswer || !!feedback}>
              Submit
            </Button>
          </form>

          {feedback === 'correct' && (
            <div className="flex items-center text-green-500 gap-2">
              <Check className="h-6 w-6" />
              <span className="font-bold">Correct! +{pointsAwarded} points</span>
              <Award className="h-5 w-5" />
            </div>
          )}
          {feedback === 'incorrect' && (
            <div className="flex items-center text-destructive gap-2">
              <X className="h-6 w-6" />
              <span className="font-bold">Incorrect. The answer was {problem.answer}.</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
