
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Clock } from 'lucide-react';
import { Meditation, useMeditation } from '@/context/MeditationContext';
import { useNavigate } from 'react-router-dom';
import { formatAudioDuration } from '@/utils/brightness';

interface MeditationCardProps {
  meditation: Meditation;
  className?: string;
}

const MeditationCard: React.FC<MeditationCardProps> = ({ meditation, className }) => {
  const { setSelectedMeditation, setDuration } = useMeditation();
  const navigate = useNavigate();
  
  const startMeditation = () => {
    setSelectedMeditation(meditation);
    setDuration(meditation.duration);
    navigate('/session');
  };
  
  return (
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-md ${className} animate-fade-in`}>
      <div className="relative h-36 overflow-hidden">
        <img 
          src={meditation.imageUrl} 
          alt={meditation.title} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="absolute bottom-4 left-4 flex items-center text-white">
          <Clock size={14} className="mr-1.5" />
          <span className="text-sm font-medium">{formatAudioDuration(meditation.duration)}</span>
        </div>
      </div>
      
      <CardContent className="pt-4">
        <h3 className="font-medium text-lg text-balance">{meditation.title}</h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{meditation.description}</p>
      </CardContent>
      
      <CardFooter className="pt-0 pb-4">
        <Button
          variant="secondary"
          size="sm"
          className="w-full gap-2 hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
          onClick={startMeditation}
        >
          <Play size={16} />
          <span>Begin</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MeditationCard;
