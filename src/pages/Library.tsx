
import React, { useState } from 'react';
import Header from '@/components/Header';
import MeditationCard from '@/components/MeditationCard';
import { useMeditation, Meditation } from '@/context/MeditationContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Upload } from 'lucide-react';

const Library = () => {
  const { meditations, addMeditation } = useMeditation();
  const [newMeditation, setNewMeditation] = useState<Partial<Meditation>>({
    title: '',
    description: '',
    duration: 300,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddMeditation = () => {
    if (newMeditation.title) {
      addMeditation(newMeditation);
      setNewMeditation({
        title: '',
        description: '',
        duration: 300,
      });
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <main className="container px-4 pt-8 pb-20 max-w-md mx-auto">
        <div className="space-y-6 animate-fade-in">
          {/* Header */}
          <section className="flex justify-between items-center">
            <h1 className="text-2xl font-medium">Meditation Library</h1>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="icon" variant="ghost" className="rounded-full">
                  <Plus size={20} />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Meditation</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-2">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Title</label>
                    <Input 
                      placeholder="Enter meditation title"
                      value={newMeditation.title}
                      onChange={(e) => setNewMeditation({...newMeditation, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Description</label>
                    <Textarea 
                      placeholder="Describe this meditation"
                      value={newMeditation.description}
                      onChange={(e) => setNewMeditation({...newMeditation, description: e.target.value})}
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Duration (minutes)</label>
                    <select 
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={newMeditation.duration}
                      onChange={(e) => setNewMeditation({...newMeditation, duration: Number(e.target.value)})}
                    >
                      <option value={180}>3 minutes</option>
                      <option value={300}>5 minutes</option>
                      <option value={600}>10 minutes</option>
                    </select>
                  </div>
                  <div>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start gap-2"
                      onClick={() => console.log("This would open a file picker in a real app")}
                    >
                      <Upload size={16} />
                      <span>Upload Audio File</span>
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1">MP3 format recommended</p>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddMeditation}>Add Meditation</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </section>
          
          {/* Default Meditations */}
          <section className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground">Default Meditations</h2>
            <div className="grid grid-cols-1 gap-4">
              {meditations.filter(m => m.isDefault).map(meditation => (
                <MeditationCard 
                  key={meditation.id} 
                  meditation={meditation} 
                />
              ))}
            </div>
          </section>
          
          {/* Custom Meditations */}
          {meditations.filter(m => !m.isDefault).length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-medium text-muted-foreground">Your Meditations</h2>
              <div className="grid grid-cols-1 gap-4">
                {meditations.filter(m => !m.isDefault).map(meditation => (
                  <MeditationCard 
                    key={meditation.id} 
                    meditation={meditation} 
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Header />
    </div>
  );
};

export default Library;
