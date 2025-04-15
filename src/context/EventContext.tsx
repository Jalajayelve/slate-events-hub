
import { createContext, useState, useContext, ReactNode } from "react";
import { Event, EventCategory } from "@/types";
import { addDays, format } from "date-fns";

// Sample event data
const generateMockEvents = (): Event[] => {
  const today = new Date();
  
  const mockEvents: Event[] = [
    {
      id: "1",
      title: "Tech Innovations Summit",
      description: "Explore cutting-edge technologies and innovations that are shaping the future of our digital landscape. Join industry leaders and innovators for insightful discussions.",
      location: "Main Auditorium",
      startDate: addDays(today, 5).toISOString(),
      endDate: addDays(today, 5).toISOString(),
      category: "tech",
      organizer: "Computer Science Department",
      imageUrl: "https://images.unsplash.com/photo-1573164713712-03790a178651?q=80&w=2069",
      attendees: 120
    },
    {
      id: "2",
      title: "Annual Cultural Festival",
      description: "Celebrate diversity through music, dance, and art at our annual cultural extravaganza. Featuring performances from students representing cultures from around the world.",
      location: "Campus Grounds",
      startDate: addDays(today, 15).toISOString(),
      endDate: addDays(today, 17).toISOString(),
      category: "cultural",
      organizer: "Student Council",
      imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2074",
      attendees: 500
    },
    {
      id: "3",
      title: "Research Symposium",
      description: "A platform for students and faculty to present their latest research findings and academic achievements. Network with peers and receive valuable feedback.",
      location: "Science Block Conference Hall",
      startDate: addDays(today, 3).toISOString(),
      endDate: addDays(today, 4).toISOString(),
      category: "academic",
      organizer: "Research Department",
      imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070",
      attendees: 75
    },
    {
      id: "4",
      title: "Entrepreneurship Workshop",
      description: "Learn the essentials of starting and growing a successful business. Gain insights from experienced entrepreneurs and venture capitalists.",
      location: "Business School",
      startDate: addDays(today, 7).toISOString(),
      endDate: addDays(today, 7).toISOString(),
      category: "workshop",
      organizer: "Business Administration Department",
      imageUrl: "https://images.unsplash.com/photo-1551818255-e6e10975bc17?q=80&w=2073",
      attendees: 50
    },
    {
      id: "5",
      title: "Intercollegiate Sports Tournament",
      description: "Compete against teams from other colleges in various sports including basketball, football, and athletics. Show your skills and win exciting prizes.",
      location: "Sports Complex",
      startDate: addDays(today, 20).toISOString(),
      endDate: addDays(today, 22).toISOString(),
      category: "sports",
      organizer: "Sports Committee",
      imageUrl: "https://images.unsplash.com/photo-1587384474102-ba6b2c50f44a?q=80&w=2070",
      attendees: 300
    },
    {
      id: "6",
      title: "Career Fair 2025",
      description: "Connect with potential employers, learn about job opportunities, and get your resume reviewed by industry professionals.",
      location: "Central Hall",
      startDate: addDays(today, 10).toISOString(),
      endDate: addDays(today, 11).toISOString(),
      category: "seminar",
      organizer: "Career Development Center",
      imageUrl: "https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?q=80&w=2070",
      attendees: 400
    }
  ];
  
  return mockEvents;
};

interface EventContextType {
  events: Event[];
  addEvent: (event: Event) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (id: string) => void;
  getEventById: (id: string) => Event | undefined;
  filterEvents: (category?: EventCategory) => Event[];
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>(generateMockEvents());
  
  const addEvent = (event: Event) => {
    setEvents(prev => [...prev, event]);
  };
  
  const updateEvent = (event: Event) => {
    setEvents(prev => prev.map(e => e.id === event.id ? event : e));
  };
  
  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };
  
  const getEventById = (id: string) => {
    return events.find(e => e.id === id);
  };
  
  const filterEvents = (category?: EventCategory) => {
    if (!category) return events;
    return events.filter(e => e.category === category);
  };
  
  return (
    <EventContext.Provider 
      value={{ 
        events, 
        addEvent, 
        updateEvent, 
        deleteEvent, 
        getEventById,
        filterEvents
      }}
    >
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEvents must be used within an EventProvider");
  }
  return context;
}
