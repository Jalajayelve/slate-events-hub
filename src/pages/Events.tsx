
import { useState } from "react";
import { Navbar } from "@/components/ui/navbar";
import { EventCard } from "@/components/ui/event-card";
import { CreateEventDialog } from "@/components/ui/create-event-dialog";
import { useEvents } from "@/context/EventContext";
import { Event, EventCategory } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";

const Events = () => {
  const { events, addEvent, filterEvents } = useEvents();
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<EventCategory | undefined>(undefined);
  
  const categories: EventCategory[] = [
    "academic", "cultural", "sports", "tech", "workshop", "seminar", "social", "other"
  ];
  
  const filteredEvents = activeFilter ? filterEvents(activeFilter) : events;
  
  const handleCreateEvent = (eventData: Event) => {
    addEvent(eventData);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <div className="pt-28 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">All Events</h1>
              <p className="text-muted-foreground">
                Discover and join upcoming events on campus
              </p>
            </div>
            <Button 
              className="apple-button mt-4 md:mt-0"
              onClick={() => setIsCreateEventOpen(true)}
            >
              <Plus className="mr-2 h-5 w-5" />
              Create Event
            </Button>
          </div>
          
          {/* Filters */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-3">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filter by category:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={activeFilter === undefined ? "default" : "outline"}
                size="sm"
                className={activeFilter === undefined ? "apple-button" : "bg-secondary/50 border-white/10"}
                onClick={() => setActiveFilter(undefined)}
              >
                All
              </Button>
              
              {categories.map(category => (
                <Button
                  key={category}
                  variant={activeFilter === category ? "default" : "outline"}
                  size="sm"
                  className={activeFilter === category ? "apple-button" : "bg-secondary/50 border-white/10"}
                  onClick={() => setActiveFilter(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Events grid */}
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-xl text-muted-foreground">
                No events found for this category.
              </p>
              <Button 
                variant="link" 
                className="text-primary mt-2"
                onClick={() => setActiveFilter(undefined)}
              >
                View all events
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <CreateEventDialog
        isOpen={isCreateEventOpen}
        onClose={() => setIsCreateEventOpen(false)}
        onCreateEvent={handleCreateEvent}
      />
    </div>
  );
};

export default Events;
