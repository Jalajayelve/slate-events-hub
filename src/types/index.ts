
export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  category: EventCategory;
  organizer: string;
  imageUrl?: string;
  attendees?: number;
}

export type EventCategory = 
  | 'academic' 
  | 'cultural' 
  | 'sports' 
  | 'tech' 
  | 'workshop' 
  | 'seminar' 
  | 'social' 
  | 'other';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  savedEvents?: string[]; // Event IDs
}
