
import { useState } from "react";
import { Navbar } from "@/components/ui/navbar";
import { EventCard } from "@/components/ui/event-card";
import { CreateEventDialog } from "@/components/ui/create-event-dialog";
import { useEvents } from "@/context/EventContext";
import { Event } from "@/types";
import { Button } from "@/components/ui/button";
import { Calendar, Plus } from "lucide-react";

const Index = () => {
  const { events, addEvent } = useEvents();
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  
  const upcomingEvents = [...events]
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 6);

  const handleCreateEvent = (eventData: Event) => {
    // In a real app, this would send the data to a backend API
    // For now, we'll just add it to our local state
    addEvent(eventData);
    console.log("Event created:", eventData);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      {/* Hero section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-gradient-primary">
              Slate Events Hub
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Discover, create, and manage campus events with ease.
            </p>
            <div className="flex items-center justify-center space-x-4 pt-4">
              <Button 
                className="apple-button flex items-center"
                onClick={() => setIsCreateEventOpen(true)}
              >
                <Plus className="mr-2 h-5 w-5" />
                Create Event
              </Button>
              <Button 
                variant="outline" 
                className="bg-secondary/50 border-white/10 hover:bg-secondary"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Browse Events
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured events section */}
      <section className="py-16 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-10 flex justify-between items-center">
            <h2 className="text-2xl md:text-3xl font-semibold">Upcoming Events</h2>
            <Button 
              variant="link" 
              className="text-primary hover:text-accent"
              onClick={() => window.location.href = '/events'}
            >
              View All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Create event dialog */}
      <CreateEventDialog
        isOpen={isCreateEventOpen}
        onClose={() => setIsCreateEventOpen(false)}
        onCreateEvent={handleCreateEvent}
      />
    </div>
  );
};

export default Index;
