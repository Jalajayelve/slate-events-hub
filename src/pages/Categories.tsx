
import { Navbar } from "@/components/ui/navbar";
import { useEvents } from "@/context/EventContext";
import { EventCard } from "@/components/ui/event-card";
import { EventCategory } from "@/types";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Categories = () => {
  const { events, filterEvents } = useEvents();
  const [activeCategory, setActiveCategory] = useState<EventCategory>("academic");
  
  const categories: EventCategory[] = [
    "academic", "cultural", "sports", "tech", "workshop", "seminar", "social", "other"
  ];
  
  const getCategoryIcon = (category: EventCategory) => {
    switch(category) {
      case "tech": return "💻";
      case "academic": return "📚";
      case "cultural": return "🎭";
      case "sports": return "🏆";
      case "workshop": return "🔧";
      case "seminar": return "🎓";
      case "social": return "🎉";
      default: return "📌";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <div className="pt-28 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold mb-2">Event Categories</h1>
          <p className="text-muted-foreground mb-8">
            Browse events by category to find exactly what you're looking for
          </p>
          
          <div className="mb-8 w-full flex flex-wrap justify-start gap-2 bg-transparent">
            {categories.map(category => (
              <Button 
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                className={activeCategory === category ? "apple-button" : "bg-secondary/50 border-white/10"}
                onClick={() => setActiveCategory(category)}
              >
                {getCategoryIcon(category)} {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>
          
          <div className="glass-morphism p-6 rounded-xl animate-fade-in">
            <h2 className="text-2xl font-semibold mb-6">
              {getCategoryIcon(activeCategory)} {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Events
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterEvents(activeCategory).length > 0 ? (
                filterEvents(activeCategory).map(event => (
                  <EventCard key={event.id} event={event} />
                ))
              ) : (
                <div className="col-span-3 py-20 text-center">
                  <p className="text-xl text-muted-foreground">
                    No {activeCategory} events found at this time.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
