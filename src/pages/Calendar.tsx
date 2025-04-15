
import { useState } from "react";
import { Navbar } from "@/components/ui/navbar";
import { useEvents } from "@/context/EventContext";
import { Event } from "@/types";
import { format, parseISO, isEqual, isSameMonth, isToday, addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

interface CalendarDayProps {
  day: Date;
  events: Event[];
  currentMonth: Date;
}

const CalendarDay = ({ day, events, currentMonth }: CalendarDayProps) => {
  const eventsOnDay = events.filter(event => {
    const eventDate = parseISO(event.startDate);
    return isEqual(
      new Date(day.getFullYear(), day.getMonth(), day.getDate()),
      new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate())
    );
  });

  const isCurrentMonth = isSameMonth(day, currentMonth);
  const isToday_ = isToday(day);

  return (
    <div 
      className={`min-h-[120px] p-2 border border-border/40 ${
        !isCurrentMonth ? 'bg-secondary/20 opacity-50' : 
        isToday_ ? 'bg-accent/10 ring-1 ring-accent/30' : ''
      } hover:bg-secondary/40 transition-colors`}
    >
      <div className={`text-right ${isToday_ ? 'text-accent font-bold' : ''}`}>
        {format(day, 'd')}
      </div>
      <div className="mt-2 space-y-1">
        {eventsOnDay.map(event => (
          <a 
            key={event.id} 
            href={`/events/${event.id}`}
            className={`block text-xs truncate p-1 rounded text-white ${
              event.category === 'tech' ? 'bg-blue-500/80' :
              event.category === 'cultural' ? 'bg-purple-500/80' :
              event.category === 'academic' ? 'bg-green-500/80' :
              event.category === 'sports' ? 'bg-orange-500/80' :
              event.category === 'workshop' ? 'bg-sky-500/80' :
              event.category === 'seminar' ? 'bg-fuchsia-500/80' :
              event.category === 'social' ? 'bg-rose-500/80' :
              'bg-slate-500/80'
            }`}
          >
            {event.title}
          </a>
        ))}
      </div>
    </div>
  );
};

const Calendar = () => {
  const { events } = useEvents();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const renderCalendar = () => {
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const startDate = new Date(monthStart);
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Start from the previous Sunday
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    const calendar = [];
    let day = startDate;
    
    // Header row with weekdays
    calendar.push(
      <div key="header" className="grid grid-cols-7">
        {weekdays.map(weekday => (
          <div key={weekday} className="p-2 text-center font-medium">
            {weekday}
          </div>
        ))}
      </div>
    );
    
    // Calendar days
    let rows = [];
    let days = [];
    
    // Continue until we reach a date beyond the end of the current month
    while (day <= monthEnd || days.length % 7 !== 0) {
      days.push(
        <CalendarDay 
          key={day.toString()} 
          day={new Date(day)} 
          events={events}
          currentMonth={currentMonth}
        />
      );
      
      day.setDate(day.getDate() + 1);
      
      if (days.length === 7) {
        rows.push(
          <div key={`row-${rows.length}`} className="grid grid-cols-7">
            {days}
          </div>
        );
        days = [];
      }
    }
    
    calendar.push(...rows);
    return calendar;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <div className="pt-28 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center">
                <CalendarIcon className="mr-3 h-8 w-8 text-primary" />
                Events Calendar
              </h1>
              <p className="text-muted-foreground">
                View and plan your schedule with our interactive events calendar
              </p>
            </div>
            
            <div className="flex items-center space-x-2 mt-4 md:mt-0 glass-morphism p-2 rounded-lg">
              <button 
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="p-1.5 hover:bg-secondary/50 rounded-md transition-colors"
                aria-label="Previous month"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              <h2 className="text-lg font-medium px-2">
                {format(currentMonth, 'MMMM yyyy')}
              </h2>
              
              <button 
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="p-1.5 hover:bg-secondary/50 rounded-md transition-colors"
                aria-label="Next month"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              
              <button 
                onClick={() => setCurrentMonth(new Date())}
                className="ml-2 px-3 py-1 text-sm bg-secondary/70 hover:bg-secondary/90 rounded-md transition-colors"
              >
                Today
              </button>
            </div>
          </div>
          
          <div className="glass-morphism p-4 rounded-xl overflow-auto">
            {renderCalendar()}
          </div>
          
          <div className="mt-6 flex flex-wrap gap-2">
            <div className="text-sm"><span className="inline-block w-3 h-3 mr-1 bg-blue-500/80 rounded-sm"></span> Tech</div>
            <div className="text-sm"><span className="inline-block w-3 h-3 mr-1 bg-purple-500/80 rounded-sm"></span> Cultural</div>
            <div className="text-sm"><span className="inline-block w-3 h-3 mr-1 bg-green-500/80 rounded-sm"></span> Academic</div>
            <div className="text-sm"><span className="inline-block w-3 h-3 mr-1 bg-orange-500/80 rounded-sm"></span> Sports</div>
            <div className="text-sm"><span className="inline-block w-3 h-3 mr-1 bg-sky-500/80 rounded-sm"></span> Workshop</div>
            <div className="text-sm"><span className="inline-block w-3 h-3 mr-1 bg-fuchsia-500/80 rounded-sm"></span> Seminar</div>
            <div className="text-sm"><span className="inline-block w-3 h-3 mr-1 bg-rose-500/80 rounded-sm"></span> Social</div>
            <div className="text-sm"><span className="inline-block w-3 h-3 mr-1 bg-slate-500/80 rounded-sm"></span> Other</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
