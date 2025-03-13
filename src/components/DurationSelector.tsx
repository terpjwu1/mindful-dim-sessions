
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useMeditation } from '@/context/MeditationContext';

const durations = [
  { value: 180, label: '3 min' },
  { value: 300, label: '5 min' },
  { value: 600, label: '10 min' },
];

const DurationSelector: React.FC<{ className?: string }> = ({ className }) => {
  const { duration, setDuration } = useMeditation();
  
  return (
    <div className={cn('flex gap-2 justify-center', className)}>
      {durations.map((option) => (
        <Button
          key={option.value}
          variant={duration === option.value ? 'default' : 'outline'}
          className={cn(
            'rounded-full px-4 py-1 h-auto transition-all duration-300',
            duration === option.value 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-background border-border hover:border-primary/50'
          )}
          onClick={() => setDuration(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
};

export default DurationSelector;
