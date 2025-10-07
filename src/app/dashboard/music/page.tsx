
'use client';
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { musicTracks } from '@/lib/data';
import { Play, Pause, SkipForward, Music, Volume2, VolumeX } from 'lucide-react';
import Image from 'next/image';
import { Slider } from '@/components/ui/slider';

type MusicTrack = typeof musicTracks[0];

export default function MusicPage() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = musicTracks[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
        audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.load(); // Load the new track
        audioRef.current.play().catch(error => console.error("Error playing audio:", error));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);


  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % musicTracks.length);
    setIsPlaying(true);
  };
  
  const handleSelectTrack = (track: MusicTrack) => {
    const trackIndex = musicTracks.findIndex(t => t.id === track.id);
    setCurrentTrackIndex(trackIndex);
    setIsPlaying(true);
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if (isMuted) setIsMuted(false);
  }

  const handleMuteToggle = () => {
      setIsMuted(!isMuted);
  }

  const handleTrackEnded = () => {
      handleNext();
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
               <audio ref={audioRef} src={currentTrack.url} onEnded={handleTrackEnded} />
              <Button size="icon" variant="ghost" className="rounded-full h-16 w-16" onClick={handleMuteToggle}>
                {isMuted || volume === 0 ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
              </Button>
              <Button size="icon" variant="ghost" className="rounded-full h-20 w-20" onClick={handlePlayPause}>
                {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
              </Button>
              <Button size="icon" variant="ghost" className="rounded-full h-16 w-16" onClick={handleNext}>
                <SkipForward className="h-6 w-6" />
              </Button>
            </div>
            <div className="px-10">
              <Slider
                value={[isMuted ? 0 : volume]}
                max={1}
                min={0}
                step={0.05}
                onValueChange={handleVolumeChange}
                aria-label="Volume"
              />
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
