'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Waypoints, Loader2, ListOrdered, CheckCircle } from 'lucide-react';
import { generateLearningRoadmap, GenerateLearningRoadmapOutput } from '@/ai/flows/generate-learning-roadmap';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function RoadmapPage() {
  const [topic, setTopic] = useState('Quantum Computing');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GenerateLearningRoadmapOutput | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!topic) return;
    setIsGenerating(true);
    setResult(null);
    try {
      const response = await generateLearningRoadmap({ topic });
      setResult(response);
    } catch (e) {
      console.error(e);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Could not generate the learning roadmap.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Learning Roadmap Generator</CardTitle>
          <CardDescription>Enter a topic to generate a structured learning path, just like a NeetCode roadmap.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex w-full items-center space-x-2">
            <Input
              type="text"
              placeholder="e.g., Machine Learning, Data Structures"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            />
            <Button onClick={handleGenerate} disabled={isGenerating || !topic}>
              {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Waypoints className="h-4 w-4" />}
              <span className="hidden sm:inline ml-2">Generate Roadmap</span>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {isGenerating && (
          <div className="flex justify-center items-center p-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-4 text-muted-foreground">Building your roadmap... this might take a moment.</p>
          </div>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Your Learning Roadmap for &ldquo;{topic}&rdquo;</CardTitle>
            <CardDescription>Follow these steps to master the topic. Each section builds upon the last.</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" defaultValue={result.roadmap.map(section => section.title)} className="w-full">
              {result.roadmap.map((section, sectionIndex) => (
                <AccordionItem value={section.title} key={sectionIndex}>
                  <AccordionTrigger className="text-xl font-bold font-headline hover:no-underline">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary font-bold text-lg">
                        {sectionIndex + 1}
                      </div>
                      {section.title}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pl-14">
                    <ol className="relative border-l border-border space-y-6 pl-6 py-4">
                      {section.steps.map((step, stepIndex) => (
                        <li key={stepIndex}>
                          <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-secondary ring-8 ring-background">
                            <ListOrdered className="h-3 w-3 text-muted-foreground" />
                          </span>
                          <h3 className="font-semibold text-foreground">{step.title}</h3>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        </li>
                      ))}
                        <li key="done">
                           <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-green-200 ring-8 ring-background dark:bg-green-900">
                            <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-400" />
                          </span>
                          <h3 className="font-semibold text-green-600 dark:text-green-400">Section Complete!</h3>
                        </li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
