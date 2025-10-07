'use client';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Mic, MicOff, Square, Download, Copy, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function VoiceNotesPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [interimText, setInterimText] = useState('');
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let finalTranscript = '';
          let interimTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
          setTranscribedText(prev => prev + finalTranscript);
          setInterimText(interimTranscript);
        };
        
        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleToggleRecording = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Browser Not Supported",
        description: "Your browser does not support voice recognition.",
        variant: "destructive",
      });
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      setTranscribedText('');
      setInterimText('');
      recognitionRef.current.start();
    }
    setIsRecording(!isRecording);
  };
  
  const handleDownload = (format: 'txt' | 'docx') => {
    if (!transcribedText) return;
    let blob;
    let filename;
    if (format === 'txt') {
        blob = new Blob([transcribedText], { type: 'text/plain' });
        filename = 'note.txt';
    } else {
        // A simple "polyfill" for docx
        const content = `<!DOCTYPE html><html><head><meta charset='UTF-8'></head><body>${transcribedText.replace(/\n/g, '<br>')}</body></html>`;
        blob = new Blob([content], { type: 'application/msword' });
        filename = 'note.docx';
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    if (!transcribedText) return;
    navigator.clipboard.writeText(transcribedText);
    toast({
      title: 'Note copied to clipboard!',
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Voice-to-Text Notes</CardTitle>
          <CardDescription>Click "Start Recording" to begin transcribing your voice in real-time.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <Button size="lg" onClick={handleToggleRecording}>
              {isRecording ? <><MicOff className="mr-2 h-5 w-5" /> Stop Recording</> : <><Mic className="mr-2 h-5 w-5" /> Start Recording</>}
            </Button>
          </div>
          <Textarea
            placeholder="Your transcribed notes will appear here..."
            className="min-h-[300px] text-base"
            value={transcribedText + interimText}
            onChange={e => setTranscribedText(e.target.value)}
          />
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="secondary" className="w-full sm:w-auto" onClick={() => handleDownload('txt')}>
              <Download className="mr-2 h-4 w-4" /> Download as .txt
            </Button>
            <Button variant="secondary" className="w-full sm:w-auto" onClick={() => handleDownload('docx')}>
              <Download className="mr-2 h-4 w-4" /> Download as .docx
            </Button>
            <Button variant="secondary" className="w-full sm:w-auto" onClick={handleCopy}>
              <Copy className="mr-2 h-4 w-4" /> Copy Text
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
