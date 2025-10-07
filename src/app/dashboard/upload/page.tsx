'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Upload, FileText, Zap, BrainCircuit, BarChart3, Loader2 } from 'lucide-react';
import { summarizeAndHighlightDocument, SummarizeAndHighlightDocumentOutput } from '@/ai/flows/summarize-and-highlight-document';
import { generateFlashcardsFromDocument } from '@/ai/flows/generate-flashcards-from-document';

export default function UploadPage() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileDataUri, setFileDataUri] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<SummarizeAndHighlightDocumentOutput | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setResult(null);
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        setFileDataUri(loadEvent.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!fileDataUri) return;
    setIsProcessing(true);
    try {
        const response = await summarizeAndHighlightDocument({ documentDataUri: fileDataUri });
        setResult(response);
    } catch (e) {
        console.error(e);
        // You might want to show a toast notification here
    } finally {
        setIsProcessing(false);
    }
  };
  
  const handleGenerateFlashcards = async () => {
    if(!result || !result.summary) return;

    try {
      const flashcardResult = await generateFlashcardsFromDocument({ documentContent: result.summary });
      // For now, let's just log the result. 
      // In a real implementation, you'd want to display these flashcards.
      console.log(flashcardResult);
      alert(`${flashcardResult.flashcards.length} flashcards generated! Check the console.`);
    } catch (e) {
      console.error(e);
      alert('Failed to generate flashcards.');
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Document</CardTitle>
          <CardDescription>Upload a .pptx or .pdf file to get an AI-powered summary, highlights, and flashcards.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-full">
            <label htmlFor="file-upload" className="flex items-center justify-center w-full h-32 px-4 transition bg-background border-2 border-dashed rounded-md appearance-none cursor-pointer hover:border-primary">
              <span className="flex items-center space-x-2">
                <Upload className="w-6 h-6 text-muted-foreground" />
                <span className="font-medium text-muted-foreground">
                  {fileName || "Drag & drop a file or click to upload"}
                </span>
              </span>
              <Input id="file-upload" name="file-upload" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.pptx" />
            </label>
          </div>
          <Button onClick={handleUpload} disabled={!fileName || isProcessing} className="w-full sm:w-auto">
            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
            {isProcessing ? 'Processing...' : 'Generate Insights'}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" /> Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{result.summary}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Zap className="w-5 h-5" /> Key Highlights</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                {result.highlights.map((highlight, index) => (
                  <li key={index}>{highlight}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle className="flex items-center gap-2"><BrainCircuit className="w-5 h-5" /> Generated Flashcards</CardTitle>
              <Button onClick={handleGenerateFlashcards} variant="outline" size="sm">Generate New</Button>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {result.flashcards.map((flashcard, index) => (
                <Card key={index} className="bg-secondary">
                  <CardHeader>
                    <CardTitle className="text-sm">Q: {flashcard}</CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </CardContent>
          </Card>

          {result.flowchart && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5" /> Flowchart</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-secondary rounded-lg">
                  <p className="font-mono text-sm text-muted-foreground whitespace-pre-wrap">{result.flowchart}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
