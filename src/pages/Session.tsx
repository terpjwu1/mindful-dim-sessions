import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipBack, Volume2, X } from 'lucide-react';
import { useMeditation } from '@/context/MeditationContext';
import { formatDuration, setGreyscale, setScreenBrightness, restoreOriginalSettings } from '@/utils/brightness';
import DurationSelector from '@/components/DurationSelector';
import { toast } from '@/components/ui/use-toast';

const Session = () => {
  const { selectedMeditation, duration, isPlaying, setIsPlaying, isDimmed, setIsDimmed } = useMeditation();
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(true);
  const [volume, setVolume] = useState(80);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const navigate = useNavigate();
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Reset state when component mounts or meditation changes
    setTimeRemaining(duration);
    setIsAudioReady(false);
    setIsAudioLoading(true);
    setAudioError(null);
    setLoadAttempts(0);
    
    // Clean up function will run when component unmounts
    return () => {
      if (isDimmed) {
        restoreOriginalSettings();
        setIsDimmed(false);
      }
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, [selectedMeditation?.id, isDimmed, setIsDimmed]);

  useEffect(() => {
    if (!selectedMeditation) return;
    
    const loadAudio = () => {
      let audioSrc = selectedMeditation.audioUrl;
      
      // Try alternative URL format if this is a retry attempt
      if (loadAttempts > 0) {
        const fileName = selectedMeditation.audioUrl.split('/').pop();
        if (fileName) {
          // First try the meditations subdirectory
          audioSrc = `https://self-compassion.org/wp-content/uploads/meditations/${fileName}`;
        }
      }
      
      // Additional fallback for third attempt
      if (loadAttempts > 1) {
        // Try without the meditations subdirectory as another alternative
        audioSrc = `https://self-compassion.org/wp-content/uploads/${selectedMeditation.title.toLowerCase().replace(/\s+/g, '-')}.mp3`;
      }
      
      console.log(`Loading audio from: ${audioSrc} (attempt ${loadAttempts + 1})`);
      
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeAttribute('src');
        audioRef.current.load();
      }
      
      const audio = new Audio();
      
      const handleCanPlay = () => {
        console.log('Audio is ready to play');
        setIsAudioReady(true);
        setIsAudioLoading(false);
        setAudioError(null);
      };
      
      const handleLoadStart = () => {
        console.log('Audio load started');
        setIsAudioLoading(true);
      };
      
      const handleError = (e: Event) => {
        const errorEvent = e as ErrorEvent;
        const errorDetail = errorEvent.message || 'Network or format error';
        console.error('Error loading audio:', e, errorDetail);
        setIsAudioLoading(false);
        setIsAudioReady(false);
        
        // Auto-retry with alternative URL if not the final attempt
        if (loadAttempts < 2) {
          setLoadAttempts(prev => prev + 1);
          
          toast({
            title: "Retrying Audio Load",
            description: `Loading failed, trying alternative source (${loadAttempts + 2}/3)`,
          });
          
          return;
        }
        
        setAudioError('Unable to load the meditation audio');
        
        toast({
          title: "Audio Error",
          description: "Unable to load the meditation audio. Please try again or try a different meditation.",
          variant: "destructive",
        });
        
        if (isPlaying) {
          setIsPlaying(false);
        }
      };
      
      audio.addEventListener('canplaythrough', handleCanPlay);
      audio.addEventListener('loadstart', handleLoadStart);
      audio.addEventListener('error', handleError);
      audio.addEventListener('abort', handleError);
      
      audio.volume = volume / 100;
      audio.crossOrigin = "anonymous"; // Try with CORS enabled
      audio.src = audioSrc;
      audio.load();
      
      audioRef.current = audio;
      
      return () => {
        audio.removeEventListener('canplaythrough', handleCanPlay);
        audio.removeEventListener('loadstart', handleLoadStart);
        audio.removeEventListener('error', handleError);
        audio.removeEventListener('abort', handleError);
        audio.pause();
        audio.src = '';
      };
    };
    
    return loadAudio();
  }, [selectedMeditation, loadAttempts, isPlaying, setIsPlaying, volume]);

  useEffect(() => {
    if (volume) {
      if (audioRef.current) {
        audioRef.current.volume = volume / 100;
      }
    }
  }, [volume]);

  useEffect(() => {
    setTimeRemaining(duration);
  }, [duration]);

  useEffect(() => {
    if (isPlaying) {
      if (audioRef.current && isAudioReady) {
        try {
          const playPromise = audioRef.current.play();
          
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.error('Error playing audio:', error);
              setIsPlaying(false);
              setAudioError('Unable to play the meditation audio');
              toast({
                title: "Playback Error",
                description: "Unable to play the meditation audio. Please try again.",
                variant: "destructive",
              });
            });
          }
        } catch (error) {
          console.error('Error playing audio:', error);
          setIsPlaying(false);
          setAudioError('Unable to play the meditation audio');
        }
      } else if (!isAudioReady && !isAudioLoading) {
        setIsPlaying(false);
        if (!audioError) {
          setAudioError('Audio not ready');
        }
        return;
      }
      
      setIsDimmed(true);
      setScreenBrightness(20);
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
  }, [isPlaying, setIsDimmed, isAudioReady, isAudioLoading, audioError, duration]);

  const togglePlayPause = () => {
    if (isAudioLoading) {
      toast({
        title: "Loading",
        description: "The meditation audio is still loading. Please wait.",
      });
      return;
    }
    
    if (audioError) {
      // Reset error state and try loading again
      setIsAudioLoading(true);
      setAudioError(null);
      setLoadAttempts(0);
      
      toast({
        title: "Reloading Audio",
        description: "Attempting to reload the meditation audio.",
      });
      return;
    }
    
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
    
    restoreOriginalSettings();
    setIsDimmed(false);
    
    toast({
      title: "Meditation Complete",
      description: "Your meditation session has ended.",
    });
  };

  const resetSession = () => {
    setIsPlaying(false);
    setTimeRemaining(duration);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  const tryAlternativeUrl = () => {
    if (!selectedMeditation) return;
    
    setLoadAttempts(curr => curr + 1);
    setIsAudioLoading(true);
    setAudioError(null);
    
    toast({
      title: "Trying Alternative Source",
      description: "Attempting to load from a different audio source.",
    });
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
                disabled={isAudioLoading}
              >
                {isPlaying ? (
                  <Pause size={24} />
                ) : (
                  <Play size={24} className="ml-1" />
                )}
              </Button>
            </div>
            
            <div className="text-center mt-4">
              <h2 className="text-lg font-medium">
                {selectedMeditation?.title || 'Self-Compassion Break'}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {isAudioLoading ? (
                  <span className="inline-flex items-center">
                    <span className="animate-pulse-slow mr-2">●</span> Loading audio...
                  </span>
                ) : audioError ? (
                  <span className="text-destructive">
                    {audioError}. <Button variant="link" size="sm" className="p-0 h-auto text-sm underline" onClick={tryAlternativeUrl}>Try alternative source</Button>
                  </span>
                ) : (
                  selectedMeditation?.description || 'A practice to remind yourself to apply self-compassion'
                )}
              </p>
            </div>
            
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
      
      {!isPlaying && (
        <div className="p-8 animate-slide-up">
          <DurationSelector className="mb-4" />
        </div>
      )}
    </div>
  );
};

export default Session;
