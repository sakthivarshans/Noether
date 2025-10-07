'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Loader2, ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const mockResults = [
  { title: "Newton's laws of motion | Definition, Examples, & History", description: "Newton's laws of motion, three statements describing the relations between the forces acting on a body and the motion of the body, first formulated by English physicist and mathematician Isaac Newton.", link: '#' },
  { title: "Newton's Laws of Motion - NASA", description: "NASA's beginner-friendly guide to understanding Newton's three laws of motion with real-world examples from space exploration.", link: '#' },
  { title: "What are Newton's three laws of motion? - The Physics Classroom", description: "An in-depth explanation of each law, including formulas and interactive simulations to help students grasp the concepts.", link: '#' },
  { title: "Khan Academy: Newton's laws of motion", description: "Free videos, articles, and practice exercises on Newton's laws of motion. Learn for free about math, art, computer programming, economics, physics, chemistry, biology, medicine, finance, history, and more.", link: '#' },
  { title: "Simple Explanation of Newton's 3 Laws of Motion - BYJU'S", description: "A simplified breakdown of the laws, perfect for quick revision and understanding the core principles.", link: '#' },
];

export default function SearchPage() {
  const [query, setQuery] = useState("Newton's Laws of Motion");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<typeof mockResults | null>(null);

  const handleSearch = async () => {
    if (!query) return;
    setIsSearching(true);
    // Placeholder for API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setResults(mockResults);
    setIsSearching(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Enhanced Topic Search</CardTitle>
          <CardDescription>Enter a topic to get a summarized list of the top 5 search results from the web.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex w-full items-center space-x-2">
            <Input
              type="text"
              placeholder="e.g., Quantum Physics, Cellular Respiration"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {results && (
        <Card>
          <CardHeader>
            <CardTitle>Top Results for &ldquo;{query}&rdquo;</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {results.map((result, index) => (
                <li key={index} className="p-4 rounded-lg border hover:bg-accent transition-colors">
                  <Link href={result.link} target="_blank" rel="noopener noreferrer" className="group">
                    <h3 className="font-semibold text-lg text-primary group-hover:underline flex items-center">
                      {result.title}
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </h3>
                    <p className="text-muted-foreground mt-1">{result.description}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
