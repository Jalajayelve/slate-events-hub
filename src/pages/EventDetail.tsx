
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/ui/navbar";
import { useEvents } from "@/context/EventContext";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import { Calendar, Clock, MapPin, User, Users, Share2, ChevronLeft } from "lucide-react";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEventById } = useEvents();
  const event = getEventById(id || "");
  
  if (!event) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="pt-32 container mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Event Not Found</h1>
          <p className="text-muted-foreground mb-8">The event you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/events')}>
            View All Events
          </Button>
        </div>
      </div>
    );
  }
  
  const startDate = parseISO(event.startDate);
  const endDate = parseISO(event.endDate);
  const formattedStartDate = format(startDate, "EEEE, MMMM d, yyyy");
  const formattedStartTime = format(startDate, "h:mm a");
  const formattedEndTime = format(endDate, "h:mm a");
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <div className="pt-20 pb-20">
        {/* Hero image */}
        <div className="w-full h-[40vh] relative">
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10" />
          <img 
            src={event.imageUrl || "/placeholder.svg"} 
            alt={event.title} 
            className="w-full h-full object-cover object-center"
          />
        </div>
        
        {/* Content */}
        <div className="container mx-auto max-w-4xl px-4 -mt-20 relative z-20">
          <Button 
            variant="outline" 
            className="mb-6 bg-secondary/50 border-white/10"
            onClick={() => navigate('/events')}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Button>
          
          <div className="glass-morphism p-8 rounded-xl">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-gradient-primary">{event.title}</h1>
              <span 
                className="px-3 py-1 text-xs font-medium rounded-full bg-accent/80 text-white"
              >
                {event.category}
              </span>
            </div>
            
            <p className="text-lg text-muted-foreground mb-8">{event.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-3 text-primary" />
                  <div>
                    <p className="font-medium">Date</p>
                    <p className="text-muted-foreground">{formattedStartDate}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-3 text-primary" />
                  <div>
                    <p className="font-medium">Time</p>
                    <p className="text-muted-foreground">{formattedStartTime} - {formattedEndTime}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-3 text-primary" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-muted-foreground">{event.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <User className="h-5 w-5 mr-3 text-primary" />
                  <div>
                    <p className="font-medium">Organizer</p>
                    <p className="text-muted-foreground">{event.organizer}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {event.attendees && (
              <div className="flex items-center mb-8 bg-secondary/30 p-4 rounded-lg">
                <Users className="h-5 w-5 mr-3 text-primary" />
                <p><span className="font-medium">{event.attendees}</span> people are attending this event</p>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="apple-button flex-1">
                Register for Event
              </Button>
              <Button variant="outline" className="bg-secondary/50 border-white/10">
                <Share2 className="mr-2 h-4 w-4" />
                Share Event
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
