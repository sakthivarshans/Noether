import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SudokuPage() {
  return (
    <div className="flex items-center justify-center">
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Sudoku</CardTitle>
                <CardDescription>This game is under construction.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-center text-muted-foreground">Check back later for a fun Sudoku puzzle!</p>
            </CardContent>
        </Card>
    </div>
  );
}
