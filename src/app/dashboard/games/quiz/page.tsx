'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Check, X, Award } from 'lucide-react';
import { usePoints } from '@/context/PointsContext';

const generateProblem = () => {
  const operators = ['+', '-', '×'];
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
  const { addPoints } = usePoints();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userAnswer === problem.answer) {
      setFeedback('correct');
      addPoints(10);
    } else {
      setFeedback('incorrect');
    }
    setQuestionsAnswered(questionsAnswered + 1);

    setTimeout(() => {
      setProblem(generateProblem());
      setUserAnswer('');
      setFeedback(null);
    }, 1500);
  };

  return (
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Math Quiz</CardTitle>
          <CardDescription>Solve the problem to earn points!</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <div className="text-4xl font-bold font-mono tracking-widest p-6 bg-secondary rounded-lg">
            {problem.question} = ?
          </div>

          <form onSubmit={handleSubmit} className="w-full flex items-center space-x-2">
            <Input
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
              <span className="font-bold">Correct! +10 points</span>
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
