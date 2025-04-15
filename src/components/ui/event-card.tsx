
import { Event } from "@/types";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDistanceToNow, format, parseISO } from "date-fns";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const startDate = parseISO(event.startDate);
  const isUpcoming = startDate > new Date();
  const formattedDate = format(startDate, "MMM d, yyyy");
  const formattedTime = format(startDate, "h:mm a");
  const timeAgo = formatDistanceToNow(startDate, { addSuffix: true });
  
  const getCategoryColor = (category: string) => {
    switch(category) {
      case "tech": return "from-blue-500 to-indigo-500";
      case "academic": return "from-emerald-500 to-green-500";
      case "cultural": return "from-pink-500 to-purple-500";
      case "sports": return "from-amber-500 to-orange-500";
      case "workshop": return "from-cyan-500 to-sky-500";
      case "seminar": return "from-violet-500 to-fuchsia-500";
      case "social": return "from-rose-500 to-red-500";
      default: return "from-gray-500 to-slate-500";
    }
  };

  return (
    <Link 
      to={`/events/${event.id}`} 
      className="apple-card group overflow-hidden flex flex-col h-full animate-scale-in"
    >
      {/* Image section */}
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent z-10" />
        <img 
          src={event.imageUrl || "/placeholder.svg"} 
          alt={event.title} 
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 z-10">
          <span 
            className={`px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r ${getCategoryColor(event.category)} text-white`}
          >
            {event.category}
          </span>
        </div>
        {isUpcoming && (
          <div className="absolute bottom-3 left-3 z-10">
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-accent/80 text-white">
              {timeAgo}
            </span>
          </div>
        )}
      </div>
      
      {/* Content section */}
      <div className="flex flex-col flex-grow p-4 space-y-3">
        <h3 className="text-lg font-medium line-clamp-2">{event.title}</h3>
        <p className="text-muted-foreground line-clamp-2 text-sm">{event.description}</p>
        
        <div className="flex flex-col space-y-2 mt-auto pt-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            {formattedDate}
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-2" />
            {formattedTime}
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2" />
            {event.location}
          </div>
          
          {event.attendees && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-4 w-4 mr-2" />
              {event.attendees} attendees
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
