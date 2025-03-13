
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Meditation {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  duration: number;
  isDefault: boolean;
  imageUrl: string;
}

interface MeditationContextType {
  meditations: Meditation[];
  selectedMeditation: Meditation | null;
  isPlaying: boolean;
  duration: number;
  setSelectedMeditation: (meditation: Meditation) => void;
  setDuration: (duration: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  addMeditation: (meditation: Partial<Meditation>) => void;
  isDimmed: boolean;
  setIsDimmed: (isDimmed: boolean) => void;
}

const defaultMeditations: Meditation[] = [
  {
    id: '1',
    title: 'Body Scan',
    description: 'A guided meditation to help you connect with your body.',
    audioUrl: '/meditations/body-scan.mp3',
    duration: 300, // 5 minutes in seconds
    isDefault: true,
    imageUrl: '/placeholder.svg'
  },
  {
    id: '2',
    title: 'Breath Awareness',
    description: 'Focus on your breath to anchor yourself in the present moment.',
    audioUrl: '/meditations/breath-awareness.mp3',
    duration: 180, // 3 minutes in seconds
    isDefault: true,
    imageUrl: '/placeholder.svg'
  },
  {
    id: '3',
    title: 'Mindful Relaxation',
    description: 'Release tension and find deep relaxation with this guided practice.',
    audioUrl: '/meditations/mindful-relaxation.mp3',
    duration: 600, // 10 minutes in seconds
    isDefault: true,
    imageUrl: '/placeholder.svg'
  }
];

const MeditationContext = createContext<MeditationContextType | undefined>(undefined);

export const MeditationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [meditations, setMeditations] = useState<Meditation[]>(defaultMeditations);
  const [selectedMeditation, setSelectedMeditation] = useState<Meditation | null>(null);
  const [duration, setDuration] = useState<number>(300); // Default 5 minutes
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isDimmed, setIsDimmed] = useState<boolean>(false);

  // Load meditations from local storage
  useEffect(() => {
    const savedMeditations = localStorage.getItem('meditations');
    if (savedMeditations) {
      try {
        const parsedMeditations = JSON.parse(savedMeditations);
        setMeditations([...defaultMeditations, ...parsedMeditations.filter((m: Meditation) => !m.isDefault)]);
      } catch (error) {
        console.error('Error parsing saved meditations:', error);
      }
    }
  }, []);

  // Save meditations to local storage when they change
  useEffect(() => {
    const customMeditations = meditations.filter(m => !m.isDefault);
    if (customMeditations.length > 0) {
      localStorage.setItem('meditations', JSON.stringify(customMeditations));
    }
  }, [meditations]);

  const addMeditation = (meditation: Partial<Meditation>) => {
    const newMeditation: Meditation = {
      id: Date.now().toString(),
      title: meditation.title || 'Untitled Meditation',
      description: meditation.description || '',
      audioUrl: meditation.audioUrl || '',
      duration: meditation.duration || 300,
      isDefault: false,
      imageUrl: meditation.imageUrl || '/placeholder.svg'
    };
    setMeditations([...meditations, newMeditation]);
  };

  return (
    <MeditationContext.Provider
      value={{
        meditations,
        selectedMeditation,
        isPlaying,
        duration,
        setSelectedMeditation,
        setDuration,
        setIsPlaying,
        addMeditation,
        isDimmed,
        setIsDimmed
      }}
    >
      {children}
    </MeditationContext.Provider>
  );
};

export const useMeditation = () => {
  const context = useContext(MeditationContext);
  if (context === undefined) {
    throw new Error('useMeditation must be used within a MeditationProvider');
  }
  return context;
};
