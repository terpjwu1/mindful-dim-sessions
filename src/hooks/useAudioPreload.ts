
import { useEffect } from 'react';
import { useMeditation } from '@/context/MeditationContext';
import { toast } from '@/components/ui/use-toast';

export const useAudioPreload = () => {
  const { meditations } = useMeditation();
  
  useEffect(() => {
    const preloadAudio = async () => {
      try {
        // Check if the audio files are available
        const audioFiles = meditations.map(m => m.audioUrl);
        
        for (const audioUrl of audioFiles) {
          const audio = new Audio();
          audio.preload = 'metadata';
          audio.src = audioUrl;
          
          console.log(`Preloading audio: ${audioUrl}`);
          
          // Just load metadata to check if file exists
          audio.load();
        }
      } catch (error) {
        console.error('Error preloading audio:', error);
        toast({
          title: "Audio Preload Warning",
          description: "Some meditation audio files might not be available. Please check your internet connection.",
          variant: "destructive",
        });
      }
    };
    
    preloadAudio();
  }, [meditations]);
};
