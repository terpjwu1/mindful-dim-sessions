
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
    title: 'Self-Compassion Break',
    description: 'A practice to remind yourself to apply the three components of self-compassion in daily life.',
    audioUrl: 'https://self-compassion.org/wp-content/uploads/2015/12/self-compassion.break_.mp3',
    duration: 300, // 5 minutes in seconds
    isDefault: true,
    imageUrl: '/placeholder.svg'
  },
  {
    id: '2',
    title: 'Affectionate Breathing',
    description: 'A meditation on the breath, with a focus on gentle, affectionate awareness.',
    audioUrl: 'https://self-compassion.org/wp-content/uploads/meditations/affectionatebreathing.mp3',
    duration: 1320, // 22 minutes in seconds
    isDefault: true,
    imageUrl: '/placeholder.svg'
  },
  {
    id: '3',
    title: 'Loving-Kindness Meditation',
    description: 'A meditation that focuses on developing feelings of goodwill, kindness, and warmth towards ourselves and others.',
    audioUrl: 'https://self-compassion.org/wp-content/uploads/meditations/LKM.self-compassion.mp3',
    duration: 1200, // 20 minutes in seconds
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
