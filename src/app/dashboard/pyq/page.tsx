'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Zap, Clipboard, Download, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const mockAnswers = `
### Question 1: What is the primary function of the mitochondria?

**Answer:** The primary function of the mitochondria is to generate most of the cell's supply of adenosine triphosphate (ATP), used as a source of chemical energy. This process is known as cellular respiration. Mitochondria are often referred to as the "powerhouses" of the cell.

---

### Question 2: Explain the difference between osmosis and diffusion.

**Answer:** 
*   **Diffusion** is the net movement of particles from an area of higher concentration to an area of lower concentration. This process does not require a semi-permeable membrane and applies to any type of particle, including solutes and solvents.
*   **Osmosis** is a specific type of diffusion that involves the movement of solvent molecules (usually water) across a semi-permeable membrane from a region of higher solvent concentration to a region of lower solvent concentration.

In essence, osmosis is the diffusion of water across a membrane.

---

### Question 3: Describe the three laws of motion proposed by Isaac Newton.

**Answer:**
1.  **First Law (Law of Inertia):** An object at rest stays at rest and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an unbalanced force.
2.  **Second Law (Law of Acceleration):** The acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass. (F = ma).
3.  **Third Law (Law of Action-Reaction):** For every action, there is an equal and opposite reaction.

`;


export default function PYQPage() {
  const [text, setText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!text) return;
    setIsProcessing(true);
    // Placeholder for Gemini API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setResult(mockAnswers);
    setIsProcessing(false);
  };
  
  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    toast({
      title: 'Copied to clipboard!',
      description: 'The generated answers have been copied.',
    });
  };

  const handleDownload = () => {
    if (!result) return;
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pyq_answers.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>PYQ Answer Generator</CardTitle>
          <CardDescription>Paste the content of a PYQ file (or upload it) to get detailed, AI-generated answers.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste your questions here..."
            className="min-h-[200px] text-base"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex flex-col sm:flex-row gap-2">
            <Button className="w-full sm:w-auto">
              <Upload className="mr-2 h-4 w-4" /> Upload File
            </Button>
            <Button onClick={handleGenerate} disabled={!text || isProcessing} className="w-full sm:w-auto">
              {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
              {isProcessing ? 'Generating...' : 'Generate Answers'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Generated Answers</CardTitle>
              <CardDescription>Here are the detailed answers for your questions.</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={handleCopy}><Clipboard className="h-4 w-4" /></Button>
              <Button variant="outline" size="icon" onClick={handleDownload}><Download className="h-4 w-4" /></Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none p-4 bg-secondary rounded-lg">
              <pre className="whitespace-pre-wrap bg-transparent p-0 font-body">{result}</pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
