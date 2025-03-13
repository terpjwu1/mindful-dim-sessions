import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Moon, Library } from 'lucide-react';
import { useMeditation } from '@/context/MeditationContext';
import MeditationCard from '@/components/MeditationCard';
import Header from '@/components/Header';

const Index = () => {
  const { meditations } = useMeditation();
  const navigate = useNavigate();
  const featuredMeditations = meditations.slice(0, 2);
  
  return (
    <div className="min-h-screen bg-background pb-24">
      <main className="container px-4 pt-8 pb-20 max-w-md mx-auto">
        <div className="space-y-8 animate-fade-in">
          {/* Hero Section */}
          <section className="text-center pt-4 pb-8">
            <h1 className="text-3xl font-light tracking-tight mb-2">Mindful</h1>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              Simple, elegant meditation to bring awareness to your day
            </p>
          </section>
          
          {/* Quick Actions */}
          <section className="grid grid-cols-2 gap-4">
            <div 
              className="glass-card col-span-2 rounded-2xl p-6 aspect-[2/1] flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/50 transition-all duration-300"
              onClick={() => navigate('/session')}
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                <Moon size={24} className="text-primary" />
              </div>
              <h2 className="font-medium text-lg">Begin Meditation</h2>
              <p className="text-sm text-muted-foreground mt-1">Start your mindful practice</p>
            </div>
            <div 
              className="glass-card rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/50 transition-all duration-300"
              onClick={() => navigate('/library')}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 mb-2">
                <Library size={20} className="text-primary" />
              </div>
              <h3 className="font-medium">Library</h3>
            </div>
            <div className="glass-card rounded-2xl p-5 flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 to-primary/20 cursor-pointer hover:from-primary/10 hover:to-primary/30 transition-all duration-300">
              <div className="animate-pulse-slow">
                <div className="w-10 h-10 rounded-full border-2 border-primary/40 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-primary/20 animate-breathe"></div>
                </div>
              </div>
              <h3 className="font-medium mt-2">Breathe</h3>
            </div>
          </section>
          
          {/* Featured Meditations */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Featured</h2>
              <Button 
                variant="link" 
                className="text-sm text-primary p-0" 
                onClick={() => navigate('/library')}
              >
                View All
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {featuredMeditations.map(meditation => (
                <MeditationCard 
                  key={meditation.id} 
                  meditation={meditation} 
                  className="col-span-1" 
                />
              ))}
            </div>
          </section>
        </div>
      </main>
      <Header />
    </div>
  );
};

export default Index;
