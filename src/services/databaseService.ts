
import { DbConfig, DbResponse, Event, EventCategory } from "@/types";

/**
 * This service connects to the Express API that interfaces with PostgreSQL.
 */
export class DatabaseService {
  private config: DbConfig | null = null;
  
  /**
   * Initialize database connection configuration
   */
  public setConfig(config: DbConfig): void {
    this.config = config;
    console.log("Database configuration set:", {
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.user,
      apiUrl: config.apiUrl
      // Password hidden for security
    });
  }
  
  /**
   * Check if database is configured
   */
  public isConfigured(): boolean {
    return this.config !== null;
  }
  
  /**
   * Get all events from the database via API
   */
  public async getEvents(): Promise<DbResponse<Event[]>> {
    if (!this.isConfigured()) {
      return { 
        success: false, 
        error: "Database not configured" 
      };
    }
    
    try {
      const response = await fetch(`${this.config?.apiUrl}/api/events`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch events');
      }
      
      const events = await response.json();
      console.log("Received events from API:", events);
      
      // Map the API response to match our Event interface
      const mappedEvents: Event[] = events.map((event: any) => ({
        id: event.id ? event.id.toString() : crypto.randomUUID(),
        title: event.title,
        description: event.description,
        location: event.location,
        startDate: this.combineDateTime(event.event_date, event.event_time),
        endDate: this.combineDateTime(event.event_date, event.event_time), // Using same for now
        category: event.category as EventCategory,
        organizer: event.organizer,
        imageUrl: event.image_url,
        attendees: event.attendees || 0
      }));
      
      return {
        success: true,
        data: mappedEvents
      };
    } catch (error) {
      console.error("Failed to fetch events:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }
  
  /**
   * Helper method to combine date and time into ISO string
   */
  private combineDateTime(date: string, time: string): string {
    if (!date || !time) {
      return new Date().toISOString(); // Default to current time if missing
    }
    
    try {
      const [year, month, day] = date.split('-');
      const [hours, minutes] = time.split(':');
      
      const dateObj = new Date(
        parseInt(year), 
        parseInt(month) - 1, 
        parseInt(day), 
        parseInt(hours), 
        parseInt(minutes)
      );
      
      return dateObj.toISOString();
    } catch (error) {
      console.error("Error combining date and time:", error);
      return new Date().toISOString(); // Fallback to current time
    }
  }
  
  /**
   * Create a new event in the database via API
   */
  public async createEvent(event: Omit<Event, "id">): Promise<DbResponse<Event>> {
    if (!this.isConfigured()) {
      return { 
        success: false, 
        error: "Database not configured" 
      };
    }
    
    try {
      // Extract date and time from ISO strings for the API
      const startDateTime = new Date(event.startDate);
      
      // Format date as YYYY-MM-DD
      const startDate = startDateTime.toISOString().split('T')[0];
      
      // Format time as HH:MM:00
      const hours = startDateTime.getHours().toString().padStart(2, '0');
      const minutes = startDateTime.getMinutes().toString().padStart(2, '0');
      const startTime = `${hours}:${minutes}:00`;
      
      // Prepare the event data for the API in the format expected by Express
      const eventData = {
        title: event.title,
        description: event.description,
        date: startDate,
        time: startTime,
        location: event.location,
        organizer: event.organizer,
        category: event.category,
        imageUrl: event.imageUrl || 'https://placekitten.com/300/200', // Default image if none provided
        attendees: event.attendees || 0
      };
      
      console.log("Sending event data to API:", eventData);
      console.log("API URL:", `${this.config?.apiUrl}/api/events`);
      
      // Send the event to the API
      const response = await fetch(`${this.config?.apiUrl}/api/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error response:", errorText);
        
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.error || 'Failed to create event');
        } catch (e) {
          throw new Error(`Failed to create event: ${response.status} ${response.statusText}`);
        }
      }
      
      const createdEvent = await response.json();
      console.log("Event created successfully:", createdEvent);
      
      // Map the API response to match our Event interface
      const mappedEvent: Event = {
        id: createdEvent.id ? createdEvent.id.toString() : crypto.randomUUID(),
        title: createdEvent.title,
        description: createdEvent.description,
        location: createdEvent.location,
        startDate: this.combineDateTime(createdEvent.event_date, createdEvent.event_time),
        endDate: this.combineDateTime(createdEvent.event_date, createdEvent.event_time), // Using same for now
        category: createdEvent.category as EventCategory,
        organizer: createdEvent.organizer,
        imageUrl: createdEvent.image_url || event.imageUrl,
        attendees: createdEvent.attendees || 0
      };
      
      return {
        success: true,
        data: mappedEvent
      };
    } catch (error) {
      console.error("Failed to create event:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }
  
  /**
   * Get an event by ID from the database
   */
  public async getEventById(id: string): Promise<DbResponse<Event>> {
    if (!this.isConfigured()) {
      return { 
        success: false, 
        error: "Database not configured" 
      };
    }
    
    try {
      // For now, we'll just fetch all events and find the one with matching ID
      // You can implement a specific endpoint in your API for this
      const eventsResponse = await this.getEvents();
      
      if (!eventsResponse.success) {
        return {
          success: false,
          error: eventsResponse.error
        };
      }
      
      const event = eventsResponse.data?.find(e => e.id === id);
      
      if (!event) {
        return {
          success: false,
          error: "Event not found"
        };
      }
      
      return {
        success: true,
        data: event
      };
    } catch (error) {
      console.error("Failed to fetch event:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }
  
  /**
   * Get events by category from the database
   */
  public async getEventsByCategory(category: EventCategory): Promise<DbResponse<Event[]>> {
    // For now, we'll just fetch all events and filter by category
    // You can implement a specific endpoint in your API for this
    const eventsResponse = await this.getEvents();
    
    if (!eventsResponse.success) {
      return eventsResponse;
    }
    
    const filteredEvents = eventsResponse.data?.filter(e => e.category === category);
    
    return {
      success: true,
      data: filteredEvents || []
    };
  }
}

// Create a singleton instance to be used throughout the app
export const dbService = new DatabaseService();
