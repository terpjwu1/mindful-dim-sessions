
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipBack, Volume2, X } from 'lucide-react';
import { useMeditation } from '@/context/MeditationContext';
import { formatDuration, setGreyscale, setScreenBrightness } from '@/utils/brightness';
import DurationSelector from '@/components/DurationSelector';

const Session = () => {
  const { selectedMeditation, duration, isPlaying, setIsPlaying, isDimmed, setIsDimmed } = useMeditation();
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [volume, setVolume] = useState(80);
  const navigate = useNavigate();
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio when component mounts
  useEffect(() => {
    audioRef.current = new Audio(selectedMeditation?.audioUrl || '/meditations/body-scan.mp3');
    audioRef.current.addEventListener('canplaythrough', () => {
      setIsAudioReady(true);
    });
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, [selectedMeditation]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Reset timer when duration changes
  useEffect(() => {
    setTimeRemaining(duration);
  }, [duration]);

  // Handle play/pause
  useEffect(() => {
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.play();
      }
      
      // Apply screen dimming and grayscale when meditation starts
      setIsDimmed(true);
      setScreenBrightness(10); // dim to 10%
      setGreyscale(true);
      
      timerRef.current = window.setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            endMeditation();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, setIsDimmed]);

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      // Restore screen brightness and remove grayscale when leaving
      if (isDimmed) {
        setScreenBrightness(100);
        setGreyscale(false);
        setIsDimmed(false);
      }
    };
  }, [isDimmed, setIsDimmed]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const endMeditation = () => {
    setIsPlaying(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    // Restore screen settings
    setScreenBrightness(100);
    setGreyscale(false);
    setIsDimmed(false);
  };

  const resetSession = () => {
    setIsPlaying(false);
    setTimeRemaining(duration);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  const progress = (duration - timeRemaining) / duration * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex items-center justify-between p-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full" 
          onClick={() => {
            endMeditation();
            navigate('/');
          }}
        >
          <X size={20} />
        </Button>
      </div>
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 animate-fade-in">
        <div className="w-full max-w-xs text-center space-y-8">
          {/* Session circle */}
          <div className="relative mx-auto">
            <div 
              className="w-48 h-48 rounded-full bg-secondary flex items-center justify-center mx-auto"
              style={{
                background: `conic-gradient(var(--primary) ${progress}%, var(--secondary) 0%)`,
              }}
            >
              <div className="w-40 h-40 rounded-full bg-background flex flex-col items-center justify-center">
                <span className="text-3xl font-light">
                  {formatDuration(timeRemaining)}
                </span>
                <span className="text-sm text-muted-foreground mt-1">remaining</span>
              </div>
            </div>
          </div>
          
          {/* Controls */}
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full" 
                onClick={resetSession}
              >
                <SkipBack size={20} />
              </Button>
              <Button 
                size="lg" 
                className="rounded-full w-16 h-16 bg-primary hover:bg-primary/90"
                onClick={togglePlayPause}
                disabled={!isAudioReady}
              >
                {isPlaying ? (
                  <Pause size={24} />
                ) : (
                  <Play size={24} className="ml-1" />
                )}
              </Button>
            </div>
            
            {/* Title */}
            <div className="text-center mt-4">
              <h2 className="text-lg font-medium">
                {selectedMeditation?.title || 'Body Scan Meditation'}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {selectedMeditation?.description || 'A guided practice to connect with your body'}
              </p>
            </div>
            
            {/* Volume slider */}
            <div className="flex items-center gap-3 mt-6 px-2">
              <Volume2 size={16} className="text-muted-foreground" />
              <Slider
                value={[volume]}
                max={100}
                step={1}
                onValueChange={(value) => setVolume(value[0])}
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </main>
      
      {/* Duration selector */}
      {!isPlaying && (
        <div className="p-8 animate-slide-up">
          <DurationSelector className="mb-4" />
        </div>
      )}
    </div>
  );
};

export default Session;
