'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { musicTracks } from '@/lib/data';
import { Play, Pause, SkipForward, Music, Volume2 } from 'lucide-react';
import Image from 'next/image';

export default function MusicPage() {
  const [currentTrack, setCurrentTrack] = useState(musicTracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  // In a real app, you would use an <audio> element and manage its state.
  // This is a UI-only mock.

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    const currentIndex = musicTracks.findIndex(t => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % musicTracks.length;
    setCurrentTrack(musicTracks[nextIndex]);
    setIsPlaying(true);
  };
  
  const handleSelectTrack = (track: typeof musicTracks[0]) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Focus Music Player</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <div className="relative w-48 h-48 mx-auto rounded-lg overflow-hidden shadow-lg">
                <Image src="https://picsum.photos/seed/music/200/200" alt="Album art" fill style={{objectFit: 'cover'}} data-ai-hint="music album" />
                <div className="absolute inset-0 bg-black/20"></div>
            </div>
            <div>
              <h2 className="text-2xl font-bold font-headline">{currentTrack.title}</h2>
              <p className="text-muted-foreground">{currentTrack.artist}</p>
            </div>
            <div className="flex items-center justify-center gap-4">
              <Button size="icon" variant="ghost" className="rounded-full h-16 w-16">
                <Volume2 className="h-6 w-6" />
              </Button>
              <Button size="icon" variant="ghost" className="rounded-full h-20 w-20" onClick={handlePlayPause}>
                {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
              </Button>
              <Button size="icon" variant="ghost" className="rounded-full h-16 w-16" onClick={handleNext}>
                <SkipForward className="h-6 w-6" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Playlist</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {musicTracks.map(track => (
                <li key={track.id}>
                  <button onClick={() => handleSelectTrack(track)} className={`w-full text-left p-3 rounded-lg flex justify-between items-center transition-colors ${currentTrack.id === track.id ? 'bg-primary/10 text-primary' : 'hover:bg-accent'}`}>
                    <div>
                      <p className="font-medium">{track.title}</p>
                      <p className="text-sm text-muted-foreground">{track.artist}</p>
                    </div>
                    {currentTrack.id === track.id && isPlaying ? <Music className="h-4 w-4 animate-pulse" /> : <p className="text-sm text-muted-foreground">{track.duration}</p>}
                  </button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
